import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema(
  {
    toolId: {
      type: String,
      required: true,
    },
    toolTitle: {
      type: String,
      default: 'Tool Listing',
    },
    borrowerName: {
      type: String,
      default: 'Guest User',
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    deposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Prevent re-compilation error in Next.js hot-reloading
export default mongoose.models.Request || mongoose.model('Request', RequestSchema);