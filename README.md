# VocabWebSite

Amaç: Ebbinghaus’un unutma eğrisi ve SM-2 aralıklı tekrar algoritmasını temel alan; kelime öğrenme, active recall ve gamification odaklı bir web uygulaması.

Bu aşama sadece iskelet içerir (iş mantığı yok): Vite + React + TypeScript + Tailwind CSS, Zustand (persist), React Router, Vitest + React Testing Library, i18n altyapı placeholder’ları ve tema (light/dark) toggle.

## Kurulum

1) Bağımlılıkları yükle:

```bash
npm install
```

2) Geliştirme sunucusu:

```bash
npm run dev
```

3) Testler:

```bash
npm run test
```

## Dizin Yapısı

```
src/
  app/                # ThemeProvider, StoreProvider, I18nProvider (placeholder)
  components/         # Flashcard, ReviewControls (iskelet)
  features/
    decks/            # index.ts TODO
    reviews/          # index.ts TODO
    vocab/            # index.ts TODO
    gamification/     # index.ts TODO
  lib/                # sm2.ts, date/utils placeholders
  pages/              # Home, Review, Decks, AddVocab, Settings (temel sayfalar)
  store/              # useAppStore.ts (Zustand + persist iskeleti)
  styles/             # global.css (Tailwind base/components/utilities)
  tests/              # placeholder.test.ts
  types/              # models.ts (Vocab/Deck/Gamification arayüz TODO)

index.html            # Vite giriş
vite.config.ts        # Vite + Vitest ayarları (jsdom)
tailwind.config.js    # Tailwind ayarları (dark mode: class)
postcss.config.js     # PostCSS (tailwind, autoprefixer)
.eslintrc.cjs         # ESLint (TS + React hooks)
.prettierrc           # Prettier varsayılan
```

## Rotalar

- `/` (Home)
- `/review`
- `/decks`
- `/add`
- `/settings`

Navbar bu rotalara link içerir. Theme toggle ile light/dark arasında geçiş yapılır ve localStorage anahtarı `theme` ile kalıcıdır.

## Yol Haritası (Gelecek Aşamalar)

- SM-2 uygulaması ve parametre ayarlamaları
- Active Recall akışları (Flashcard etkileşimleri)
- XP/Streak, seviye sistemi ve rozetler
- Çoklu dil desteği (en/tr JSON dosyaları)

Not: Bu commit sadece proje iskeletini içerir; SM-2, state ve iş mantığı henüz eklenmedi.
