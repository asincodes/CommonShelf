'use client';
import React, { useState, useEffect } from 'react';

export default function DashboardModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('borrowing');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch both requests AND live tools simultaneously
        const [reqRes, toolsRes] = await Promise.all([
          fetch('/api/requests'),
          fetch('/api/tools'),
        ]);

        const reqData = await reqRes.json();
        const toolsData = await toolsRes.json();

        if (reqData.success && Array.isArray(reqData.data)) {
          // Create a Set of all existing Tool IDs
          const liveToolIds = new Set(
            (toolsData.data || []).map((t) => String(t._id || t.id))
          );

          // 2. Filter requests to keep ONLY those where the tool still exists
          const validRequests = reqData.data.filter((req) =>
            liveToolIds.has(String(req.toolId))
          );

          setRequests(validRequests);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter requests based on tab selection
  const displayedRequests = Array.isArray(requests)
    ? requests.filter((req) => {
        if (activeTab === 'borrowing') {
          return true;
        } else {
          return req.status?.toLowerCase() === 'pending';
        }
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Activity Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your borrowed tools and incoming lending requests
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('borrowing')}
            className={`pb-3 px-4 font-semibold text-sm transition relative ${
              activeTab === 'borrowing'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Borrowing Activity ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lending')}
            className={`pb-3 px-4 font-semibold text-sm transition relative ${
              activeTab === 'lending'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lending Requests ({requests.filter((r) => r.status?.toLowerCase() === 'pending').length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Fetching request activity from MongoDB...
            </div>
          ) : displayedRequests.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <p className="text-slate-600 font-medium text-sm">
                No {activeTab === 'borrowing' ? 'borrowing' : 'pending lending'} requests found.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'borrowing'
                  ? 'Request a tool from the home feed to see it here!'
                  : 'Incoming requests from neighbors will appear here!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedRequests.map((req) => (
                <div
                  key={req._id || req.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {req.toolTitle || 'Tool Request'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ● {req.status || 'Pending'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                      <span>
                        Borrower: <strong className="text-slate-700">{req.borrowerName || 'Guest User'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Dates: <strong className="text-slate-700">{req.startDate || 'N/A'} - {req.endDate || 'N/A'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Deposit</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{req.deposit || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}