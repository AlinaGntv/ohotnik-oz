#!/bin/bash
# Обновление сайта на Jino из ветки build репозитория (её собирает GitHub Actions).
# Установка один раз:  curl -fsSo ~/update-site.sh https://raw.githubusercontent.com/AlinaGntv/ohotnik-oz/main/tools/update-site.sh && chmod +x ~/update-site.sh
# Обновление сайта:    ~/update-site.sh
set -e

REPO=https://github.com/AlinaGntv/ohotnik-oz.git
SRC=~/ohotnik-build
SITE=~/domains/ohotnik-oz.ru

if [ -d "$SRC/.git" ]; then
  git -C "$SRC" fetch -q --depth 1 origin build
  git -C "$SRC" reset -q --hard origin/build
else
  git clone -q --depth 1 -b build "$REPO" "$SRC"
fi

# копируем сборку в папку сайта (без .git); конфиг и всё вне папки сайта не трогаем
(cd "$SRC" && tar --exclude=.git -cf - .) | tar -xf - -C "$SITE"

# старые файлы сборки: у них хэш в имени, новые их не перезаписывают
for f in "$SITE"/assets/*; do
  [ -e "$SRC/assets/$(basename "$f")" ] || rm -f "$f"
done
rm -f "$SITE/api/deploy.php" # остался от прежней схемы деплоя

find "$SITE" -type d -exec chmod 755 {} +
find "$SITE" -type f -exec chmod 644 {} +

echo "Сайт обновлён: $(git -C "$SRC" log -1 --format='%s (%cd)' --date=format:'%d.%m.%Y %H:%M')"
