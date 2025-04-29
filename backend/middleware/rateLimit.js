// middleware/rateLimit.js
const rateLimit = (maxRequests, timeWindow) => {
    const requests = new Map();
    
    return (req, res, next) => {
      // Get IP address or user ID if authenticated
      const identifier = req.user ? req.user.id : req.ip;
      
      // Current time
      const now = Date.now();
      
      // Get user's requests
      const userRequests = requests.get(identifier) || [];
      
      // Filter out old requests
      const recentRequests = userRequests.filter(
        requestTime => requestTime > now - timeWindow
      );
      
      // Check if too many requests
      if (recentRequests.length >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }
      
      // Add current request timestamp
      recentRequests.push(now);
      
      // Update request map
      requests.set(identifier, recentRequests);
      
      next();
    };
  };
  
  module.exports = rateLimit;