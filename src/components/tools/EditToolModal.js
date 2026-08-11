'use client';
import React, { useState } from 'react';

export default function EditToolModal({ tool, onClose, onUpdateTool }) {
  const fallbackImg = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600';
  const [formData, setFormData] = useState({
    title: tool?.title || '',
    category: tool?.category || 'Power Tools',
    deposit: tool?.deposit || '',
    distance: tool?.distance || '0.5 km away',
    imageUrl: tool?.imageUrl || fallbackImg,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deposit) return;

    const targetId = tool._id || tool.id;

    if (!targetId) {
      alert('Error: Tool ID is missing.');
      return;
    }

    onUpdateTool(targetId, {
      ...formData,
      deposit: Number(formData.deposit),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Edit Tool Listing</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tool Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              >
                <option value="Power Tools">Power Tools</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Gardening">Gardening</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Ladders">Ladders</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Security Deposit (₹ INR)</label>
              <input 
                type="number" 
                required
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
            <input 
              type="url" 
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {formData.imageUrl && (
            <div className="mt-2">
              <span className="block text-xs font-semibold text-slate-500 mb-1">Image Preview:</span>
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                onError={(e) => { e.target.src = fallbackImg; }}
                className="w-full h-32 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm cursor-pointer text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}