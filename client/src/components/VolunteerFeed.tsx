import React, { useEffect, useState } from 'react';
import api from '../api';
import { Calendar, MapPin, CheckCircle2, User, Clock, ChevronRight, Inbox, Award, Flag, ShieldAlert, Users } from 'lucide-react';

const VolunteerFeed = ({ mandalId, volunteerId }: { mandalId: string; volunteerId: string }) => {
  const [activeTab, setActiveTab] = useState<'available' | 'my-tasks'>('available');
  const [requests, setRequests] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const fetchData = async () => {
    try {
      const [reqRes, taskRes] = await Promise.all([
        api.get(`/api/mandals/${mandalId}/requests?userId=${volunteerId}`),
        api.get(`/api/users/${volunteerId}/tasks`)
      ]);
      setRequests(reqRes.data);
      setMyTasks(taskRes.data);
      setIsPending(false);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setIsPending(true);
      }
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [mandalId, volunteerId]);

  const handleAccept = async (requestId: string) => {
    try {
      await api.post(`/api/requests/${requestId}/match`, { volunteerId });
      alert('Task accepted! Thank you for your stewardship.');
      fetchData();
      setActiveTab('my-tasks');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to accept task.');
    }
  };

  const handleReport = async (requestId: string) => {
    if (!window.confirm('Is this request inappropriate or harmful? Reporting helps keep our Mandal safe.')) return;
    try {
      await api.post(`/api/requests/${requestId}/report`);
      alert('Thank you. Community safety is our priority. Our admins will review this.');
      fetchData();
    } catch (error) {
      alert('Failed to report request.');
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await api.post(`/api/requests/${requestId}/complete`);
      alert('Great job, neighbor! Task marked as completed.');
      fetchData();
    } catch (error) {
      alert('Failed to complete task.');
    }
  };

  const getMapsLink = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const getCalendarLink = (request: any) => {
    const start = new Date(request.dateTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(request.dateTime).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(`Mandal Task: ${request.category}\nRequester: ${request.requester.name}\nNotes: ${request.notes || ''}`);
    const location = encodeURIComponent(request.location);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Mandal Help: ' + request.category)}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Syncing Mandal Feed...</p>
    </div>
  );

  if (isPending) return (
    <div className="w-full max-w-xl mx-auto py-20 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-12 text-center space-y-8">
        <div className="inline-flex bg-amber-50 p-6 rounded-full text-amber-500 animate-pulse">
          <ShieldAlert size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Application Under Review</h2>
          <p className="text-slate-500 leading-relaxed max-w-sm mx-auto font-medium text-lg">
            Welcome to the Walled Garden! The Mandal Admin is currently reviewing your profile to keep the community safe.
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl text-sm text-slate-400 font-medium italic border border-slate-100">
          "Patience is the foundation of a trusted neighborhood."
        </div>
        <p className="text-xs text-slate-300 uppercase tracking-widest font-bold">Check back soon for access</p>
      </div>
    </div>
  );

  const displayList = activeTab === 'available' ? requests : myTasks;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif italic">Coordination Hub</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage local service requests and communal events.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Available ({requests.length})
          </button>
          <button 
            onClick={() => setActiveTab('my-tasks')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            My Tasks ({myTasks.length})
          </button>
        </div>
      </div>

      {displayList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="inline-flex bg-slate-50 p-4 rounded-full text-slate-400">
            {activeTab === 'available' ? <CheckCircle2 size={40} /> : <Inbox size={40} />}
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {activeTab === 'available' ? 'All Quiet in the Mandal' : 'No Active Tasks'}
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto font-medium">
            {activeTab === 'available' 
              ? "Every request has been matched. Great job, neighbor!" 
              : "You haven't claimed any tasks yet. Browse the available requests to help out."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayList.map((request) => (
            <div 
              key={request.id} 
              className={`bg-white rounded-3xl shadow-xl shadow-slate-200/50 border overflow-hidden transition-all group ${activeTab === 'my-tasks' ? 'border-indigo-100 ring-1 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
            >
              {request.event && (
                <div className="bg-indigo-900 px-6 py-2 text-white text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                  <Award size={12} className="text-indigo-400" />
                  <span>Communal Event: {request.event.title}</span>
                </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {request.category.replace('_', ' ')}
                    </span>
                    {request.maxVolunteers > 1 && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-1">
                        <Users size={10} />
                        <span>{request._count?.assignments || 0} / {request.maxVolunteers} Joined</span>
                      </span>
                    )}
                    <span className="flex items-center text-xs text-slate-400 font-medium">
                      <Clock size={14} className="mr-1" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>

                    {activeTab === 'available' && (
                      <button 
                        onClick={() => handleReport(request.id)}
                        className="p-1.5 text-slate-300 hover:text-red-400 transition-colors ml-auto"
                        title="Report Request"
                      >
                        <Flag size={14} />
                      </button>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 flex items-center group-hover:text-indigo-600 transition-colors">
                    <User size={18} className="mr-2 text-slate-400" />
                    {request.requester.name} needs help
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-start space-x-2">
                      <Calendar size={16} className="text-indigo-500 mt-0.5" />
                      <span className="font-medium">{new Date(request.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin size={16} className="text-indigo-500 mt-0.5" />
                      <span className="truncate font-medium">{request.location}</span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-500 border border-slate-100 italic font-medium">
                      "{request.notes}"
                    </div>
                  )}

                  {activeTab === 'my-tasks' && (
                    <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Requester Contact</p>
                        <p className="text-sm font-semibold text-slate-700">{request.requester.phone}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href={getMapsLink(request.location)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
                        >
                          <MapPin size={14} className="text-red-500" />
                          <span>Get Directions</span>
                        </a>
                        <a 
                          href={getCalendarLink(request)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
                        >
                          <Calendar size={14} className="text-blue-500" />
                          <span>Add to Calendar</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:border-l sm:border-slate-100 sm:pl-8 flex flex-col justify-center">
                  {activeTab === 'available' ? (
                    <button 
                      onClick={() => handleAccept(request.id)}
                      className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform active:scale-[0.95] flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      <span>{request.maxVolunteers > 1 ? 'Join Team' : 'Accept Task'}</span>
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all text-sm">
                        Contact Member
                      </button>
                      <button 
                        onClick={() => handleComplete(request.id)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-100"
                      >
                        Mark Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerFeed;
