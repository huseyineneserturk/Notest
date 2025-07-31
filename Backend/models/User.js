const bcrypt = require('bcryptjs');

const UserModel = {
  // Table structure (defined in migrations)
  // id: UUID PRIMARY KEY
  // email: VARCHAR(255) UNIQUE NOT NULL
  // password_hash: VARCHAR(255) NOT NULL
  // display_name: VARCHAR(255) NOT NULL
  // avatar_url: TEXT
  // preferences: JSONB DEFAULT '{"theme": "light", "notifications": true}'
  // created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

  // Helper functions for password operations
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  },

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Validation helpers
  validateEmail(email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  },

  validatePassword(password) {
    return password && password.length >= 6;
  },

  validateDisplayName(displayName) {
    return displayName && displayName.trim().length > 0 && displayName.length <= 50;
  },

  // Sanitize user data for response (remove sensitive info)
  sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
};

module.exports = UserModel; 