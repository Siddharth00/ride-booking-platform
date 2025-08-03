import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeaders = req.headers.authorization;
console.log('authHeaders', authHeaders)
  if(!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' })
  }

  const token = authHeaders.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: `Invalid token - ${err}` });
  }
}
