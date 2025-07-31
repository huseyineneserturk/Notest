// Quiz model for Supabase
// Note: Supabase doesn't use schemas like Mongoose, so we define the structure here for reference
const QuizModel = {
  // Table structure (defined in migrations)
  // id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  // title: VARCHAR(255) NOT NULL
  // note_id: UUID REFERENCES notes(id) ON DELETE CASCADE
  // notebook_id: UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE
  // user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  // questions: JSONB NOT NULL
  // settings: JSONB DEFAULT '{"timeLimit": 0, "shuffleQuestions": true, "showExplanation": true, "passingScore": 70}'
  // stats: JSONB DEFAULT '{"totalAttempts": 0, "averageScore": 0, "bestScore": 0, "averageTime": 0}'
  // is_active: BOOLEAN DEFAULT TRUE
  // created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

  // Question structure (stored in JSONB)
  // {
  //   question: string,
  //   options: string[],
  //   correctAnswer: string,
  //   explanation: string,
  //   difficulty: 'easy' | 'medium' | 'hard',
  //   category: string
  // }

  // Validation helpers
  validateTitle(title) {
    return title && title.trim().length > 0 && title.length <= 100;
  },

  validateQuestions(questions) {
    if (!Array.isArray(questions) || questions.length === 0) {
      return false;
    }
    
    return questions.every(question => 
      question.question && 
      question.question.trim().length > 0 &&
      Array.isArray(question.options) && 
      question.options.length >= 2 &&
      question.correctAnswer &&
      question.options.includes(question.correctAnswer)
    );
  },

  validateSettings(settings) {
    const defaultSettings = {
      timeLimit: 0,
      shuffleQuestions: true,
      showExplanation: true,
      passingScore: 70
    };
    
    return {
      ...defaultSettings,
      ...settings,
      passingScore: Math.max(0, Math.min(100, settings.passingScore || 70))
    };
  },

  // Helper to create default stats
  createDefaultStats() {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      averageTime: 0
    };
  },

  // Helper to update stats
  updateStats(currentStats, newResult) {
    const { totalAttempts, averageScore, bestScore, averageTime } = currentStats;
    const newTotalAttempts = totalAttempts + 1;
    const newAverageScore = ((averageScore * totalAttempts) + newResult.score) / newTotalAttempts;
    const newBestScore = Math.max(bestScore, newResult.score);
    const newAverageTime = ((averageTime * totalAttempts) + (newResult.time || 0)) / newTotalAttempts;
    
    return {
      totalAttempts: newTotalAttempts,
      averageScore: Math.round(newAverageScore * 100) / 100,
      bestScore: newBestScore,
      averageTime: Math.round(newAverageTime * 100) / 100
    };
  },

  // Helper to shuffle questions
  shuffleQuestions(questions) {
    return [...questions].sort(() => Math.random() - 0.5);
  },

  // Helper to calculate score
  calculateScore(answers, questions) {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  },

  // Sanitize quiz data for response
  sanitizeQuiz(quiz) {
    if (!quiz) return null;
    return quiz;
  }
};

module.exports = QuizModel; 