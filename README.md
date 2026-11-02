# Охотник — сайт ресторана

Сайт ресторана «Охотник» (Орехово-Зуево, лесопарк «Мельница»): меню с доставкой, банкетные залы, домики и бронирование.

Стек: React 19 + Vite, без CSS-фреймворков. Стили лежат рядом с компонентами в `src/components/*.css`, общие цвета и шрифты — в `src/styles/global.css`.

## Запуск локально

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:5173.

## Где что менять

| Что | Где |
|---|---|
| Тексты, меню, цены, залы, домики, контакты | `src/data/content.js` |
| Акция на доставку (скидка и даты) | `promo` в `src/data/content.js` |
| Логотип и иконки сайта | `public/images/logo.webp`, `public/favicon.png` |
| Цвета и шрифты | `src/styles/global.css` |

## Деплой

При каждом push в ветку `main` GitHub Actions собирает сайт и загружает папку `dist` на хостинг Jino по FTP (`.github/workflows/deploy.yml`).

Нужные секреты репозитория (Settings → Secrets and variables → Actions):

| Секрет | Значение |
|---|---|
| `FTP_SERVER` | `c825fa2a9b46.hosting.myjino.ru` |
| `FTP_USERNAME` | логин FTP-аккаунта |
| `FTP_PASSWORD` | пароль FTP-аккаунта |
| `FTP_SERVER_DIR` | папка сайта на сервере, со слешем в конце, для технического адреса Jino — `/domains/c825fa2a9b46.hosting.myjino.ru/` |

Пока секреты не заданы, сборка проходит, а шаг загрузки пропускается.

Ручная сборка: `npm run build`, готовые файлы окажутся в `dist`.
