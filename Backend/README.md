# Notest Backend API

Bu, Notest uygulamasının backend API'sidir. Node.js, Express ve Supabase kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Authentication**: JWT tabanlı kimlik doğrulama
- **Notebook Management**: Not defteri oluşturma, düzenleme, silme
- **Note Management**: Not alma, düzenleme, arama
- **Quiz System**: AI destekli quiz oluşturma ve sonuç takibi
- **AI Integration**: Google Gemini API entegrasyonu
- **Performance Tracking**: Quiz sonuçları ve performans analizi

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- Supabase Projesi
- Google AI API Key

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment dosyasını oluşturun:**
   ```bash
   cp env.example .env
   ```

3. **Environment değişkenlerini düzenleyin:**
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_AI_API_KEY=your-google-ai-api-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Supabase projesini kurun:**
   ```bash
   # Supabase CLI kurulumu
   npm install -g @supabase/cli
   
   # Migration'ları çalıştırın
   supabase db push
   ```

5. **Uygulamayı başlatın:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri
- `PUT /api/auth/profile` - Profil güncelleme
- `PUT /api/auth/password` - Şifre değiştirme
- `POST /api/auth/logout` - Çıkış yapma

### Notebooks
- `GET /api/notebooks` - Tüm not defterlerini listele
- `GET /api/notebooks/:id` - Tek not defteri getir
- `POST /api/notebooks` - Not defteri oluştur
- `PUT /api/notebooks/:id` - Not defteri güncelle
- `DELETE /api/notebooks/:id` - Not defteri sil
- `GET /api/notebooks/:id/stats` - Not defteri istatistikleri

### Notes
- `GET /api/notes/notebook/:notebookId` - Not defterindeki notları listele
- `GET /api/notes/:id` - Tek not getir
- `POST /api/notes` - Not oluştur
- `PUT /api/notes/:id` - Not güncelle
- `DELETE /api/notes/:id` - Not sil
- `PATCH /api/notes/:id/archive` - Not arşivle/arşivden çıkar
- `GET /api/notes/search` - Notlarda arama yap
- `GET /api/notes/:id/versions` - Not versiyonlarını getir

### Quizzes
- `GET /api/quizzes/note/:noteId` - Not için quizleri listele
- `GET /api/quizzes/:id` - Tek quiz getir
- `POST /api/quizzes/generate` - AI ile quiz oluştur
- `POST /api/quizzes/:id/submit` - Quiz sonuçlarını gönder
- `GET /api/quizzes/:id/results` - Quiz sonuçlarını getir
- `POST /api/quizzes/:id/explanation` - Yanlış cevap açıklaması
- `DELETE /api/quizzes/:id` - Quiz sil

### AI Features
- `POST /api/ai/summary` - Not özeti oluştur
- `POST /api/ai/chat` - Not hakkında sohbet et
- `POST /api/ai/suggestions` - Not iyileştirme önerileri
- `POST /api/ai/flashcards` - Flashcard oluştur
- `POST /api/ai/readability` - Okunabilirlik analizi

## 🔧 Veritabanı Yapısı

### Tablolar
- `users`: Kullanıcı bilgileri
- `notebooks`: Not defterleri
- `notes`: Notlar
- `note_versions`: Not versiyonları
- `quizzes`: Quizler
- `quiz_results`: Quiz sonuçları

### Güvenlik
- Row Level Security (RLS) aktif
- Kullanıcılar sadece kendi verilerine erişebilir
- JWT tabanlı kimlik doğrulama

### Özellikler
- Otomatik kelime sayısı hesaplama
- Not versiyonlama
- Quiz istatistikleri
- Arama fonksiyonları

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- Input validation
- CORS koruması
- Helmet güvenlik başlıkları

## 🤖 AI Entegrasyonu

Google Gemini API kullanılarak:
- Quiz soruları oluşturma
- Not özetleme
- Sohbet asistanı
- Yanlış cevap açıklamaları

## 📊 Performans

- PostgreSQL indexing
- Row Level Security
- Async/await pattern
- Error handling
- Request validation
- Supabase real-time subscriptions

## 🧪 Test

```bash
npm test
```

## 📝 Environment Variables

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Server portu | 5000 |
| `NODE_ENV` | Environment | development |
| `SUPABASE_URL` | Supabase proje URL'i | - |
| `SUPABASE_ANON_KEY` | Supabase anonim anahtarı | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase servis rolü anahtarı | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT geçerlilik süresi | 7d |
| `GOOGLE_AI_API_KEY` | Google AI API anahtarı | - |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |

## 🚀 Deployment

1. **Environment değişkenlerini ayarlayın**
2. **Supabase projesini kurun ve migration'ları çalıştırın**
3. **Google AI API anahtarını alın**
4. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

## 📞 Destek

Herhangi bir sorun yaşarsanız, lütfen issue açın veya iletişime geçin. 