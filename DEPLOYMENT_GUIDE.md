# Emlak AI - Deployment Rehberi

Emlak AI uygulamasını Render (Backend) ve Vercel (Frontend) platformlarına ücretsiz olarak deploy etmek için bu rehberi takip edin.

---

## 📋 Ön Koşullar

1. **GitHub Hesabı** - Kodlarını GitHub'a push et
2. **Render Hesabı** - https://render.com (ücretsiz)
3. **Vercel Hesabı** - https://vercel.com (ücretsiz)
4. **Google Gemini API Key** - https://ai.google.dev/ (ücretsiz)

---

## 🚀 ADIM 1: Backend'i Render'a Deploy Etme

### 1.1 GitHub'a Push Et

```bash
git init
git add .
git commit -m "Initial commit - Emlak AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/emlak-ai.git
git push -u origin main
```

### 1.2 Render'da Yeni Web Service Oluştur

1. https://render.com adresine git
2. "New +" butonuna tıkla
3. "Web Service" seç
4. GitHub repo'nu bağla (emlak-ai)
5. Aşağıdaki ayarları yap:

| Ayar | Değer |
|------|-------|
| **Name** | emlak-ai-backend |
| **Environment** | Python 3 |
| **Build Command** | `cd backend && pip install -r requirements.txt` |
| **Start Command** | `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app` |
| **Plan** | Free |

### 1.3 Environment Variables Ekle

Render dashboard'da "Environment" tab'ına git ve ekle:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 1.4 Deploy Et

"Create Web Service" butonuna tıkla ve deploy'un bitmesini bekle (~2-3 dakika)

✅ Backend URL'ni kopyala: `https://emlak-ai-backend.render.com`

---

## 🌐 ADIM 2: Frontend'i Vercel'a Deploy Etme

### 2.1 Vercel'a Bağlan

1. https://vercel.com adresine git
2. "New Project" butonuna tıkla
3. GitHub repo'nu seç (emlak-ai)

### 2.2 Project Ayarları Yap

**Framework Preset:** "Other" seç

**Root Directory:** `.` (root)

**Build & Development Settings:**
- **Build Command:** `npx expo export --platform web`
- **Output Directory:** `.expo/dist/client`
- **Install Command:** `npm install && npx expo install`

### 2.3 Environment Variables Ekle

"Environment Variables" tab'ında ekle:

```
VITE_API_URL = https://emlak-ai-backend.render.com
```

### 2.4 Deploy Et

"Deploy" butonuna tıkla ve bitmesini bekle (~3-5 dakika)

✅ Frontend URL'ni al: `https://emlak-ai.vercel.app` (veya özel domain)

---

## 🧪 Test Etme

1. Vercel URL'ni tarayıcıda aç
2. Mülk bilgilerini gir
3. "Yapay Zeka ile Değerlendir" butonuna tıkla
4. Sonuçlar görüntülenirse başarılı! ✨

---

## 📝 Local Development

### Backend Çalıştırma

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_key_here
python main.py
```

Backend çalışacak: `http://localhost:8001`

### Frontend Çalıştırma

```bash
npm install
npx expo install
npx expo start --web
```

Frontend çalışacak: `http://localhost:8081` veya `http://localhost:8083`

---

## 🔧 Sorun Giderme

### "Build failed" hatası
- GitHub repo'nda `render.yaml` dosyasının olduğunu kontrol et
- `requirements.txt` dosyasının backend klasöründe olduğunu kontrol et

### Frontend API'ye bağlanamıyor
- Vercel'da `VITE_API_URL` environment variable'ının doğru olduğunu kontrol et
- Render backend'in çalışır durumda olduğunu kontrol et: `https://your-backend.render.com/health`

### Gemini API hatası
- `GEMINI_API_KEY` environment variable'ının doğru olduğunu kontrol et
- API key'in aktif olduğunu Google AI Studio'da kontrol et

---

## 💰 Maliyet Tahmini

**Render (Backend):**
- Free tier: ✅ 0 TL/ay (750 saatlik compute)
- Premium: ~$7/ay

**Vercel (Frontend):**
- Free tier: ✅ 0 TL/ay (100 GB bandwidth)
- Pro: ~$20/ay

**Toplam:** ✅ Tamamen Ücretsiz!

---

## 📚 Faydalı Linkler

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Google Gemini API](https://ai.google.dev/)

---

## 🎯 Next Steps

1. Custom domain ekle (opsiyonel)
2. SSL/TLS sertifikası (Render ve Vercel otomatik sağlar)
3. Analytics ve monitoring ayarla
4. Database bağlantısı ekle (gelecek gelişme için)

---

## 📞 Destek

Herhangi bir sorun için GitHub Issues açabilirsin!

Happy Deploying! 🚀
