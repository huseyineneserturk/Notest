const request = require('supertest');
const app = require('../server');

describe('Notest API Tests', () => {
  let authToken;
  let testUserId;
  let testNotebookId;
  let testNoteId;

  beforeAll(async () => {
    // Supabase bağlantısını test et
    console.log('Testing Supabase connection...');
  });

  afterAll(async () => {
    // Test tamamlandı
    console.log('Tests completed');
  });

  describe('Authentication', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      
      authToken = response.body.token;
      testUserId = response.body.user._id;
    });

    test('should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('should get current user', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Notebooks', () => {
    test('should create a notebook', async () => {
      const response = await request(app)
        .post('/api/notebooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Notebook',
          description: 'A test notebook',
          category: 'Test'
        });

      expect(response.status).toBe(201);
      expect(response.body.notebook).toHaveProperty('title', 'Test Notebook');
      
      testNotebookId = response.body.notebook._id;
    });

    test('should get all notebooks', async () => {
      const response = await request(app)
        .get('/api/notebooks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notebooks');
      expect(response.body.notebooks).toHaveLength(1);
    });

    test('should get single notebook', async () => {
      const response = await request(app)
        .get(`/api/notebooks/${testNotebookId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.notebook).toHaveProperty('_id', testNotebookId);
    });
  });

  describe('Notes', () => {
    test('should create a note', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content.',
          notebookId: testNotebookId
        });

      expect(response.status).toBe(201);
      expect(response.body.note).toHaveProperty('title', 'Test Note');
      
      testNoteId = response.body.note._id;
    });

    test('should get notes for notebook', async () => {
      const response = await request(app)
        .get(`/api/notes/notebook/${testNotebookId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notes');
      expect(response.body.notes).toHaveLength(1);
    });

    test('should get single note', async () => {
      const response = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.note).toHaveProperty('_id', testNoteId);
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });
}); 