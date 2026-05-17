import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const countryCodes = [
  { code: '+1', name: 'US/CA' },
  { code: '+91', name: 'IN' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'AU' },
  { code: '+49', name: 'DE' },
  { code: '+33', name: 'FR' },
  { code: '+971', name: 'UAE' },
];

const PhoneInput = ({ value, onChange, prefix, onPrefixChange }: any) => {
  return (
    <div className="space-y-3 text-left">
      <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
      <div className="flex space-x-2">
        <div className="relative">
          <select 
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className="h-full pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-slate-700 text-sm"
          >
            {countryCodes.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>
        <div className="relative flex-grow">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="tel" 
            placeholder="555 000-0000" 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
