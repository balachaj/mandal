import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck } from 'lucide-react';
import PhoneInput from './PhoneInput';

const Login = ({ onLogin }: { onLogin: (userData: any) => void }) => {
  const navigate = useNavigate();
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullPhone = `${phonePrefix}${phone}`;
      const response = await api.post('/api/auth/login', {
        phone: fullPhone,
        mandalId: 'demo-id', // Default to demo if logging in generically
        name: name || 'Anonymous Member'
      });
      onLogin(response.data);
      navigate('/feed');
    } catch (error) {
      alert('Login failed. Is the server running?');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-8 sm:p-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to Mandal</h1>
          <p className="text-slate-500 leading-relaxed">Sign in to join your community or find open tasks.</p>
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
          <span className="text-xs font-medium uppercase tracking-wider">Secure Trust Network</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
