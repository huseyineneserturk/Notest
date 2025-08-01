// Note model for Supabase
// Note: Supabase doesn't use schemas like Mongoose, so we define the structure here for reference
const NoteModel = {
  // Table structure (defined in migrations)
  // id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  // title: VARCHAR(255) NOT NULL
  // content: TEXT NOT NULL
  // notebook_id: UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE
  // user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  // tags: TEXT[] DEFAULT '{}'
  // is_archived: BOOLEAN DEFAULT FALSE
  // word_count: INTEGER DEFAULT 0
  // reading_time: INTEGER DEFAULT 0
  // version: INTEGER DEFAULT 1
  // created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

  // Validation helpers
  validateTitle(title) {
    return title && title.trim().length > 0 && title.length <= 200;
  },

  validateContent(content) {
    return content && content.trim().length > 0;
  },

  // Helper to calculate word count
  calculateWordCount(content) {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Helper to calculate reading time (average 200 words per minute)
  calculateReadingTime(wordCount) {
    return Math.ceil(wordCount / 200);
  },

  // Helper to format tags array
  formatTags(tags) {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.filter(tag => tag && tag.trim().length > 0).map(tag => tag.trim());
  },

  // Helper to update note with new content
  updateNoteWithContent(note, newContent) {
    const wordCount = this.calculateWordCount(newContent);
    const readingTime = this.calculateReadingTime(wordCount);
    
    return {
      ...note,
      content: newContent,
      word_count: wordCount,
      reading_time: readingTime,
      version: (note.version || 0) + 1
    };
  },

  // Sanitize note data for response
  sanitizeNote(note) {
    if (!note) return null;
    return note;
  }
};

module.exports = NoteModel; 