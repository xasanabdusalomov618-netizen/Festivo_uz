# Festivo.uz

**Stul, stol, les va mebel uchun e’lonlar / reklama platformasi.**
React + Vite + TypeScript asosida qurilgan. Ma’lumotlar brauzerning `localStorage`
bazasida saqlanadi — hech qanday server yoki baza talab qilinmaydi.

> Marketplace / classifieds board for chairs, tables, timber, furniture and building
> materials. Red + blue brand, day/night theme, three languages (UZ / RU / EN).

---

## Imkoniyatlar

| Bo‘lim | Nima qiladi |
| --- | --- |
| **Kun / Tun** | Sarlavhadagi tugma — yorug‘ va qorong‘i rejim, tanlov `localStorage`da saqlanadi, sahifa yuklanishida rang sakrab ketmaydi (`index.html` ichidagi inline skript). |
| **3 til (UZ / RU / EN)** | Barcha interfeys yozuvlari va e’lon sarlavha/tavsiflari uch tilda (`src/i18n/dict.ts`). Til tanlovi saqlanadi va `document.lang` ga yoziladi. |
| **Qidiruv** | Sarlavha, tavsif, shahar va sotuvchi bo‘yicha live-qidiruv + tezkor so‘rov chipalari. |
| **Kategoriyalar** | Stullar, Stollar, Les va yog‘och, Mebel, Qurilish materiallari, Xizmat va ishlab chiqarish, Boshqa — har birida hisoblagich. |
| **Filtrlar** | Narx oralig‘i, holat (yangi / ishlatilgan), sotuvchi turi (xususiy / ustaxona / do‘kon), faqat rasmli, shahar, saralash (yangi / arzon / qimmat / ommabop) va faol filtrlar chipalari. |
| **E’lon berish** | 3 qadamli forma: validatsiya, rasm yuklash (drag&drop, canvas orqali 1000px gacha kichraytiriladi), URL orqali rasm, "Ko‘tarish (boost)" rejimi. |
| **E’lon sahifasi** | Galereya, narx, xususiyatlar jadvali, sotuvchi kartasi, telefonni ochib ko‘rsatish / nusxalash, ulashish (`navigator.share`), o‘xshash e’lonlar, o‘chirish. |
| **Saralangan & Mening e’lonlarim** | Yurakcha bilan saqlash, ko‘rishlar va "yoqdi" hisoblagichlari real vaqtda o‘zgaradi. |
| **Grid / Ro‘yxat** | Ko‘rish rejimini almashtirish, 9 tadan sahifalab yuklash. |

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173  (0.0.0.0 da tinglaydi)
npm run build      # dist/ papkasiga yig‘adi
npm run preview    # yig‘ilgan versiyani ko‘rish
npm run typecheck  # tsc --noEmit
```

## Tuzilma

```
src/
  components/   Header, Hero, CategoryStrip, Toolbar, AdCard, AdDetail, AdForm,
                Modal, Toasts, Footer, Sections (Why + Sell banner), LangSwitcher,
                ThemeToggle, Icon (barcha SVG ikonkalar)
  context/      AppContext — til, mavzu, e’lonlar store, sevimlilar, toasts
  data/         catalog.ts (kategoriyalar), seed.ts (16 ta demo e’lon, 3 tilda)
  i18n/         dict.ts — uz / ru / en lug‘at (kalitlar uz bo‘yicha tekshiriladi)
  lib/          format, time, storage, image yordamchilari
  styles/       global.css — dizayn tokenlari, qizil-ko‘k palitra, kun/tun
public/img/     demo e’lonlar uchun rasmlar
```

## Ma’lumotlar modeli

`Ad` — `src/types.ts`: sarlavha va tavsif `Record<'uz'|'ru'|'en', string>`,
narx so‘mda (`0` = kelishuv asosida), kategoriya, holat, sotuvchi turi, shahar,
telefon, rasmlar (`/img/...` yoki data URL), `views`, `likes`, `premium`.

Saqlanadigan kalitlar: `festivo.ads.v1`, `festivo.favs.v1`, `festivo.lang.v1`,
`festivo.theme`, `festivo.boosted.v1`.

## Keyingi qadamlar (roadmap)

- [ ] Backend: Node/Express + PostgreSQL yoki SQLite — e’lonlar, moderatsiya, foydalanuvchi hisoblari.
- [ ] Autentifikatsiya (telefon + SMS kod) va shaxsiy kabinet.
- [ ] Rasm uchun ob’ekt storage (hozir data URL `localStorage` hajmi cheklangan).
- [ ] To‘lov integratsiyasi (boost, banner) — Payme / Click.
- [ ] Har bir shahar/tuman uchun alohida sahifa va SEO (`sitemap`, SSR).

Demo rasmlar AI orqali yaratilgan va faqat namuna uchun ishlatilgan.
