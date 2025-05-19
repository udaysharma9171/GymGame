import bcrypt from 'bcrypt';
import { readData, writeData } from '../utils/storage.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { email, passwordHash, height: null, weight: null, goal: null, xp: 0, level: 1, streakCount: 0, lastWorkoutDate: null, badges: [] };
  users.push(newUser);
  writeData('users.json', users);
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  const { passwordHash: _, ...userData } = newUser;
  res.status(201).json({ token, user: userData });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  const { passwordHash, ...userData } = user;
  res.json({ token, user: userData });
};
