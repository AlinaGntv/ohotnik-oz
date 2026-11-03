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

1. Пушим изменения в `main`. GitHub Actions проверяет код, собирает сайт и кладёт готовую сборку в ветку `build` (`.github/workflows/build.yml`, около минуты).
2. В панели Jino → контейнер → **Консоль** выполняем:

   ```bash
   ~/update-site.sh
   ```

   Скрипт забирает ветку `build` и копирует её в `~/domains/ohotnik-oz.ru` ([tools/update-site.sh](tools/update-site.sh)).

Установка скрипта на сервер (один раз):

```bash
curl -fsSo ~/update-site.sh https://raw.githubusercontent.com/AlinaGntv/ohotnik-oz/main/tools/update-site.sh && chmod +x ~/update-site.sh
```

Автоматическая загрузка из GitHub в Jino не используется: крупные передачи данных между ними обрываются (проверены FTP, SFTP и HTTPS).

Ручная сборка: `npm run build`, готовые файлы окажутся в `dist`.
