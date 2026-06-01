# Prime AI - Emlak Değerleme Sistemi

Prime AI, Gemini yapay zeka ve Google Search Grounding teknolojisini kullanarak Türkiye'deki gayrimenkuller için gerçekçi pazar değerlemeleri sunan modern bir SaaS uygulamasıdır.

## ✨ Özellikler

- 🤖 **Gemini AI Entegrasyonu** - Güncel piyasa verilerine dayalı değerleme
- 🔍 **Google Search Grounding** - İnternette canlı veri doğrulaması
- 📊 **Premium Dashboard** - Modern glassmorphism arayüzü
- 🏘️ **20+ Şehir Desteği** - Tüm Türkiye'yi kapsayan fiyatlandırma
- 💎 **Kurumsal Tasarım** - Prime AI marka kimliğine uygun
- 🚀 **Tamamen Ücretsiz Deploy** - Render + Vercel kombinasyonu

## 🛠️ Teknoloji Stack

**Frontend:**
- React Native + Expo
- TypeScript
- React Native Web (Web uyumluluğu için)

**Backend:**
- FastAPI (Python)
- Google Gemini API
- Pydantic (Data validation)

**Deployment:**
- Render (Backend)
- Vercel (Frontend)

## 🚀 Hızlı Başlangıç

### Prerequisites
- Node.js 18+
- Python 3.12+
- npm veya yarn

### Local Çalıştırma

**1. Backend'i Başlat:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_api_key_here
python main.py
```

**2. Frontend'i Başlat:**
```bash
npm install
npx expo install
npx expo start --web
```

Tarayıcı açılacak: http://localhost:8083

## 📦 Deployment

Render ve Vercel'a ücretsiz deployment için [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) dosyasını takip edin.

### Production URLs
- **Backend:** https://emlak-ai-backend.render.com
- **Frontend:** https://emlak-ai.vercel.app

## 📋 Proje Yapısı

```
emlak-ai/
├── App.tsx                 # Ana uygulama komponenti
├── package.json            # Frontend bağımlılıkları
├── vercel.json            # Vercel konfigürasyonu
├── DEPLOYMENT_GUIDE.md    # Deployment rehberi
├── backend/
│   ├── main.py            # FastAPI sunucusu
│   ├── gemini_service.py  # AI değerleme motoru
│   ├── requirements.txt    # Backend bağımlılıkları
│   ├── render.yaml        # Render konfigürasyonu
│   └── .env.example       # Environment template
└── .env.example           # Environment template
```

## 🔑 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8001  # Optional
```

### Frontend (Vercel)
```
VITE_API_URL=https://emlak-ai-backend.render.com
```

## 💰 Maliyet

- **Backend (Render Free):** 0 TL/ay ✅
- **Frontend (Vercel Free):** 0 TL/ay ✅
- **Google Gemini API:** Ücretsiz tier mevcuttur ✅

**Toplam:** Tamamen Ücretsiz! 🎉

## 🧪 API Endpoints

### POST /api/valuate
Mülk değerlemesi yap.

**Request:**
```json
{
  "city": "İstanbul",
  "district": "Kadıköy",
  "sqm": 120,
  "rooms": "3+1",
  "floor": 5,
  "building_age": 10,
  "furnished": true,
  "in_complex": false
}
```

**Response:**
```json
{
  "min_price": 7042735,
  "max_price": 9203575,
  "avg_sqm_price": 80031,
  "factors": [
    "Konumun İstanbul/Kadıköy bölgesinde pazar değeri",
    "Bina yaşı (0 yıl) - yapı kalitesi ve onarım durumu",
    ...
  ]
}
```

### GET /health
Sunucu durumu kontrol et.

**Response:**
```json
{
  "status": "ok"
}
```

## 🎨 UI/UX Özellikleri

- **Modern Dashboard:** Side-by-side form ve sonuçlar paneli
- **Oda Seçici:** Tıklanabilir buton grubu
- **Glassmorphism Kartlar:** Premium cam efekti
- **Google Grounding Badge:** Yeşil parıltılı rozet
- **Loading Animation:** Profesyonel spinner
- **Responsive Design:** Tüm ekran boyutlarında çalışır

## 🐛 Bilinen Sorunlar

- Gemini API model availability'sine göre fallback mekanizması çalışır
- Render free tier'de cold start gecikmeleri olabilir (ilk request yavaş)

## 🔮 Gelecek Planlar

- [ ] Database entegrasyonu (PostgreSQL)
- [ ] User accounts ve favoriler
- [ ] Advanced filtering ve search
- [ ] AI-powered property recommendations
- [ ] Mobile app (native iOS/Android)

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Built with ❤️ using modern web technologies.

## 📞 Destek

Sorunlar için GitHub Issues açın.

---

**Happy Deploying!** 🚀
