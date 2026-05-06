import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.route('/me')
  .get(protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (user && user.role === 'student') {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Student profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === 'student') {
        user.course = req.body.course || user.course;
        user.branch = req.body.branch || user.branch;
        user.year = req.body.year || user.year;
        
        const updatedUser = await user.save();
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'Student profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
