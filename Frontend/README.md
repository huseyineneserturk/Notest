# Notest Frontend

Bu, Notest uygulamasının React tabanlı frontend'idir.

## 🚀 Özellikler

- **Modern UI/UX**: Chakra UI ile tasarlanmış responsive arayüz
- **Authentication**: Kullanıcı giriş/kayıt sistemi
- **Notebook Management**: Not defteri oluşturma ve yönetimi
- **Note Taking**: Rich text editor ile not alma
- **AI Integration**: Quiz oluşturma, özetleme ve sohbet
- **Performance Tracking**: Quiz sonuçları ve istatistikler

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Backend API çalışır durumda olmalı

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
   REACT_APP_API_URL=http://localhost:5001/api
   ```

4. **Backend'i başlatın** (ayrı terminalde):
   ```bash
   cd ../Backend
   npm run dev
   ```

5. **Frontend'i başlatın:**
   ```bash
   npm start
   ```

## 🏗️ Mimari

### Teknolojiler
- **React 18** - UI kütüphanesi
- **TypeScript** - Type safety
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **Context API** - State management

### Klasör Yapısı
```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx
│   ├── NotebookCard.tsx
│   ├── NoteEditor.tsx
│   └── ...
├── contexts/           # React Context'leri
│   └── AuthContext.tsx
├── pages/              # Sayfa bileşenleri
│   ├── Dashboard.tsx
│   ├── NotebookView.tsx
│   ├── AuthPage.tsx
│   └── ...
├── utils/              # Utility fonksiyonları
│   └── api.ts          # API çağrıları
└── App.tsx             # Ana uygulama bileşeni
```

## 🔐 Authentication

- JWT tabanlı kimlik doğrulama
- Protected routes ile sayfa koruması
- Otomatik token yenileme
- Kullanıcı durumu yönetimi

## 📡 API Entegrasyonu

### Endpoint'ler
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Kullanıcı kaydı
- `GET /notebooks` - Not defterlerini listele
- `POST /notebooks` - Yeni not defteri oluştur
- `GET /notes/notebook/:id` - Not defterindeki notları getir
- `POST /notes` - Yeni not oluştur
- `PUT /notes/:id` - Not güncelle
- `POST /quizzes/generate` - AI ile quiz oluştur
- `POST /ai/summary` - Not özetleme
- `POST /ai/chat` - AI sohbet

### Error Handling
- Global error handling
- Toast notifications
- API error types

## 🎨 UI Bileşenleri

### Ana Bileşenler
- **Dashboard**: Not defteri listesi ve istatistikler
- **NotebookView**: Not alma ve düzenleme
- **AuthPage**: Giriş/kayıt formu
- **NotebookCard**: Not defteri kartı
- **NoteEditor**: Rich text editor
- **Header**: Navigation ve kullanıcı menüsü

### Responsive Design
- Mobile-first approach
- Tablet ve desktop uyumlu
- Dark mode desteği

## 🚀 Build ve Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Test
```bash
npm test
```

## 🔧 Konfigürasyon

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### API Configuration
API base URL ve request/response handling `src/utils/api.ts` dosyasında yapılandırılır.

### Theme Configuration
Chakra UI tema ayarları `src/theme/` klasöründe özelleştirilebilir.

## 📊 State Management

### Auth Context
- Kullanıcı bilgileri
- Authentication durumu
- Login/logout fonksiyonları

### Local State
- Component state'leri
- Form data
- Loading states

## 🎯 Gelecek Geliştirmeler

- [ ] Real-time collaboration
- [ ] File upload
- [ ] Advanced search
- [ ] Offline support
- [ ] PWA features

## 📞 Destek

Herhangi bir sorun yaşarsanız, lütfen issue açın veya backend'in çalışır durumda olduğundan emin olun.
