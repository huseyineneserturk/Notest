// QuizResult model for Supabase
// Note: Supabase doesn't use schemas like Mongoose, so we define the structure here for reference
const QuizResultModel = {
  // Table structure (defined in migrations)
  // id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  // quiz_id: UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE
  // user_id: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  // notebook_id: UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE
  // answers: JSONB NOT NULL
  // score: INTEGER NOT NULL CHECK (score >= 0 AND score <= 100)
  // total_questions: INTEGER NOT NULL
  // correct_answers: INTEGER NOT NULL
  // total_time: INTEGER DEFAULT 0
  // completed_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // passed: BOOLEAN NOT NULL
  // feedback: TEXT
  // created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

  // Answer structure (stored in JSONB)
  // {
  //   questionIndex: number,
  //   userAnswer: string,
  //   correctAnswer: string,
  //   isCorrect: boolean,
  //   timeSpent: number
  // }

  // Validation helpers
  validateScore(score) {
    return score >= 0 && score <= 100;
  },

  validateAnswers(answers) {
    if (!Array.isArray(answers)) return false;
    
    return answers.every(answer => 
      typeof answer.questionIndex === 'number' &&
      answer.userAnswer &&
      answer.correctAnswer &&
      typeof answer.isCorrect === 'boolean'
    );
  },

  // Helper to calculate score from answers
  calculateScore(answers) {
    if (!Array.isArray(answers) || answers.length === 0) return 0;
    
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / answers.length) * 100);
  },

  // Helper to calculate total time
  calculateTotalTime(answers) {
    if (!Array.isArray(answers)) return 0;
    
    return answers.reduce((total, answer) => total + (answer.timeSpent || 0), 0);
  },

  // Helper to determine if passed
  determinePassed(score, passingScore = 70) {
    return score >= passingScore;
  },

  // Helper to generate feedback
  generateFeedback(score, totalQuestions, correctAnswers) {
    if (score >= 90) {
      return "Excellent! You have a great understanding of this material.";
    } else if (score >= 80) {
      return "Good job! You have a solid understanding of the content.";
    } else if (score >= 70) {
      return "Well done! You passed the quiz.";
    } else if (score >= 60) {
      return "You're close! Review the material and try again.";
    } else {
      return "Keep studying! Review the notes and try the quiz again.";
    }
  },

  // Helper to create result from answers
  createResult(quizId, userId, notebookId, answers, passingScore = 70) {
    const score = this.calculateScore(answers);
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const totalTime = this.calculateTotalTime(answers);
    const passed = this.determinePassed(score, passingScore);
    const feedback = this.generateFeedback(score, totalQuestions, correctAnswers);
    
    return {
      quiz_id: quizId,
      user_id: userId,
      notebook_id: notebookId,
      answers,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      total_time: totalTime,
      passed,
      feedback
    };
  },

  // Sanitize quiz result data for response
  sanitizeQuizResult(result) {
    if (!result) return null;
    return result;
  }
};

module.exports = QuizResultModel; 