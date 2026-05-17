import React, { useState } from 'react';
import api from '../api';
import { Calendar, MapPin, ClipboardList, Send, Info } from 'lucide-react';

const RequestForm = ({ mandalId, requesterId }: { mandalId: string; requesterId: string }) => {
  const [formData, setFormData] = useState({
    category: 'RIDE',
    customCategory: '',
    dateTime: '',
    location: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastRequest, setLastRequest] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = formData.category === 'OTHER' ? formData.customCategory : formData.category;
    
    try {
      const response = await api.post('/api/requests', {
        ...formData,
        category: finalCategory,
        mandalId,
        requesterId
      });
      setLastRequest(response.data);
      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to submit request.');
    }
  };

  if (submitted && lastRequest) {
    const shareText = encodeURIComponent(
      `🔔 *Mandal Alert* 🔔\n\n` +
      `*Need:* ${lastRequest.category.replace('_', ' ')}\n` +
      `*When:* ${new Date(lastRequest.dateTime).toLocaleString()}\n` +
      `*Where:* ${lastRequest.location}\n\n` +
      `Can you help? Click here to accept:\n` +
      `${window.location.origin}/feed`
    );

    return (
      <div className="w-full max-w-xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden text-center p-12 space-y-8">
          <div className="inline-flex bg-green-100 text-green-600 p-4 rounded-full">
            <Send size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Request Broadcasted!</h2>
            <p className="text-slate-500 italic">Your Mandal has been alerted in the app.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Boost Visibility</p>
            <a 
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#20bd5c] shadow-xl transition-all flex items-center justify-center space-x-3"
            >
              <span>Share to WhatsApp Group</span>
            </a>
          </div>

          <button 
            onClick={() => setSubmitted(false)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Create another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-indigo-600 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold font-serif italic">Request Assistance</h2>
          <p className="text-indigo-100 mt-1 font-medium text-sm tracking-wide">Submit a request and your local Mandal will be notified.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Category Section */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
              <ClipboardList size={18} className="text-indigo-500" />
              <span>Service Category</span>
            </label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="RIDE">🚗 Ride to Appointment</option>
              <option value="GROCERY_DELIVERY">🛒 Grocery Delivery</option>
              <option value="TECH_SUPPORT">💻 Tech Support</option>
              <option value="HEAVY_LIFTING">📦 Heavy Lifting</option>
              <option value="OTHER">🤝 Other Help...</option>
            </select>
          </div>

          {formData.category === 'OTHER' && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Specify Other Need</label>
              <input 
                type="text"
                placeholder="What do you need help with?"
                className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium"
                required
                onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date Section */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                <Calendar size={18} className="text-indigo-500" />
                <span>Preferred Date & Time</span>
              </label>
              <input 
                type="datetime-local"
                step="900" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                required
                onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
              />
            </div>

            {/* Location Section */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
                <MapPin size={18} className="text-indigo-500" />
                <span>Location</span>
              </label>
              <input 
                type="text"
                placeholder="e.g. 123 Maple St"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-sm"
                required
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 space-x-2">
              <Info size={18} className="text-indigo-500" />
              <span>Additional Details</span>
            </label>
            <textarea 
              placeholder="Provide any extra info to help neighbors..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px] font-medium text-sm"
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="group w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transform transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200"
          >
            <span>Broadcast Request</span>
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-gray-400 text-sm italic font-medium">
        "Trust is the bridge between community and resilience."
      </p>
    </div>
  );
};

export default RequestForm;
