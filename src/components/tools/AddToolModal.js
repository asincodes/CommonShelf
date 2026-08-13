'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('../map/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
      Loading Location Map Picker...
    </div>
  ),
});

export default function AddToolModal({ onClose, onAddTool }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Power Tools',
    description: '',
    deposit: '',
    locationName: 'Koramangala, Bengaluru',
    imageUrl: '',
    status: 'Available',
    lat: 12.9716,
    lng: 77.5946,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deposit = Number(formData.deposit);

    if (!formData.title.trim() || formData.deposit === '' || !Number.isFinite(deposit) || deposit < 0) {
      alert('Please fill in title and deposit fields!');
      return;
    }

    const finalImageUrl =
      formData.imageUrl.trim() ||
      'https://images.unsplash.com/photo-1581141849291-312271b6e671?q=80&w=600';

    setIsSubmitting(true);
    try {
      await onAddTool({
        ...formData,
        title: formData.title.trim(),
        locationName: formData.locationName.trim() || 'Local Neighborhood',
        deposit,
        imageUrl: finalImageUrl,
        lat: Number(formData.lat) || 12.9716,
        lng: Number(formData.lng) || 77.5946,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-xl border border-slate-100 overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">+ List a New Tool</h2>
            <p className="text-xs text-slate-500">Set tool details & precise pickup location on the map</p>
          </div>
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

          {/* Location Details Header */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Location Name / Area *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Koramangala, Bengaluru or Sector 4, HSR Layout"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Interactive Map Picker */}
          <LocationPickerMap
            lat={formData.lat}
            lng={formData.lng}
            onChange={({ lat, lng }) => setFormData((prev) => ({ ...prev, lat, lng }))}
          />

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
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
            >
              {isSubmitting ? 'Listing…' : 'List Item'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
