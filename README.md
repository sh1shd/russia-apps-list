# Russia-apps-list

Список российских приложений для Android (более 500), собранных из RuStore

## Краткий список приложений

В этот краткий список включены наиболее значимые и часто используемые приложения из `data/apps.json`, сгруппированные по категориям.

> [!WARNING]
> Это неполный перечень — полный список пакетов хранится в `data/apps.json`. Страницы разработчиков, откуда берутся приложения, находятся в файле `src/constants.ts`
> https://github.com/sh1shd/russia-apps-list/blob/982c0df5d523f0b96ece01726ae8ba0a26bc3057/src/constants.ts#L1

- Национальный мессенджер MAX (МАКС)
- Социальная сеть ВКонтакте, VK Мессенджер, VK Музыка, VK Видео
- СберБанк Онлайн, СберИнвестиции
- Авито
- Т-Банк (Тinkoff), Т-Инвестиции
- Ozon (Маркетплейс, Ozon Банк)
- ВТБ Онлайн, ВТБ Мои Инвестиции
- Альфа-Банк, Альфа-Инвестиции
- Портал «Госуслуги», Госуслуги Авто, Госуслуги Культура
- Маркетплейс Wildberries, WB Point

## Как использовать?

### Happ

#### Сервер подписок
1. Откройте [happ-subscription.txt](https://raw.githubusercontent.com/sh1shd/russia-apps-list/refs/heads/master/raw/happ-subscription.txt) и полностью скопируйте содержимое файла.  
2. Настройте сервер подписок так, чтобы перед ключами он вставлял именно этот текст.

#### Клиент (Android)
1. Откройте [happ-user.txt](https://raw.githubusercontent.com/sh1shd/russia-apps-list/refs/heads/master/raw/happ-user.txt) и полностью скопируйте содержимое файла.  
2. В приложении Happ перейдите в настройки.  
3. Выберите «Прокси для выбранных приложений».  
4. Установите режим «Обход».  
5. Нажмите на меню (⋮), выберите «Импорт из буфера обмена», затем «Инвертировать».

#### Клиент & сервер (Clash Mihomo)
1. Измените конфигурационный файл, добавьте следующее:

```yaml
rule-providers:
  russia-apps:
    type: http
    url: "https://raw.githubusercontent.com/sh1shd/russia-apps-list/refs/heads/master/raw/mihomo-rules.yaml"
    interval: 600
    behavior: classical
    format: yaml

rules:
    # ...ваши правила
    - "RULE-SET,russia-apps,DIRECT" # или другой прокси
```

Готово!