import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { MessagingService } from './messaging';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Diagnostic Logging ---
app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  next();
});

app.get('/api/ping', (req, res) => res.json({ status: 'alive', time: new Date().toISOString() }));

/**
 * Admin: List all users in a Mandal
 */
app.get('/api/mandals/:mandalId/users', async (req, res) => {
  const { mandalId } = req.params;
  console.log(`[SERVER] Fetching users for mandal: ${mandalId}`);
  try {
    const users = await prisma.user.findMany({
      where: { mandalId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * Admin: List all Mandals (Global Directory)
 */
app.get('/api/admin/mandals', async (req, res) => {
  console.log(`[SERVER] Fetching all mandals`);
  try {
    const mandals = await prisma.mandal.findMany({
      include: { 
        _count: { select: { users: true, requests: true } },
        sponsor: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(mandals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mandals' });
  }
});

// --- Mandal & Onboarding Routes ---

/**
 * Create a new Walled Garden (Mandal)
 */
app.post('/api/mandals', async (req, res) => {
  const { name, sponsorName, sponsorLogo, sponsorLink, creatorId } = req.body;

  try {
    let sponsorId = null;
    if (sponsorName) {
      const sponsor = await prisma.sponsor.create({
        data: { name: sponsorName, logoUrl: sponsorLogo, link: sponsorLink }
      });
      sponsorId = sponsor.id;
    }

    const mandal = await prisma.mandal.create({
      data: {
        name,
        sponsorId,
        ownerId: creatorId,
        stats: { create: {} }
      },
      include: { sponsor: true }
    });

    // If creator is already logged in, upgrade them to ADMIN for this mandal
    if (creatorId) {
      await prisma.user.update({
        where: { id: creatorId },
        data: { role: 'ADMIN', mandalId: mandal.id, status: 'APPROVED' }
      });
    }

    const inviteLink = `${process.env.FRONTEND_URL}/join/${mandal.inviteCode}`;
    res.json({ mandal, inviteLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create mandal' });
  }
});

/**
 * Validate an invite link
 */
app.get('/api/join/:inviteCode', async (req, res) => {
  const { inviteCode } = req.params;
  try {
    const mandal = await prisma.mandal.findUnique({
      where: { inviteCode },
      include: { sponsor: true }
    });

    if (!mandal) {
      return res.status(404).json({ error: 'Mandal not found' });
    }

    res.json(mandal);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

/**
 * User Join / Login
 */
app.post('/api/auth/login', async (req, res) => {
  let { phone, mandalId, name } = req.body;
  
  // Normalize phone
  const hasPlus = phone.startsWith('+');
  phone = (hasPlus ? '+' : '') + phone.replace(/\D/g, '');

  try {
    let mandal = await prisma.mandal.findUnique({ where: { id: mandalId } });
    if (!mandal && mandalId === 'demo-id') {
      mandal = await prisma.mandal.create({
        data: {
          id: 'demo-id',
          name: 'Gilbert Neighbors',
          inviteCode: 'demo',
          stats: { create: {} }
        }
      });
    }

    if (!mandal) return res.status(404).json({ error: 'Mandal not found' });

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      // New User: Check if approval is required (Owner is always approved)
      const status = mandal.requireApproval ? 'PENDING' : 'APPROVED';
      user = await prisma.user.create({
        data: { phone, mandalId, name, role: 'MEMBER', status }
      });
    } else {
      user = await prisma.user.update({
        where: { phone },
        data: { mandalId }
      });
    }

    if (user.status === 'BANNED') {
      return res.status(403).json({ error: 'Your account has been restricted in this Mandal.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Admin: Update User Status (Approve/Ban)
 */
app.post('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // APPROVED | BANNED | PENDING

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// --- Request & Event Management ---

/**
 * Create a Communal Event with Slots
 */
app.post('/api/events', async (req, res) => {
  const { title, description, mandalId, requesterId, slots } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        mandalId,
        requests: {
          create: slots.map((s: any) => ({
            category: 'EVENT_SHIFT',
            dateTime: new Date(s.dateTime),
            location: s.location,
            notes: s.notes,
            maxVolunteers: s.maxVolunteers || 1,
            requesterId,
            mandalId
          }))
        }
      },
      include: { requests: true }
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * Submit a service request
 */
app.post('/api/requests', async (req, res) => {
  const { category, dateTime, location, notes, requesterId, mandalId, maxVolunteers } = req.body;

  try {
    // Status Check
    const user = await prisma.user.findUnique({ where: { id: requesterId } });
    if (!user || (user.status !== 'APPROVED' && user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Your account must be approved to post requests.' });
    }

    const request = await prisma.request.create({
      data: { 
        category, 
        dateTime: new Date(dateTime), 
        location, 
        notes, 
        requesterId, 
        mandalId,
        maxVolunteers: maxVolunteers || 1
      }
    });

    // Notify Volunteers
    await notifyVolunteers(request.id, mandalId, category, dateTime);

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

/**
 * Get tasks assigned to a specific volunteer
 */
app.get('/api/users/:userId/tasks', async (req, res) => {
  const { userId } = req.params;
  try {
    const assignments = await prisma.assignment.findMany({
      where: { userId },
      include: { request: { include: { requester: true, event: true } } }
    });
    res.json(assignments.map(a => a.request));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * Report a request as inappropriate
 */
app.post('/api/requests/:id/report', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await prisma.request.update({
      where: { id },
      data: { reportCount: { increment: 1 } }
    });
    
    // Auto-hide if reported 3+ times
    if (request.reportCount >= 3) {
      await prisma.request.update({
        where: { id },
        data: { isHidden: true }
      });
    }
    
    res.json({ success: true, count: request.reportCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report request' });
  }
});

/**
 * Admin: List all flagged requests
 */
app.get('/api/admin/flagged', async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: { 
        OR: [
          { reportCount: { gt: 0 } },
          { isHidden: true }
        ]
      },
      include: { requester: true, mandal: true },
      orderBy: { reportCount: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flagged requests' });
  }
});

/**
 * Admin: Delete or hide a request
 */
app.delete('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.request.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

/**
 * Get open requests in a Mandal (Including Event Slots)
 */
app.get('/api/mandals/:mandalId/requests', async (req, res) => {
  const { mandalId } = req.params;
  const { userId } = req.query;

  try {
    // Status Check
    if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId as string } });
        if (!user || (user.status !== 'APPROVED' && user.role !== 'ADMIN')) {
          return res.status(403).json({ error: 'Your account must be approved to view requests.' });
        }
    }

    const requests = await prisma.request.findMany({
      where: { 
        mandalId, 
        status: 'OPEN', 
        isHidden: false,
      },
      include: { 
        requester: true, 
        event: true,
        _count: { select: { assignments: true } }
      }
    });

    // Filter out requests that are already full
    const availableRequests = requests.filter(r => r._count.assignments < r.maxVolunteers);

    res.json(availableRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

/**
 * Match a request (Volunteer accepting)
 */
app.post('/api/requests/:id/match', async (req, res) => {
  const { id } = req.params;
  const { volunteerId } = req.body;

  try {
    // Transactional Signup
    await prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({
        where: { id },
        include: { _count: { select: { assignments: true } } }
      });

      if (!request || request.status !== 'OPEN') throw new Error('Task unavailable');
      if (request._count.assignments >= request.maxVolunteers) throw new Error('Task full');

      // Create assignment
      await tx.assignment.create({
        data: { userId: volunteerId, requestId: id }
      });

      // Check if now full
      const updatedCount = request._count.assignments + 1;
      if (updatedCount >= request.maxVolunteers) {
        await tx.request.update({
          where: { id },
          data: { status: 'MATCHED' }
        });
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Signup failed' });
  }
});

/**
 * Admin: Get Mandal settings (Sponsor, Stats, etc.)
 */
app.get('/api/mandals/:mandalId/settings', async (req, res) => {
  const { mandalId } = req.params;
  try {
    const mandal = await prisma.mandal.findUnique({
      where: { id: mandalId },
      include: { sponsor: true, stats: true }
    });
    res.json(mandal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * Admin: Update Mandal settings
 */
app.patch('/api/mandals/:mandalId/settings', async (req, res) => {
  const { mandalId } = req.params;
  const { name, sponsorName, sponsorLogo, sponsorLink, requireApproval } = req.body;

  try {
    const currentMandal = await prisma.mandal.findUnique({
      where: { id: mandalId },
      include: { sponsor: true }
    });

    let sponsorId = currentMandal?.sponsorId;

    if (sponsorName) {
      if (sponsorId) {
        await prisma.sponsor.update({
          where: { id: sponsorId },
          data: { name: sponsorName, logoUrl: sponsorLogo, link: sponsorLink }
        });
      } else {
        const newSponsor = await prisma.sponsor.create({
          data: { name: sponsorName, logoUrl: sponsorLogo, link: sponsorLink }
        });
        sponsorId = newSponsor.id;
      }
    }

    const mandal = await prisma.mandal.update({
      where: { id: mandalId },
      data: { name, sponsorId, requireApproval },
      include: { sponsor: true }
    });

    res.json(mandal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * Admin: Reset Fuel Tank (MOCK)
 */
app.post('/api/mandals/:mandalId/reset-stats', async (req, res) => {
  const { mandalId } = req.params;
  try {
    const stats = await prisma.mandalStats.update({
      where: { mandalId },
      data: { messagesSent: 0 }
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset stats' });
  }
});

/**
 * Mark a request as completed
 */
app.post('/api/requests/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await prisma.request.update({
      where: { id, status: 'MATCHED' },
      data: { status: 'COMPLETED' }
    });
    res.json(request);
  } catch (error) {
    res.status(400).json({ error: 'Request not found or not in a completable state' });
  }
});

/**
 * WhatsApp Webhook Verification (for Meta Setup)
 */
app.get('/api/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/**
 * WhatsApp Webhook Processing (Inbound clicks)
 */
app.post('/api/webhooks/whatsapp', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (message?.type === 'button') {
    const taskId = message.button.payload;
    const from = '+' + message.from;

    await processMatching(taskId, from);
  }
  
  res.sendStatus(200);
});

/**
 * Twilio SMS Webhook
 */
app.post('/api/webhooks/messaging', async (req, res) => {
  const { Body, From } = req.body; 
  const taskId = Body.trim(); 

  await processMatching(taskId, From);
  res.send('Success');
});

/**
 * Shared Matching Logic
 */
async function processMatching(taskId: string, phone: string) {
  try {
    const volunteer = await prisma.user.findUnique({ where: { phone } });
    if (!volunteer) return;

    // Transactional signup via Messaging
    await prisma.$transaction(async (tx) => {
        const request = await tx.request.findUnique({
          where: { id: taskId },
          include: { _count: { select: { assignments: true } } }
        });
  
        if (!request || request.status !== 'OPEN') return;
        if (request._count.assignments >= request.maxVolunteers) {
            await MessagingService.sendSMS(phone, 'Sorry, this task has already been taken.');
            return;
        }
  
        // Create assignment
        await tx.assignment.create({
          data: { userId: volunteer.id, requestId: taskId }
        });
  
        // Check if now full
        const updatedCount = request._count.assignments + 1;
        if (updatedCount >= request.maxVolunteers) {
          await tx.request.update({
            where: { id: taskId },
            data: { status: 'MATCHED' }
          });
        }

        await MessagingService.sendSMS(phone, `Mandal Alert: Task Matched! You are helping with ${request.category}. Check your hub for details.`);
      });
  } catch (error) {
    console.error('Matching Error:', error);
  }
}

// --- Helper Functions & Messaging Logic ---

async function notifyVolunteers(requestId: string, mandalId: string, category: string, date: string) {
  const volunteers = await prisma.user.findMany({
    where: { mandalId, role: { in: ['VOLUNTEER', 'ADMIN'] } } 
  });

  for (const v of volunteers) {
    // Attempt WhatsApp First, fallback to SMS simulation
    await MessagingService.sendWhatsAppNotification(v.phone, { id: requestId, category, date });
    const smsMessage = `Mandal Alert: ${category} needed on ${date}. Reply '${requestId}' to accept.`;
    await MessagingService.sendSMS(v.phone, smsMessage);
    await trackMessage(mandalId);
  }
}

async function trackMessage(mandalId: string) {
  const stats = await prisma.mandalStats.update({
    where: { mandalId },
    data: { messagesSent: { increment: 1 } }
  });

  if (stats.messagesSent >= stats.threshold) {
    console.log(`[FUEL TANK] Threshold reached for mandal ${mandalId}. Alerting Admin.`);
  }
}

app.get('/health', (req, res) => res.send('OK'));

app.listen(port, () => {
  console.log(`Mandal server running on port ${port}`);
});
