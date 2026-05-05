import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.route('/me')
  .get(protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  })
  .put(protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

export default router;
