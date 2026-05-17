import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PlusCircle, Image, Users, Copy, Check } from 'lucide-react';

const CreateMandal = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sponsorName: '',
    sponsorLogo: '',
    sponsorLink: ''
  });
  const [createdLink, setCreatedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/mandals', {
        ...formData,
        creatorId: user?.id
      });
      const { mandal, inviteLink } = response.data;
      setCreatedLink(inviteLink);
    } catch (error) {
      console.error(error);
      alert('Failed to create Mandal. Is the server running?');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdLink) {
    return (
      <div className="w-full max-w-xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden text-center p-12 space-y-8">
          <div className="inline-flex bg-green-100 text-green-600 p-4 rounded-full">
            <Check size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Mandal Created!</h2>
            <p className="text-slate-500 italic">"Gilbert Neighbors" is ready for its members.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-left ml-2">Share this Magic Link</p>
            <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <input 
                readOnly 
                value={createdLink} 
                className="bg-transparent border-none outline-none text-indigo-600 font-mono text-sm flex-grow"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/join/${createdLink.split('/').pop()}`)}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all"
          >
            Go to Join Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-white text-center">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl mb-4">
            <PlusCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold">Start a New Mandal</h2>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">Build your walled garden</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2 ml-1">
              <Users size={18} className="text-indigo-500" />
              <span>Mandal Name</span>
            </label>
            <input 
              type="text"
              placeholder="e.g. Gilbert Neighbors"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400"><span className="px-4 bg-white">Sponsorship (Optional)</span></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sponsor Name</label>
              <input 
                type="text"
                placeholder="e.g. Town Council"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setFormData({...formData, sponsorName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sponsor Logo URL</label>
              <div className="relative">
                <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="url"
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setFormData({...formData, sponsorLogo: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transform transition-all active:scale-[0.98] shadow-xl"
          >
            Create Mandal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMandal;
