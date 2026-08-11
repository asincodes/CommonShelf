export const INITIAL_TOOLS = [
  {
    _id: 'tool-1',
    title: 'DeWalt Cordless Drill 20V',
    category: 'Power Tools',
    deposit: 1500,
    distance: '0.4 km away',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    lat: 12.9716,
    lng: 77.5946,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'tool-2',
    title: 'Bosch High Pressure Washer',
    category: 'Gardening & Outdoor',
    deposit: 2500,
    distance: '0.8 km away',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    lat: 12.9750,
    lng: 77.5990,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'tool-3',
    title: 'Stanley 150-Piece Mechanics Tool Set',
    category: 'Hand Tools',
    deposit: 1000,
    distance: '1.2 km away',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600',
    lat: 12.9680,
    lng: 77.5910,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'tool-4',
    title: 'Aluminum Telescopic Ladder 12.5ft',
    category: 'Ladders & Stepladders',
    deposit: 2000,
    distance: '1.5 km away',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1513467535987-fd81bc2062f8?auto=format&fit=crop&q=80&w=600',
    lat: 12.9730,
    lng: 77.6020,
    createdAt: new Date().toISOString(),
  },
];

if (!global.__inMemoryTools) {
  global.__inMemoryTools = [...INITIAL_TOOLS];
}

if (!global.__inMemoryRequests) {
  global.__inMemoryRequests = [];
}

export function getMemoryTools() {
  return global.__inMemoryTools;
}

export function addMemoryTool(data) {
  const newTool = {
    _id: 'tool-' + Date.now(),
    title: String(data.title || 'Untitled Tool'),
    category: String(data.category || 'Other'),
    deposit: Number(data.deposit || 0),
    distance: String(data.distance || '0.5 km away'),
    status: data.status || 'Available',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    lat: Number.isFinite(Number(data.lat)) ? Number(data.lat) : 12.9716,
    lng: Number.isFinite(Number(data.lng)) ? Number(data.lng) : 77.5946,
    createdAt: new Date().toISOString(),
  };
  global.__inMemoryTools = [newTool, ...global.__inMemoryTools];
  return newTool;
}

export function updateMemoryTool(id, fields) {
  const index = global.__inMemoryTools.findIndex((t) => String(t._id || t.id) === String(id));
  if (index !== -1) {
    global.__inMemoryTools[index] = {
      ...global.__inMemoryTools[index],
      ...fields,
    };
    return global.__inMemoryTools[index];
  }
  return null;
}

export function deleteMemoryTool(id) {
  const tool = global.__inMemoryTools.find((t) => String(t._id || t.id) === String(id));
  global.__inMemoryTools = global.__inMemoryTools.filter((t) => String(t._id || t.id) !== String(id));
  return tool;
}

export function getMemoryRequests() {
  return global.__inMemoryRequests;
}

export function addMemoryRequest(data) {
  const newReq = {
    _id: 'req-' + Date.now(),
    toolId: String(data.toolId),
    toolTitle: String(data.toolTitle || 'Tool Listing'),
    borrowerName: String(data.borrowerName || 'Guest User'),
    startDate: String(data.startDate || ''),
    endDate: String(data.endDate || ''),
    deposit: Number(data.deposit || 0),
    status: data.status || 'Pending',
    createdAt: new Date().toISOString(),
  };
  global.__inMemoryRequests = [newReq, ...global.__inMemoryRequests];
  return newReq;
}

export function updateMemoryRequest(id, fields) {
  const index = global.__inMemoryRequests.findIndex((r) => String(r._id || r.id) === String(id));
  if (index !== -1) {
    global.__inMemoryRequests[index] = {
      ...global.__inMemoryRequests[index],
      ...fields,
    };
    return global.__inMemoryRequests[index];
  }
  return null;
}

export function deleteMemoryRequest(id) {
  const req = global.__inMemoryRequests.find((r) => String(r._id || r.id) === String(id));
  global.__inMemoryRequests = global.__inMemoryRequests.filter((r) => String(r._id || r.id) !== String(id));
  return req;
}
