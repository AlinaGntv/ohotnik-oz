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

## Заявки и уведомления

Бронь стола и заказ доставки отправляются в `public/api/notify.php`, оттуда — в вебхук Make и в Telegram. Настройка бота, сценария Make и конфига на сервере: [docs/notifications-make.md](docs/notifications-make.md).

## Деплой

При каждом push в ветку `main` GitHub Actions собирает сайт и отправляет папку `dist` одним подписанным HTTPS-запросом в `public/api/deploy.php` на сайте (`.github/workflows/deploy.yml`). FTP и SFTP между GitHub и Jino работали нестабильно, поэтому от них отказались.

Нужен один секрет репозитория (Settings → Secrets and variables → Actions):

| Секрет | Значение |
|---|---|
| `DEPLOY_TOKEN` | тот же ключ, что `deploy_token` в `~/ohotnik-config.php` на сервере |

Пока секрет не задан, сборка проходит, а шаг загрузки пропускается. Без `deploy_token` в конфиге `deploy.php` отвечает 404.

Ручная сборка: `npm run build`, готовые файлы окажутся в `dist`.
