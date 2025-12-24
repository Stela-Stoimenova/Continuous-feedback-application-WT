const jwt = require('jsonwebtoken'); //import JWT library for verifying tokens 
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';//set secret key for JWT verification

module.exports = (req, res, next) => {//incoming request, response, function to continue to next step 
  const authHeader = req.headers.authorization;//if this doesnt exist the user is not logged in
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Authorization token missing token' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//checks token signature and expiration
    req.user = decoded;//attaching the user to the request object for downstream use
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
