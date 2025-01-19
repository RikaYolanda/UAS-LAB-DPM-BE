import express, { Request, Response } from 'express';
import { Tugas } from '../models/Tugas';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const tugas = await Tugas.find({ userId });
    res.json(tugas);
  } catch (err) {
    console.error('Error fetching tugas:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { mataKuliah, tugasKe, tenggatKumpul } = req.body;
  const userId = req.userId;

  if (!mataKuliah || !tugasKe || !tenggatKumpul) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const newTugas = new Tugas({ mataKuliah, tugasKe, tenggatKumpul, userId });
    await newTugas.save();
    res.status(201).json(newTugas);
  } catch (err) {
    console.error('Error saving tugas:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { mataKuliah, tugasKe, tenggatKumpul } = req.body;
  const userId = req.userId;

  if (!mataKuliah || !tugasKe || !tenggatKumpul) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const updatedTugas = await Tugas.findOneAndUpdate(
      { _id: id, userId },
      { mataKuliah, tugasKe, tenggatKumpul },
      { new: true }
    );

    if (!updatedTugas) {
      res.status(404).json({ error: 'Tugas not found or unauthorized' });
      return;
    }

    res.json(updatedTugas);
  } catch (err) {
    console.error('Error updating tugas:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const tugas = await Tugas.findOneAndDelete({ _id: id, userId });
    if (!tugas) {
      res.status(404).json({ error: 'Tugas not found or unauthorized' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting tugas:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
