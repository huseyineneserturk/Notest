// Notebook model for Supabase
// Note: Supabase doesn't use schemas like Mongoose, so we define the structure here for reference
const NotebookModel = {
  // Table structure (defined in migrations)
  // id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  // title: VARCHAR(255) NOT NULL
  // description: TEXT
  // user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  // category: VARCHAR(100) DEFAULT 'General'
  // color: VARCHAR(7) DEFAULT '#4A5568'
  // is_public: BOOLEAN DEFAULT FALSE
  // tags: TEXT[] DEFAULT '{}'
  // stats: JSONB DEFAULT '{"noteCount": 0, "quizCount": 0, "lastQuizScore": 0, "progress": 0}'
  // created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

  // Validation helpers
  validateTitle(title) {
    return title && title.trim().length > 0 && title.length <= 100;
  },

  validateDescription(description) {
    return !description || description.length <= 500;
  },

  validateCategory(category) {
    return !category || category.trim().length <= 100;
  },

  validateColor(color) {
    const colorRegex = /^#[0-9A-F]{6}$/i;
    return !color || colorRegex.test(color);
  },

  // Helper to format tags array
  formatTags(tags) {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.filter(tag => tag && tag.trim().length > 0).map(tag => tag.trim());
  },

  // Helper to create default stats
  createDefaultStats() {
    return {
      noteCount: 0,
      quizCount: 0,
      lastQuizScore: 0,
      progress: 0
    };
  },

  // Helper to update stats
  updateStats(currentStats, updates) {
    return {
      ...currentStats,
      ...updates
    };
  },

  // Sanitize notebook data for response
  sanitizeNotebook(notebook) {
    if (!notebook) return null;
    return notebook;
  }
};

module.exports = NotebookModel; 