import { readData } from './storage.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const email = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')[0];
  const user = readData('users.json').find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};
