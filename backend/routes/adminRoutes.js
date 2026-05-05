import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

router.use(protect, admin);

router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.role) query.role = req.query.role;

    const users = await User.find(query).select('-password').skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.query ? {
      name: { $regex: req.query.query, $options: 'i' }
    } : {};

    let users = await User.find({ ...keyword }).select('-password');
    
    // Also search by studentId in StudentProfile
    if (req.query.query) {
      const studentProfiles = await StudentProfile.find({
        studentId: { $regex: req.query.query, $options: 'i' }
      });
      const studentUserIds = studentProfiles.map(p => p.userId);
      const studentUsers = await User.find({ _id: { $in: studentUserIds } }).select('-password');
      
      const mergedUsers = [...users, ...studentUsers].reduce((acc, current) => {
        const x = acc.find(item => item._id.toString() === current._id.toString());
        if (!x) return acc.concat([current]);
        return acc;
      }, []);
      users = mergedUsers;
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.route('/users/:id')
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (user) res.json(user);
      else res.status(404).json({ message: 'User not found' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        if (user.role === 'admin') {
          return res.status(400).json({ message: 'Cannot delete admin user' });
        }
        await User.deleteOne({ _id: user._id });
        if (user.role === 'student') {
          await StudentProfile.deleteOne({ userId: user._id });
        }
        res.json({ message: 'User removed' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
