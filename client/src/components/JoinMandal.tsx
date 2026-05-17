import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, ShieldCheck } from 'lucide-react';
import PhoneInput from './PhoneInput';

const JoinMandal = ({ onLogin }: { onLogin: (userData: any) => void }) => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [mandal, setMandal] = useState<any>(null);
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchMandal = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/join/${inviteCode}`);
        setMandal(response.data);
      } catch (error) {
        console.error('Mandal not found', error);
      }
    };
    if (inviteCode !== 'demo') {
      fetchMandal();
    } else {
        setMandal({
            id: 'demo-id',
            name: 'Gilbert Neighbors',
            sponsor: {
              name: 'Gilbert Town Council',
              logoUrl: 'https://via.placeholder.com/120x40?text=GILBERT+LOGO',
              link: 'https://gilbert.gov'
            }
          });
    }
  }, [inviteCode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullPhone = `${phonePrefix}${phone}`;
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        phone: fullPhone,
        mandalId: mandal.id,
        name: name || 'Anonymous Member'
      });
      onLogin(response.data);
      navigate('/feed');
    } catch (error) {
      alert('Login failed. Is the server running?');
    }
  };

  if (!mandal) return (
    <div className="flex items-center justify-center space-x-2 text-indigo-600 py-20">
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Sponsor Banner */}
        {mandal.sponsor && (
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex flex-col items-center justify-center space-y-2">
            <img src={mandal.sponsor.logoUrl} alt="Sponsor" className="h-10 opacity-80 mix-blend-multiply" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Community Partner: <a href={mandal.sponsor.link} className="text-indigo-500 hover:text-indigo-600">{mandal.sponsor.name}</a>
            </p>
          </div>
        )}

        <div className="p-8 sm:p-12 text-center space-y-8">
          <div className="inline-flex bg-indigo-50 p-4 rounded-full text-indigo-600">
            <UserPlus size={40} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join {mandal.name}</h1>
            <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
              A trusted, "Walled Garden" network for local mutual aid. Connect with your neighbors and share the load.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3 text-left">
              <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Your Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <PhoneInput 
              prefix={phonePrefix} 
              onPrefixChange={setPhonePrefix} 
              value={phone} 
              onChange={setPhone} 
            />

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg transition-all"
            >
              Enter Mandal
            </button>
          </form>

          <div className="pt-4 flex items-center justify-center space-x-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">End-to-End Trust Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMandal;
