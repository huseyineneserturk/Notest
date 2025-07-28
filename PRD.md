# Notest - Gemini Not ve Quiz Asistanı
## Ürün Gereksinimleri Dokümanı (PRD)

**Versiyon:** 1.0  
**Tarih:** 20.07.2025  
**Proje:** yztAI138 - AI Takım 138

---

## 1. Giriş ve Amaç

Notest, kullanıcıların dijital ortamda tuttukları ders notlarını Google Gemini yapay zeka modelini kullanarak interaktif bir öğrenme aracına dönüştüren web tabanlı bir uygulamadır. Temel amacı, pasif bilgi depolamayı aktif ve sorgulanabilir bir öğrenme deneyimine çevirmektir.

### 1.1 Proje Durumu
- **Mevcut Teknolojiler:** React.js, TypeScript, Chakra UI, Vite
- **Geliştirme Aşaması:** MVP Geliştirme Fazı
- **Hedef:** Gemini API entegrasyonu ile akıllı quiz ve öğrenme asistanı

### 1.2 Temel Değer Önerisi
- Kişiselleştirilmiş öğrenme deneyimi
- Notlardan otomatik quiz üretimi
- Yapay zeka destekli öğrenme asistanı
- Performans takibi ve analizi

---

## 2. Ürün Vizyonu

Öğrenme sürecini kişiselleştirerek, her kullanıcıya kendi notları üzerinden interaktif bir çalışma ve değerlendirme ortamı sunan akıllı bir eğitim asistanı oluşturmak. Bilgiyi pasif bir şekilde depolamak yerine, onu aktif ve sorgulanabilir bir kaynağa dönüştürmek.

---

## 3. Hedef Kitle

### 3.1 Birincil Kullanıcılar
- **Lise ve Üniversite Öğrencileri:** Sınavlara hazırlanan, ders tekrarları yapan öğrenciler
- **Yaşam Boyu Öğrenenler:** Yeni beceriler öğrenen profesyoneller
- **Eğitmenler:** Hızlı quiz oluşturmak isteyen öğretmenler

### 3.2 Kullanıcı Personası
- **Ahmet (20, Üniversite Öğrencisi):** Matematik derslerinde not alıyor, sınavlara hazırlanıyor
- **Ayşe (28, Yazılım Geliştirici):** Yeni teknolojiler öğreniyor, notlarını test etmek istiyor
- **Mehmet (35, Öğretmen):** Öğrencileri için hızlı alıştırma testleri oluşturmak istiyor

---

## 4. Temel Özellikler

### 4.1 Not Yönetim Sistemi ✅ (Kısmen Tamamlandı)

#### 4.1.1 Kullanıcı Hesabı ve Kimlik Doğrulama
- [x] E-posta ve şifre ile kayıt/giriş
- [ ] Google OAuth 2.0 entegrasyonu
- [ ] Şifre sıfırlama
- [ ] Profil yönetimi

#### 4.1.2 Not Defteri/Ders Oluşturma
- [x] Not defteri oluşturma (Dashboard'da mevcut)
- [x] Not defteri listeleme
- [ ] Not defteri kategorilendirme
- [ ] Not defteri paylaşımı

#### 4.1.3 Zengin Metin Editörü
- [ ] Not alma arayüzü
- [ ] Metin biçimlendirme (kalın, italik, listeler)
- [ ] Başlık seviyeleri (H1, H2, H3)
- [ ] Otomatik kaydetme

#### 4.1.4 Veri Yönetimi
- [ ] Firebase Firestore entegrasyonu
- [ ] Gerçek zamanlı senkronizasyon
- [ ] Veri yedekleme

### 4.2 Gemini Quiz Modülü �� (Geliştirme Aşamasında)

#### 4.2.1 Quiz Oluşturma Arayüzü
- [ ] "Quiz Oluştur" butonu (NotebookView sayfasında)
- [ ] Soru sayısı seçimi
- [ ] Quiz türü seçimi (çoktan seçmeli, doğru/yanlış)

#### 4.2.2 Yapay Zeka Destekli Soru Üretimi
- [ ] Gemini API entegrasyonu
- [ ] Not içeriğinden soru üretimi
- [ ] JSON formatında yapılandırılmış yanıtlar
- [ ] Soru kalitesi kontrolü

#### 4.2.3 Quiz Çözme Arayüzü
- [ ] QuizModal bileşeni (mevcut)
- [ ] Soru navigasyonu
- [ ] Cevap seçimi
- [ ] İlerleme göstergesi

### 4.3 Performans ve Geri Bildirim 📊

#### 4.3.1 Quiz Sonuç Ekranı
- [ ] Doğru/yanlış istatistikleri
- [ ] Başarı yüzdesi
- [ ] Soru detayları
- [ ] Performans analizi

#### 4.3.2 Yanlış Sorular için AI Desteği
- [ ] "Neden Yanlış?" açıklaması
- [ ] Gemini API ile detaylı açıklama
- [ ] Not içeriğinden referanslar

#### 4.3.3 Performans Geçmişi
- [x] PerformanceHistory sayfası (mevcut)
- [ ] Grafiksel performans gösterimi
- [ ] Zaman bazlı analiz
- [ ] Ders bazlı performans

### 4.4 Akıllı Asistan 🤖

#### 4.4.1 AI Destekli Özetleme
- [ ] "Notu Özetle" butonu
- [ ] Anahtar kavramlar çıkarma
- [ ] Madde işaretli özetler
- [ ] Özet paylaşımı

#### 4.4.2 Notlar Üzerinden AI ile Sohbet
- [ ] ChatDrawer bileşeni (mevcut)
- [ ] Not içeriği ile sınırlı sohbet
- [ ] Soru-cevap sistemi
- [ ] Bağlam koruması

---

## 5. Teknik Mimari

### 5.1 Frontend Teknolojileri
- **Framework:** React.js 18.3.1
- **Dil:** TypeScript 5.5.4
- **UI Kütüphanesi:** Chakra UI 2.8.2
- **Routing:** React Router DOM 6.26.2
- **Build Tool:** Vite 5.2.0
- **Grafikler:** Recharts 2.12.7
- **İkonlar:** Lucide React 0.441.0

### 5.2 Backend ve Veritabanı
- **Platform:** Firebase
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Functions:** Cloud Functions for Firebase
- **Storage:** Firebase Storage (gelecek)

### 5.3 Yapay Zeka Entegrasyonu
- **API:** Google AI Gemini API
- **Kullanım Alanları:**
  - Quiz soru üretimi
  - Yanlış cevap açıklamaları
  - Not özetleme
  - Sohbet asistanı

### 5.4 Mevcut Bileşen Yapısı
```
src/
├── components/
│   ├── ChatDrawer.tsx ✅
│   ├── Footer.tsx ✅
│   ├── Header.tsx ✅
│   ├── NotebookCard.tsx ✅
│   ├── NoteEditor.tsx 🚧
│   ├── NotesList.tsx 🚧
│   ├── QuizModal.tsx ✅
│   ├── SummaryDrawer.tsx 
│   └── UserNav.tsx ✅
├── pages/
│   ├── AuthPage.tsx ✅
│   ├── Dashboard.tsx ✅
│   ├── LandingPage.tsx ✅
│   ├── NotebookView.tsx 🚧
│   └── PerformanceHistory.tsx ✅
```

Bu PRD dosyası, Notest uygulamanızın mevcut durumunu analiz ederek, adım adım geliştirme planını içermektedir. Dosya şu özellikleri içerir:

1. **Mevcut Durum Analizi:** Projenizin şu anki durumunu ve tamamlanan bileşenleri gösterir
2. **Detaylı Özellik Listesi:** Her özelliğin durumunu (✅ tamamlandı,  geliştiriliyor, 📋 planlandı) belirtir
3. **Teknik Mimari:** Kullanılan teknolojiler ve planlanan entegrasyonlar
4. **Geliştirme Fazları:** 4 aşamalı roadmap
5. **API Entegrasyonları:** Gemini API ve Firebase için örnekler
6. **Başarı Metrikleri:** Ölçülebilir hedefler

Bu PRD'yi takip ederek projenizi sistematik bir şekilde geliştirebilir ve her aşamada başarı kriterlerini kontrol edebilirsiniz.

---

## 6. Geliştirme Fazları (Roadmap)

### Faz 1: MVP (Minimum Uygulanabilir Ürün) - Şu Anki Durum
**Hedef:** Temel not yönetimi ve quiz oluşturma

#### Tamamlanan Özellikler ✅
- [x] Proje yapısı ve routing
- [x] Landing page
- [x] Kimlik doğrulama sayfaları
- [x] Dashboard (not defteri listesi)
- [x] Temel bileşenler (Header, Footer, UserNav)
- [x] QuizModal bileşeni
- [x] PerformanceHistory sayfası

#### Devam Eden Geliştirmeler 
- [ ] Firebase entegrasyonu
- [ ] Not defteri oluşturma/düzenleme
- [ ] Not alma arayüzü
- [ ] Gemini API entegrasyonu
- [ ] Quiz oluşturma mantığı

#### Sonraki Adımlar 
1. Firebase projesi kurulumu
2. Authentication sistemi
3. Firestore veritabanı yapısı
4. Gemini API anahtarı ve entegrasyonu
5. Not alma editörü geliştirme

### Faz 2: Gelişmiş Özellikler (2-3 Hafta)
**Hedef:** Tam işlevsel quiz sistemi ve performans takibi

#### Planlanan Özellikler
- [ ] Yanlış sorular için AI açıklamaları
- [ ] Quiz sonuçlarının kaydedilmesi
- [ ] Performans grafikleri
- [ ] Not defteri kategorilendirme
- [ ] Arama ve filtreleme

### Faz 3: Akıllı Asistan Entegrasyonu (3-4 Hafta)
**Hedef:** AI destekli öğrenme asistanı

#### Planlanan Özellikler
- [ ] Not özetleme özelliği
- [ ] AI sohbet asistanı
- [ ] Gelişmiş UI/UX iyileştirmeleri
- [ ] Kullanıcı geri bildirimleri

### Faz 4: Optimizasyon ve Ölçeklendirme (4-5 Hafta)
**Hedef:** Performans ve kullanıcı deneyimi iyileştirmeleri

#### Planlanan Özellikler
- [ ] Mobil uyumluluk
- [ ] Offline çalışma
- [ ] Push bildirimleri
- [ ] Sosyal özellikler

---

## 7. API Entegrasyonları

### 7.1 Google Gemini API
```typescript
// Quiz oluşturma için örnek prompt
const quizPrompt = `
Bu metinden ${questionCount} adet çoktan seçmeli soru oluştur. 
Her sorunun 4 şıkkı olsun ve doğru cevabı açıkça belirt. 
Sorular metnin farklı kısımlarından ve anahtar bilgilerden türetilsin.

Metin: ${noteContent}

JSON formatında yanıtla:
{
  "questions": [
    {
      "question": "Soru metni",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Açıklama"
    }
  ]
}
`;
```

### 7.2 Firebase Firestore Yapısı
```typescript
// Veritabanı koleksiyonları
interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

interface Notebook {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Quiz {
  id: string;
  noteId: string;
  questions: Question[];
  createdAt: Timestamp;
}

interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  completedAt: Timestamp;
}
```

---

## 8. Kullanıcı Arayüzü Tasarımı

### 8.1 Tasarım Prensipleri
- **Minimalist:** Dikkat dağıtmayan, odaklanmaya yardımcı
- **Responsive:** Tüm cihazlarda optimal deneyim
- **Erişilebilir:** WCAG standartlarına uygun
- **Hızlı:** Performans odaklı tasarım

### 8.2 Renk Paleti
- **Ana Renk:** Gri tonları (mevcut Chakra UI teması)
- **Vurgu Renkleri:** Mavi, yeşil (başarı), kırmızı (hata)
- **Arka Plan:** Açık gri (#F7FAFC)

### 8.3 Bileşen Tasarımları
- **NotebookCard:** Hover efektleri, gölgeler
- **QuizModal:** Adım adım navigasyon
- **ChatDrawer:** Sohbet arayüzü
- **PerformanceHistory:** Grafik ve istatistikler

---

## 9. Test Stratejisi

### 9.1 Birim Testleri
- [ ] Bileşen testleri (React Testing Library)
- [ ] API entegrasyon testleri
- [ ] Utility fonksiyon testleri

### 9.2 Entegrasyon Testleri
- [ ] Kullanıcı akış testleri
- [ ] Firebase entegrasyon testleri
- [ ] Gemini API testleri

### 9.3 Kullanıcı Testleri
- [ ] A/B testleri
- [ ] Kullanıcı geri bildirimleri
- [ ] Performans testleri

---

## 10. Güvenlik ve Gizlilik

### 10.1 Veri Güvenliği
- [ ] Firebase güvenlik kuralları
- [ ] API anahtarı koruması
- [ ] Kullanıcı verisi şifreleme

### 10.2 Gizlilik
- [ ] GDPR uyumluluğu
- [ ] Veri toplama politikası
- [ ] Kullanıcı onayları

---

## 11. Performans Hedefleri

### 11.1 Sayfa Yükleme Süreleri
- **Dashboard:** < 2 saniye
- **Notebook Açma:** < 1 saniye
- **Quiz Oluşturma:** < 5 saniye
- **AI Yanıtları:** < 3 saniye

### 11.2 Ölçeklenebilirlik
- **Eşzamanlı Kullanıcı:** 1000+
- **Veri Depolama:** 1GB/kullanıcı
- **API Çağrıları:** 1000/gün

---

## 12. Başarı Metrikleri

### 12.1 Kullanıcı Metrikleri
- **Kayıt Olma Oranı:** %15
- **Günlük Aktif Kullanıcı:** %40
- **Quiz Tamamlama Oranı:** %70
- **Kullanıcı Memnuniyeti:** 4.5/5

### 12.2 Teknik Metrikler
- **Sayfa Yükleme Hızı:** < 2s
- **API Yanıt Süresi:** < 3s
- **Hata Oranı:** < %1
- **Uptime:** %99.9

---

## 13. Risk Analizi

### 13.1 Teknik Riskler
- **Gemini API Limitleri:** Rate limiting ve maliyet kontrolü
- **Firebase Maliyeti:** Kullanım artışı ile maliyet yönetimi
- **Performans Sorunları:** Büyük not dosyaları

### 13.2 Çözüm Stratejileri
- API çağrılarını optimize etme
- Veri önbellekleme
- Maliyet izleme ve uyarılar

---

## 14. Gelecek Geliştirmeler (V2.0)

### 14.1 Özellik Geliştirmeleri
- [ ] Not paylaşımı ve ortak çalışma
- [ ] Farklı soru tipleri (boşluk doldurma, eşleştirme)
- [ ] Sesli not alma
- [ ] Resim ve dosya ekleme

### 14.2 Platform Genişletme
- [ ] Mobil uygulama (React Native)
- [ ] Desktop uygulaması (Electron)
- [ ] Browser extension

### 14.3 AI Geliştirmeleri
- [ ] Kişiselleştirilmiş öğrenme yolları
- [ ] Otomatik not kategorilendirme
- [ ] Gelişmiş analitik ve öneriler

---

## 15. Sonuç

Notest projesi, modern web teknolojileri ve yapay zeka entegrasyonu ile öğrenme deneyimini dönüştürmeyi hedeflemektedir. Mevcut MVP aşamasından başlayarak, adım adım geliştirilecek özelliklerle kullanıcıların notlarını interaktif öğrenme araçlarına dönüştürmeleri sağlanacaktır.

### 15.1 Öncelikli Aksiyonlar
1. Firebase projesi kurulumu ve konfigürasyonu
2. Gemini API entegrasyonu
3. Not alma editörü geliştirme
4. Quiz oluşturma mantığının tamamlanması
5. Kullanıcı testleri ve geri bildirim toplama

### 15.2 Başarı Kriterleri
- MVP'nin 2 hafta içinde tamamlanması
- İlk 100 kullanıcıya ulaşma
- Kullanıcı memnuniyet oranının %80'in üzerinde olması
- Quiz oluşturma süresinin 5 saniyenin altında olması

---

**Doküman Versiyonu:** 1.0  
**Son Güncelleme:** 20.07.2025  
**Hazırlayan:** AI Takım 138  
**Onaylayan:** Proje Yöneticisi
