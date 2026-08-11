'use client';
import React, { useState } from 'react';

export default function BookingModal({ tool, onClose, onConfirmBooking }) {
  const fallbackImg = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600';
  const [imgSrc, setImgSrc] = useState(tool?.imageUrl || fallbackImg);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!tool) return null;

  const isAvailable = tool.status ? tool.status === 'Available' : true;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    onConfirmBooking({
      toolId: tool._id || tool.id,
      toolTitle: tool.title,
      startDate,
      endDate,
      note,
      deposit: tool.deposit,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Borrow Request</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-xl font-bold text-slate-800">Request Sent!</h4>
            <p className="text-sm text-slate-600">
              Your request to borrow <strong>{tool.title}</strong> has been submitted. The item status is now marked as <strong>Booked</strong>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Tool Preview Header */}
            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 mb-6 items-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                <img 
                  src={imgSrc} 
                  alt={tool.title}
                  onError={() => setImgSrc(fallbackImg)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 text-base">{tool.title}</h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-800 text-white'
                  }`}>
                    {tool.status || 'Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tool.category}</p>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  Security Deposit: <span className="text-emerald-600 font-bold">₹{tool.deposit}</span>
                </p>
              </div>
            </div>

            {/* Booking Dates Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Message to Owner (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Hi! I need this tool for a weekend project..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isAvailable}
                  className={`px-5 py-2 text-white font-medium rounded-lg shadow-sm text-sm ${
                    isAvailable 
                      ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? 'Confirm Request' : 'Already Booked'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}