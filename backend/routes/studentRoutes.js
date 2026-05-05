import express from 'express';
import { protect } from '../middleware/auth.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

router.route('/me')
  .get(protect, async (req, res) => {
    try {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ message: 'Student profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile) {
        profile.course = req.body.course || profile.course;
        profile.branch = req.body.branch || profile.branch;
        profile.year = req.body.year || profile.year;
        
        const updatedProfile = await profile.save();
        res.json(updatedProfile);
      } else {
        res.status(404).json({ message: 'Student profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
