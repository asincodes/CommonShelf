'use client';
import React, { useState } from 'react';
import { Tag, MapPin, Edit, Trash2, RotateCcw } from 'lucide-react';

export default function ToolCard({ tool, onSelect, onEdit, onDelete, onReturn }) {
  const fallbackImg =
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600';
  const [imgSrc, setImgSrc] = useState(tool?.imageUrl || fallbackImg);

  const isAvailable = tool?.status === 'Available' || !tool?.status;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative h-48 w-full bg-slate-100">
          <img
            src={imgSrc}
            alt={tool.title}
            onError={() => setImgSrc(fallbackImg)}
            className="w-full h-full object-cover"
          />
          {/* Status Badge */}
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              isAvailable
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium mb-1">
            <Tag size={12} />
            <span>{tool.category || 'General'}</span>
          </div>

          <h3 className="font-semibold text-slate-900 text-lg line-clamp-1">
            {tool.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-3">
            <MapPin size={12} />
            <span>0.8 km away</span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {tool.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-600 pt-3">
          <span>Security Deposit:</span>
          <span className="font-bold text-slate-900">₹{tool.deposit || 0}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(tool)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition"
            title="Edit Listing"
          >
            <Edit size={16} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(tool._id || tool.id)}
            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100/60 rounded-lg transition"
            title="Delete Listing"
          >
            <Trash2 size={16} />
          </button>

          {/* Action Button: Request or Return */}
          {isAvailable ? (
            <button
              onClick={() => onSelect(tool)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
            >
              Request to Borrow
            </button>
          ) : (
            <button
              onClick={() => onReturn(tool._id || tool.id)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition flex items-center justify-center gap-1.5"
              title="Reset status back to Available"
            >
              <RotateCcw size={14} />
              <span>Mark as Returned</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}