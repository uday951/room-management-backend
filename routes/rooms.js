const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create room
router.post('/create', auth, async (req, res) => {
  try {
    const { name, rentAmount, rentDueDate } = req.body;
    const code = generateRoomCode();

    const room = new Room({
      name,
      code,
      owner: req.userId,
      members: [{ user: req.userId }],
      rentAmount: rentAmount || 0,
      rentDueDate: rentDueDate || '1'
    });

    await room.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { rooms: room._id }
    });

    // Populate the room data before sending response
    const populatedRoom = await Room.findById(room._id)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    res.status(201).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join room
router.post('/join', auth, async (req, res) => {
  try {
    const { code } = req.body;

    const room = await Room.findOne({ code });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const isMember = room.members.some(member => 
      member.user.toString() === req.userId
    );
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    room.members.push({ user: req.userId });
    await room.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { rooms: room._id }
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user rooms
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'rooms',
      populate: {
        path: 'members.user owner',
        select: 'name email'
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rooms || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get room details
router.get('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;