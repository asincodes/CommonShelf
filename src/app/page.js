'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/layout/Navbar';
import CategoryBar from '../components/layout/CategoryBar';
import ToolCard from '../components/tools/ToolCard';
import BookingModal from '../components/tools/BookingModal';
import AddToolModal from '../components/tools/AddToolModal';
import EditToolModal from '../components/tools/EditToolModal';
import DashboardModal from '../components/dashboard/DashboardModal';

// Dynamically import MapView to prevent SSR window/document issues
const MapView = dynamic(() => import('../components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-100 flex items-center justify-center text-slate-400">
      Loading Leaflet Map...
    </div>
  ),
});

export default function Home() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Fetch tools from MongoDB API (or fallback store)
  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tools');
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setTools(data.data || []);
      } else {
        console.error('Error fetching tools:', data?.error || res.statusText);
      }
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Handle Add Tool
  const handleAddTool = async (newToolData) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newToolData),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'The server could not save this listing.');
      }

      // Show the new listing right away, even if a follow-up refresh is slow.
      setTools((currentTools) => [data.data, ...currentTools]);
      setIsAddModalOpen(false);
      void fetchTools();
    } catch (err) {
      console.error('Error adding tool:', err);
      alert(`Failed to add tool: ${err.message || 'Please try again.'}`);
    }
  };

  // Handle Edit Tool
  const handleUpdateTool = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.success) {
        setEditingTool(null);
        fetchTools();
      } else {
        alert('Failed to update tool: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating tool:', err);
    }
  };

  // Handle Delete Tool & Cleanup Associated Requests
  const handleDeleteTool = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this tool listing?'
    );
    if (!confirmDelete) return;

    try {
      // 1. Delete tool listing from /api/tools/[id]
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        // 2. Fetch requests and remove any matching request for this tool ID
        const requestsRes = await fetch('/api/requests');
        const requestsData = await requestsRes.json();

        if (requestsData.success && Array.isArray(requestsData.data)) {
          const matchingRequests = requestsData.data.filter(
            (req) => String(req.toolId) === String(id)
          );

          // Delete matched requests from MongoDB
          for (const req of matchingRequests) {
            if (req._id) {
              await fetch(`/api/requests/${req._id}`, {
                method: 'DELETE',
              });
            }
          }
        }

        // Refresh feed tools on screen
        fetchTools();
      } else {
        alert('Failed to delete listing: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting tool:', err);
    }
  };

  // Handle Return Tool (Toggle Booked -> Available & Sync Request)
  const handleReturnTool = async (id) => {
    if (!id) return;
    try {
      // 1. Reset Tool status to Available in MongoDB
      const res = await fetch(`/api/tools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Available' }),
      });
      const data = await res.json();

      if (data.success) {
        // 2. Sync Request status in MongoDB (/api/requests)
        const requestsRes = await fetch('/api/requests');
        const requestsData = await requestsRes.json();

        if (requestsData.success && Array.isArray(requestsData.data)) {
          // Find active request associated with this tool
          const activeRequest = requestsData.data.find(
            (req) => String(req.toolId) === String(id) && req.status !== 'Returned'
          );

          if (activeRequest?._id) {
            // Update request status to Returned
            await fetch(`/api/requests/${activeRequest._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Returned' }),
            }).catch((err) => console.log('Optional request status sync:', err));
          }
        }

        // Refresh feed tools
        fetchTools();
      } else {
        alert('Failed to update tool status: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error resetting tool status:', err);
    }
  };

  // Handle Booking Confirmation
  const handleConfirmBooking = async (bookingDetails) => {
    try {
      const payload = {
        toolId: bookingDetails.toolId || bookingDetails._id,
        toolTitle: bookingDetails.toolTitle || bookingDetails.title || 'Tool Listing',
        borrowerName: bookingDetails.borrowerName || 'Guest User',
        startDate: String(bookingDetails.startDate || ''),
        endDate: String(bookingDetails.endDate || ''),
        deposit: Number(bookingDetails.deposit || 0),
        status: 'Pending',
      };

      // 1. Submit Request
      const reqRes = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const reqData = await reqRes.json().catch(() => null);

      if (!reqRes.ok || !reqData?.success) {
        throw new Error(reqData?.error || 'Booking request failed');
      }

      // 2. Update Tool Status to Booked
      if (payload.toolId) {
        await fetch(`/api/tools/${payload.toolId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Booked' }),
        });
      }

      setSelectedTool(null);
      fetchTools();
    } catch (err) {
      console.error('Booking sync failed:', err);
      alert('Error creating booking request. Check console for details.');
    }
  };

  // Filter Logic
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.title
      ? tool.title.toLowerCase().includes(searchQuery.toLowerCase())
      : false;

    const categoryNorm = (selectedCategory || '').trim().toLowerCase();
    const toolCatNorm = (tool.category || '').trim().toLowerCase();

    const matchesCategory =
      categoryNorm === 'all' ||
      categoryNorm === 'all tools' ||
      categoryNorm === '' ||
      toolCatNorm === categoryNorm;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Category Pills */}
      <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content (Split View) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Leaflet Map */}
        <section className="lg:col-span-5 h-[400px] lg:h-[calc(100vh-180px)] sticky top-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <MapView
            tools={filteredTools}
            onSelectTool={(tool) => setSelectedTool(tool)}
          />
        </section>

        {/* Right Side: Tool Feed */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Tools' : selectedCategory}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
              {filteredTools.length} {filteredTools.length === 1 ? 'item' : 'items'} available
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12 text-slate-400">
              Connecting to MongoDB & fetching tools...
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-200 text-center p-6">
              <p className="text-slate-600 font-medium">No tools found matching your criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting search filters or list a new tool!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool._id || tool.id}
                  tool={tool}
                  onSelect={(t) => setSelectedTool(t)}
                  onEdit={(t) => setEditingTool(t)}
                  onDelete={handleDeleteTool}
                  onReturn={handleReturnTool}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {selectedTool && (
        <BookingModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {isAddModalOpen && (
        <AddToolModal
          onClose={() => setIsAddModalOpen(false)}
          onAddTool={handleAddTool}
        />
      )}

      {editingTool && (
        <EditToolModal
          tool={editingTool}
          onClose={() => setEditingTool(null)}
          onUpdateTool={handleUpdateTool}
        />
      )}

      {isDashboardOpen && (
        <DashboardModal onClose={() => setIsDashboardOpen(false)} />
      )}
    </div>
  );
}
