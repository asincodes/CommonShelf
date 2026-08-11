'use client';
import React from 'react';
import Link from 'next/link';
import { Search, PlusCircle, LayoutDashboard } from 'lucide-react';
import { Show, UserButton } from '@clerk/nextjs';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenDashboard,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            CS
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-lg leading-tight tracking-tight">
              Common<span className="text-emerald-600">Shelf</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 -mt-0.5">
              Neighborhood Tool Sharing
            </p>
          </div>
        </div>

        {/* Search Field */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search tools (e.g., Drill, Ladder, Lawn Mower)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* User Navigation Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
          >
            <LayoutDashboard size={15} className="text-slate-500" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          {/* Visible ONLY when signed in */}
          <Show when="signed-in">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
            >
              <PlusCircle size={15} />
              <span>+ List Tool</span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </Show>

          {/* Visible ONLY when signed out */}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
            >
              Sign In / Sign Up
            </Link>
          </Show>
        </div>

      </div>
    </header>
  );
}
