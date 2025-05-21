import { readData } from './storage.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const [email] = Buffer.from(token, 'base64').toString().split(':');

  const users = readData('users.json');
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};

export default authenticate;
