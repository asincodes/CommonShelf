'use client';
import React, { useState } from 'react';

export default function AddToolModal({ onClose, onAddTool }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Power Tools',
    description: '',
    deposit: '',
    imageUrl: '',
    status: 'Available',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deposit) {
      alert('Please fill in title and deposit fields!');
      return;
    }

    // Default image fallback if user leaves URL completely blank
    const finalImageUrl =
      formData.imageUrl.trim() ||
      'https://images.unsplash.com/photo-1581141849291-312271b6e671?q=80&w=600';

    onAddTool({
      ...formData,
      deposit: Number(formData.deposit),
      imageUrl: finalImageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">+ List a New Tool</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tool Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Bosch Cordless Drill"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Power Tools">Power Tools</option>
                <option value="Gardening">Gardening</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Ladders">Ladders</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deposit Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="500"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              placeholder="Paste photo link (https://images.unsplash.com/...)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Live Preview */}
            {formData.imageUrl && (
              <div className="mt-3 flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold block text-emerald-600">
                    ✓ Image Link Attached
                  </span>
                  <p className="text-[11px] text-slate-500 truncate">
                    {formData.imageUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Provide pickup details or condition notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition"
            >
              List Item
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}