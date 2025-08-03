const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
};

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; displayName: string }) => {
    const response = await makeRequest<{ user: any; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        display_name: data.displayName
      }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await makeRequest<{ user: any; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await makeRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async () => {
    return makeRequest<{ user: any }>('/auth/me');
  },

  updateProfile: async (data: { displayName?: string; preferences?: any }) => {
    return makeRequest<{ user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return makeRequest<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return makeRequest<{
      totalNotes: number;
      quizzesThisMonth: number;
      averageScore: number;
      studyStreak: number;
      trends: {
        notesGrowth: number;
        quizzesGrowth: number;
        scoreGrowth: number;
        streakGrowth: number;
      };
    }>('/auth/stats');
  },

  getPerformanceHistory: async () => {
    return makeRequest<{
      quizHistory: Array<{
        id: string;
        notebook: string;
        noteTitle: string;
        date: string;
        score: string;
        passed: boolean;
        totalQuestions: number;
      }>;
      performanceData: Array<{
        name: string;
        score: number;
      }>;
    }>('/auth/performance');
  },
};

// Notebooks API
export const notebooksApi = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    return makeRequest<{ notebooks: any[]; pagination: any }>(`/notebooks${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return makeRequest<{ notebook: any }>(`/notebooks/${id}`);
  },

  create: async (data: { title: string; description?: string; category?: string; color?: string; tags?: string[] }) => {
    return makeRequest<{ notebook: any; message: string }>('/notebooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { title?: string; description?: string; category?: string; color?: string; tags?: string[] }) => {
    return makeRequest<{ notebook: any; message: string }>(`/notebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return makeRequest<{ message: string }>(`/notebooks/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (id: string) => {
    return makeRequest<{ stats: any }>(`/notebooks/${id}/stats`);
  },
};

// Notes API
export const notesApi = {
  getByNotebook: async (notebookId: string, params?: { page?: number; limit?: number; search?: string; archived?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.archived !== undefined) searchParams.append('archived', params.archived.toString());
    
    const queryString = searchParams.toString();
    return makeRequest<{ notes: any[]; pagination: any }>(`/notes/notebook/${notebookId}${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return makeRequest<{ note: any }>(`/notes/${id}`);
  },

  create: async (data: { title: string; content: string; notebookId: string; tags?: string[] }) => {
    return makeRequest<{ note: any; message: string }>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { title?: string; content?: string; tags?: string[]; isArchived?: boolean }) => {
    return makeRequest<{ note: any; message: string }>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return makeRequest<{ message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  archive: async (id: string, isArchived: boolean) => {
    return makeRequest<{ note: any; message: string }>(`/notes/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ isArchived }),
    });
  },

  search: async (query: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams({ q: query });
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return makeRequest<{ notes: any[]; pagination: any }>(`/notes/search?${searchParams.toString()}`);
  },

  getVersions: async (id: string) => {
    return makeRequest<{ versions: any[] }>(`/notes/${id}/versions`);
  },
};

// Quizzes API
export const quizzesApi = {
  getByNote: async (noteId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return makeRequest<{ quizzes: any[]; pagination: any }>(`/quizzes/note/${noteId}${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return makeRequest<{ quiz: any }>(`/quizzes/${id}`);
  },

  generate: async (data: { noteId: string; questionCount?: number; difficulty?: string; title?: string }) => {
    return makeRequest<{ quiz: any; message: string }>('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submit: async (id: string, data: { answers: any[]; totalTime?: number }) => {
    return makeRequest<{ result: any; score: number; passed: boolean; message: string }>(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getResults: async (id: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return makeRequest<{ results: any[]; pagination: any }>(`/quizzes/${id}/results${queryString ? `?${queryString}` : ''}`);
  },

  getExplanation: async (id: string, data: { questionIndex: number; userAnswer: string }) => {
    return makeRequest<{ explanation: any }>(`/quizzes/${id}/explanation`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return makeRequest<{ message: string }>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },
};

// AI API
export const aiApi = {
  generateSummary: async (noteId: string) => {
    return makeRequest<{ summary: any }>('/ai/summary', {
      method: 'POST',
      body: JSON.stringify({ noteId }),
    });
  },

  chat: async (noteId: string, message: string) => {
    return makeRequest<{ response: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ noteId, message }),
    });
  },

  getSuggestions: async (noteId: string) => {
    return makeRequest<{ suggestions: any }>('/ai/suggestions', {
      method: 'POST',
      body: JSON.stringify({ noteId }),
    });
  },

  generateFlashcards: async (noteId: string, count?: number) => {
    return makeRequest<{ flashcards: any[] }>('/ai/flashcards', {
      method: 'POST',
      body: JSON.stringify({ noteId, count }),
    });
  },

  getReadability: async (noteId: string) => {
    return makeRequest<{ readability: any }>('/ai/readability', {
      method: 'POST',
      body: JSON.stringify({ noteId }),
    });
  },
};

export { getAuthToken, setAuthToken, removeAuthToken, ApiError }; 