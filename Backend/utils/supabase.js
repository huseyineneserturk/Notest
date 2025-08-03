// Backend/utils/supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

console.log('🔍 Environment Debug:');
console.log('SUPABASE_URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided in .env file');
}

if (supabaseUrl.includes('your-supabase-project-url')) {
  throw new Error('Please update SUPABASE_URL in .env file with your real Supabase project URL');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Supabase client initialized with real credentials');

// Database helper functions
const db = {
  // User functions
  async createUser({ email, password_hash, display_name }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash, display_name }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Notebook functions
  async getNotebooks(userId) {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getNotebookById(id) {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createNotebook(notebook) {
    const { data, error } = await supabase
      .from('notebooks')
      .insert([notebook])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateNotebook(id, updates) {
    const { data, error } = await supabase
      .from('notebooks')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteNotebook(id) {
    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Note functions
  async getNotesByNotebook(notebookId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('notebook_id', notebookId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getNoteById(id) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getNotesByUser(userId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createNote(note) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateNote(id, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteNote(id) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getNoteVersions(noteId) {
    const { data, error } = await supabase
      .from('note_versions')
      .select('*')
      .eq('note_id', noteId)
      .order('version', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Quiz functions
  async getQuizzesByNote(noteId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getQuizById(id) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createQuiz(quiz) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quiz])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteQuiz(id) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async updateQuizStats(quizId, score) {
    // Get current quiz stats
    const quiz = await this.getQuizById(quizId);
    const currentStats = quiz.stats || { attempts: 0, averageScore: 0, bestScore: 0 };
    
    const newAttempts = currentStats.attempts + 1;
    const newAverageScore = Math.round(
      (currentStats.averageScore * (newAttempts - 1) + score) / newAttempts
    );
    const newBestScore = Math.max(currentStats.bestScore, score);
    
    const { error } = await supabase
      .from('quizzes')
      .update({
        stats: {
          attempts: newAttempts,
          averageScore: newAverageScore,
          bestScore: newBestScore
        }
      })
      .eq('id', quizId)
    
    if (error) throw error
  },

  async submitQuizResult(result) {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([result])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getQuizResults(quizId) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Statistics functions for user dashboard
  async getNoteCountByUser(userId) {
    const { count, error } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (error) throw error
    return count || 0
  },

  async getQuizCountByUserSince(userId, sinceDate) {
    const { count, error } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', sinceDate.toISOString())
    
    if (error) throw error
    return count || 0
  },

  async getQuizResultsByUserSince(userId, sinceDate) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('score, created_at')
      .eq('user_id', userId)
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getUserActivityByDate(userId, sinceDate) {
    // Get notes created, quizzes taken by date
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', sinceDate.toISOString())
    
    if (notesError) throw notesError

    const { data: quizzes, error: quizzesError } = await supabase
      .from('quiz_results')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', sinceDate.toISOString())
    
    if (quizzesError) throw quizzesError

    return { notes: notes || [], quizzes: quizzes || [] }
  },

  async getQuizHistoryByUser(userId) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        quiz:quizzes(
          title,
          note:notes(
            title,
            notebook:notebooks(title)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50) // Limit to last 50 quiz results
    
    if (error) throw error
    
    // Format the response to flatten the nested data
    return (data || []).map(result => ({
      id: result.id,
      score: result.score,
      passed: result.passed,
      total_questions: result.total_questions,
      created_at: result.created_at,
      quiz_title: result.quiz?.title || 'Unknown Quiz',
      note_title: result.quiz?.note?.title || 'Unknown Note',
      notebook_title: result.quiz?.note?.notebook?.title || 'Unknown Notebook'
    }))
  }
}

module.exports = { supabase, db };