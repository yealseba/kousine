# Sinema Kulübü Portalı - Geliştirme Kuralları (Vibe Coding)

## Proje Vizyonu
Sinema kulübünün geçmiş ve gelecek etkinliklerini sergileyen, Netflix tarzı modern bir platform.
Ana hedef: Kod bilmeyen kulüp üyelerinin bir arayüzden etkinlik ekleyebilmesi.

## Teknik Yığın (Stack)
- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn/UI.
- **Backend/Database:** Supabase (Postgres).
- **Deployment:** Vercel + GitHub (Sürekli yedekleme ve yayınlama).

## Kritik Kurallar & Özellikler
1. **Admin Paneli (ZORUNLU):** `/admin` yolu altında şifreli bir panel olmalı. Kulüp başkanı buradan film adı, afiş, tarih ve özet girerek "Kod yazmadan" siteyi güncelleyebilmeli.
2. **Dinamik Zamanlama:**
   - Eğer `event_date` bugünden sonraysa: "Gelecek Etkinlik" (Hero bölümünde geri sayımlı: "1 gün 20 saat kaldı").
   - Eğer `event_date` geçmişse: "Geçmiş Etkinlikler" (Netflix tarzı slider listesi).
3. **Tasarım Dili:** Koyu tema (Dark Mode), büyük görsel odaklı kartlar, "Hover" edildiğinde büyüyen afişler.
4. **Veri Güvenliği:** Görseller Supabase Storage'da, veriler Supabase Database'de tutulmalı.
5. **Yedekleme:** Her büyük güncellemede GitHub'a 'commit' atılarak versiyon kontrolü sağlanmalı.

## Veri Yapısı (Events Tablosu)
- `title` (Etkinlik adı)
- `description` (Film özeti/Kulüp notu)
- `event_date` (Tarih ve Saat - Geri sayım için kritik)
- `poster_url` (Afiş yolu)
- `location` (Gösterim yeri/Sınıf)
- `is_active` (Yayında mı?)
