import mongoose from 'mongoose';

const tugasSchema = new mongoose.Schema({
  mataKuliah: {
    type: String,
    required: true,
  },
  tugasKe: {
    type: Number,
    required: true,
  },
  tenggatKumpul: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Tugas = mongoose.model('Tugas', tugasSchema);
