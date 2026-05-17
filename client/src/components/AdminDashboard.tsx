import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  Users, Globe, ShieldAlert, Trash2, UserMinus, 
  ExternalLink, Calendar, Flag, CheckCircle, 
  Settings, Fuel, Save, RefreshCcw, ShieldCheck, XCircle
} from 'lucide-react';

const AdminDashboard = ({ currentMandalId }: { currentMandalId?: string }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'mandals' | 'flagged' | 'settings'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [mandals, setMandals] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<any[]>([]);
  const [mandalSettings, setMandalSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state for settings
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    sponsorName: '',
    sponsorLogo: '',
    sponsorLink: '',
    requireApproval: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users' && currentMandalId) {
        const res = await api.get(`/api/mandals/${currentMandalId}/users`);
        setUsers(res.data);
      } else if (activeTab === 'mandals') {
        const res = await api.get('/api/admin/mandals');
        setMandals(res.data);
      } else if (activeTab === 'flagged') {
        const res = await api.get('/api/admin/flagged');
        setFlagged(res.data);
      } else if (activeTab === 'settings' && currentMandalId) {
        const res = await api.get(`/api/mandals/${currentMandalId}/settings`);
        setMandalSettings(res.data);
        setSettingsForm({
          name: res.data.name,
          sponsorName: res.data.sponsor?.name || '',
          sponsorLogo: res.data.sponsor?.logoUrl || '',
          sponsorLink: res.data.sponsor?.link || '' ,
          requireApproval: res.data.requireApproval
        });
      }
    } catch (error: any) {
      console.error('Admin fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentMandalId]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/api/mandals/${currentMandalId}/settings`, settingsForm);
      alert('Settings updated successfully!');
      fetchData();
    } catch (error) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUserStatus = async (userId: string, status: string) => {
    try {
      await api.post(`/api/users/${userId}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update member status');
    }
  };

  const handleResetStats = async () => {
    if (!window.confirm('Reset message counter? This is usually done after a top-up.')) return;
    try {
      await api.post(`/api/mandals/${currentMandalId}/reset-stats`);
      fetchData();
    } catch (error) {
      alert('Reset failed');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this request?')) return;
    try {
      await api.delete(`/api/requests/${id}`);
      fetchData();
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h2>
          <p className="text-slate-500 mt-1">Oversee members, Mandals, and community safety.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit overflow-x-auto">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={16} />
            <span>Members</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'flagged' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Flag size={16} />
            <span>Flagged ({flagged.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('mandals')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'mandals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe size={16} />
            <span>Directory</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Loading secure data...</div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      user.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {user.status === 'PENDING' && (
                      <button 
                        onClick={() => handleUserStatus(user.id, 'APPROVED')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" 
                        title="Approve Member"
                      >
                        <ShieldCheck size={20} />
                      </button>
                    )}
                    {user.status !== 'BANNED' ? (
                      <button 
                        onClick={() => handleUserStatus(user.id, 'BANNED')}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-all" 
                        title="Ban Member"
                      >
                        <XCircle size={20} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUserStatus(user.id, 'APPROVED')}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all text-xs font-bold"
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'settings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fuel Tank / Stats Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
              <div className="flex items-center space-x-3 text-indigo-600">
                <Fuel size={24} />
                <h3 className="text-xl font-bold">Fuel Tank</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>Usage</span>
                  <span>{mandalSettings?.stats?.messagesSent || 0} / {mandalSettings?.stats?.threshold || 500}</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${((mandalSettings?.stats?.messagesSent || 0) / (mandalSettings?.stats?.threshold || 500)) > 0.8 ? 'bg-red-500' : 'bg-indigo-500'}`}
                    style={{ width: `${Math.min(100, ((mandalSettings?.stats?.messagesSent || 0) / (mandalSettings?.stats?.threshold || 500)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed italic font-medium">
                Credits are consumed when alerts are broadcasted via WhatsApp/SMS.
              </p>

              <button 
                onClick={handleResetStats}
                className="w-full flex items-center justify-center space-x-2 bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
              >
                <RefreshCcw size={16} />
                <span>Simulate Top-Up</span>
              </button>
            </div>

            <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl text-white space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <ShieldAlert size={20} className="text-indigo-400" />
                <span>Walled Garden Security</span>
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-200">Require Admin Approval</span>
                <button 
                  onClick={() => setSettingsForm({...settingsForm, requireApproval: !settingsForm.requireApproval})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settingsForm.requireApproval ? 'bg-green-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${settingsForm.requireApproval ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <p className="text-xs text-indigo-300 leading-relaxed">
                When enabled, new members cannot view or post requests until you approve them in the Members tab.
              </p>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleUpdateSettings} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mandal Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400"><span className="px-4 bg-white text-slate-400">Community Partner Branding</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sponsor Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={settingsForm.sponsorName}
                      onChange={(e) => setSettingsForm({...settingsForm, sponsorName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sponsor Link</label>
                    <input 
                      type="url" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={settingsForm.sponsorLink}
                      onChange={(e) => setSettingsForm({...settingsForm, sponsorLink: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Logo URL</label>
                  <input 
                    type="url" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={settingsForm.sponsorLogo}
                    onChange={(e) => setSettingsForm({...settingsForm, sponsorLogo: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                {saving ? <RefreshCcw className="animate-spin" /> : <Save size={20} />}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'mandals' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mandals.map(mandal => (
            <div key={mandal.id} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-4 hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <Globe size={24} />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{mandal.name}</h3>
                <p className="text-xs text-slate-400 font-medium flex items-center mt-1">
                  <Calendar size={12} className="mr-1" />
                  Created {new Date(mandal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{mandal._count.users}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{mandal._count.requests}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Needs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {flagged.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <CheckCircle size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium font-bold">No flagged items found. The community is healthy!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {flagged.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-lg border-l-4 border-red-500 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {item.reportCount} Reports
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{item.mandal.name}</span>
                    </div>
                    <h4 className="font-bold text-slate-900">{item.category} by {item.requester.name}</h4>
                    <p className="text-sm text-slate-500 italic">"{item.notes}"</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteRequest(item.id)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start space-x-4">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Trust & Safety Notice</h4>
          <p className="text-sm text-amber-700/80 leading-relaxed font-medium">
            As an administrator, you have visibility into community data. Use this power to maintain a safe, respectful "Walled Garden." If you suspect abuse, use the remove buttons to prune the Mandal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
