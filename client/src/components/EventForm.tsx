import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, Plus, Trash2, Save, Send } from 'lucide-react';

const EventForm = ({ mandalId, requesterId }: { mandalId: string; requesterId: string }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState([{ dateTime: '', location: '', notes: '', maxVolunteers: 1 }]);
  const [submitted, setSubmitted] = useState(false);

  const addSlot = () => {
    setSlots([...slots, { dateTime: '', location: '', notes: '', maxVolunteers: 1 }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: any) => {
    const newSlots = [...slots];
    (newSlots[index] as any)[field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/events', {
        title,
        description,
        mandalId,
        requesterId,
        slots
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to create event');
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden text-center p-12 space-y-8">
          <div className="inline-flex bg-green-100 text-green-600 p-4 rounded-full">
            <Save size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Event Created!</h2>
            <p className="text-slate-500 italic">Your communal event and volunteer slots are now live in the Mandal.</p>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all"
          >
            Create Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 overflow-hidden text-left">
        <div className="bg-indigo-600 px-8 py-10 text-white">
          <h2 className="text-3xl font-bold italic font-serif">Communal Stewardship</h2>
          <p className="text-indigo-100 mt-2">Organize a large event with multiple volunteer slots.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
          {/* Header Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
              <input 
                type="text" 
                placeholder="e.g. Annual Temple Festival"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                placeholder="What is this event about?"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Slots Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Volunteer Slots</h3>
              <button 
                type="button"
                onClick={addSlot}
                className="flex items-center space-x-1 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-8">
              {slots.map((slot, index) => (
                <div key={index} className="bg-slate-50 rounded-3xl p-6 relative border border-slate-100">
                  {slots.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 p-1.5 rounded-full border border-slate-100 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="datetime-local"
                          step="900"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={slot.dateTime}
                          onChange={(e) => updateSlot(index, 'dateTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Volunteers Needed</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="number"
                          min="1"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={slot.maxVolunteers}
                          onChange={(e) => updateSlot(index, 'maxVolunteers', parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="text"
                          placeholder="Shift Location"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={slot.location}
                          onChange={(e) => updateSlot(index, 'location', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specific Task/Notes</label>
                      <input 
                        type="text"
                        placeholder="e.g. Setup or Kitchen Help"
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={slot.notes}
                        onChange={(e) => updateSlot(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transform transition-all active:scale-[0.98] shadow-xl flex items-center justify-center space-x-2"
          >
            <Send size={20} />
            <span>Broadcast Event to Mandal</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
