const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseClient');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, status')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'User account is inactive.' });
    }

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ success: false, error: 'Invalid token.' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden. You do not have access to this resource.' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
