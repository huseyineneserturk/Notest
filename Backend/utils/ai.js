const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const generateQuiz = async (noteContent, questionCount = 5, difficulty = 'medium') => {
  try {
    console.log('Generating quiz with:', { noteContent: noteContent.substring(0, 100), questionCount, difficulty });
    
    // Smart mock quiz based on note content
    const words = noteContent.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const hasProgramming = noteContent.toLowerCase().includes('programming') || noteContent.toLowerCase().includes('code');
    const hasTechnology = noteContent.toLowerCase().includes('technology') || noteContent.toLowerCase().includes('tech');
    const hasAI = noteContent.toLowerCase().includes('ai') || noteContent.toLowerCase().includes('artificial intelligence');
    const hasWeb = noteContent.toLowerCase().includes('web') || noteContent.toLowerCase().includes('website');
    const hasDatabase = noteContent.toLowerCase().includes('database') || noteContent.toLowerCase().includes('db');
    
    const mockQuiz = {
      questions: [
        {
          question: `Bu not içeriğinde kaç kelime var?`,
          options: [
            `${Math.max(1, Math.floor(wordCount * 0.8))}-${Math.floor(wordCount * 0.9)}`,
            `${Math.floor(wordCount * 0.9)}-${wordCount}`,
            `${wordCount}-${Math.ceil(wordCount * 1.1)}`,
            `${Math.ceil(wordCount * 1.1)}-${Math.ceil(wordCount * 1.2)}`
          ],
          correctAnswer: "B",
          explanation: `Not içeriğinde tam olarak ${wordCount} kelime var.`,
          difficulty: "easy",
          category: "analiz"
        },
        {
          question: "Bu not hangi konu hakkında?",
          options: [
            hasProgramming ? "Programlama" : "Genel Konular",
            hasTechnology ? "Teknoloji" : "Bilim",
            hasAI ? "Yapay Zeka" : "Sanat",
            hasWeb ? "Web Geliştirme" : "Eğitim"
          ],
          correctAnswer: hasProgramming ? "A" : hasTechnology ? "B" : hasAI ? "C" : "D",
          explanation: hasProgramming ? "Not içeriğinde programlama ile ilgili terimler geçiyor." : 
                      hasTechnology ? "Not içeriğinde teknoloji ile ilgili terimler geçiyor." :
                      hasAI ? "Not içeriğinde yapay zeka ile ilgili terimler geçiyor." :
                      "Not içeriğinde genel konular ele alınıyor.",
          difficulty: "easy",
          category: "konu"
        },
        {
          question: "Not içeriğinde hangi teknoloji alanından bahsediliyor?",
          options: [
            hasAI ? "Yapay Zeka" : "Genel Teknoloji",
            hasWeb ? "Web Geliştirme" : "Mobil Uygulama",
            hasDatabase ? "Veritabanı" : "Sistem Yönetimi",
            hasProgramming ? "Programlama" : "Ağ Teknolojileri"
          ],
          correctAnswer: hasAI ? "A" : hasWeb ? "B" : hasDatabase ? "C" : "D",
          explanation: hasAI ? "Not içeriğinde AI/artificial intelligence terimleri geçiyor." :
                      hasWeb ? "Not içeriğinde web geliştirme ile ilgili terimler geçiyor." :
                      hasDatabase ? "Not içeriğinde veritabanı ile ilgili terimler geçiyor." :
                      "Not içeriğinde programlama ile ilgili terimler geçiyor.",
          difficulty: "medium",
          category: "teknoloji"
        },
        {
          question: "Bu notun okuma süresi yaklaşık kaç dakika?",
          options: [
            "1 dakika",
            "2-3 dakika", 
            "4-5 dakika",
            "5+ dakika"
          ],
          correctAnswer: wordCount < 100 ? "A" : wordCount < 200 ? "B" : wordCount < 300 ? "C" : "D",
          explanation: `Not içeriğinde ${wordCount} kelime var. Ortalama okuma hızına göre yaklaşık ${Math.ceil(wordCount / 200)} dakika sürer.`,
          difficulty: "medium",
          category: "okuma"
        },
        {
          question: "Bu notun ana teması nedir?",
          options: [
            hasProgramming ? "Programlama" : "Genel Eğitim",
            hasTechnology ? "Teknoloji" : "Bilim",
            hasAI ? "Yapay Zeka" : "Sanat",
            "Öğrenme ve Gelişim"
          ],
          correctAnswer: hasProgramming ? "A" : hasTechnology ? "B" : hasAI ? "C" : "D",
          explanation: hasProgramming ? "Not içeriğinde programlama ana tema olarak görülüyor." :
                      hasTechnology ? "Not içeriğinde teknoloji ana tema olarak görülüyor." :
                      hasAI ? "Not içeriğinde yapay zeka ana tema olarak görülüyor." :
                      "Not içeriğinde genel öğrenme ve gelişim teması ele alınıyor.",
          difficulty: "medium",
          category: "tema"
        }
      ]
    };
    
    console.log('Returning mock quiz data');
    return mockQuiz;
    
    /* Original AI code (commented due to quota limits)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Bu metinden ${questionCount} adet çoktan seçmeli soru oluştur. 
Zorluk seviyesi: ${difficulty}
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
      "explanation": "Açıklama",
      "difficulty": "medium",
      "category": "kategori"
    }
  ]
}
`;

    console.log('Sending prompt to AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI response:', text.substring(0, 200));
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('Parsed quiz:', parsed);
    return parsed;
    */
  } catch (error) {
    console.error('AI Quiz generation error:', error);
    throw new Error(`Failed to generate quiz questions: ${error.message}`);
  }
};

const generateSummary = async (noteContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Bu metni özetle ve anahtar noktaları çıkar. 
Madde işaretli bir liste halinde sun.
Önemli kavramları vurgula.

Metin: ${noteContent}

JSON formatında yanıtla:
{
  "summary": "Genel özet",
  "keyPoints": ["Anahtar nokta 1", "Anahtar nokta 2"],
  "importantConcepts": ["Kavram 1", "Kavram 2"],
  "readingTime": "Tahmini okuma süresi"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI Summary generation error:', error);
    throw new Error('Failed to generate summary');
  }
};

const generateChatResponse = async (noteContent, userQuestion) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Bu not içeriğine dayanarak kullanıcının sorusunu yanıtla.
Sadece not içeriğindeki bilgileri kullan.
Eğer not içeriğinde yanıt yoksa, bunu belirt.

Not İçeriği: ${noteContent}

Kullanıcı Sorusu: ${userQuestion}

Yanıtını Türkçe olarak ver ve not içeriğinden referanslar göster.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Chat response error:', error);
    throw new Error('Failed to generate chat response');
  }
};

const generateExplanation = async (question, userAnswer, correctAnswer, noteContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Kullanıcı bu soruyu yanlış cevapladı. Neden yanlış olduğunu açıkla ve doğru cevabı ver.

Soru: ${question}
Kullanıcının Cevabı: ${userAnswer}
Doğru Cevap: ${correctAnswer}

Not İçeriği: ${noteContent}

Yanıtını JSON formatında ver:
{
  "explanation": "Neden yanlış olduğunun açıklaması",
  "correctAnswer": "Doğru cevap",
  "reference": "Not içeriğinden referans",
  "tip": "Gelecekte benzer hataları önlemek için ipucu"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI Explanation generation error:', error);
    throw new Error('Failed to generate explanation');
  }
};

module.exports = {
  generateQuiz,
  generateSummary,
  generateChatResponse,
  generateExplanation
}; 