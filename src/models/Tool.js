import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  deposit: { type: Number, required: true },
  distance: { type: String, default: '0.5 km away' },
  status: { type: String, enum: ['Available', 'Booked'], default: 'Available' },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tool || mongoose.model('Tool', ToolSchema);