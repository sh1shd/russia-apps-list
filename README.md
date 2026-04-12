# Russia-apps-list

Список российских приложений для Android (более 500), собранных из RuStore

## Краткий список приложений

В этот краткий список включены наиболее значимые и часто используемые приложения из `data/apps.json`, сгруппированные по категориям.

> [!WARNING]
> Это неполный перечень — полный список пакетов хранится в `data/apps.json`.

- ⚡ Сервисы Яндекса — `ru.yandex.*`, `com.yandex.*`
- ⚡ Сервисы Ozon — `ru.ozon.*`
- ⚡ Сервисы Wildberries — `com.wildberries.ru`, `ru.wildberries.*`
- ⚡ Сервисы ВКонтакте — `com.vk.*`
- ⚡ Сервисы операторов «большой четверки» — `com.megafon.*`, `ru.mts.*`, `ru.tele2.*`, `ru.beeline.*`
- ⚡ Госуслуги (разные модули) — `ru.gosuslugi.*`
- Федеральная налоговая служба (ФНС) — `ru.fns.*`
- Почта России (мобильный клиент) — `com.octopod.russianpost.client.android`, `ru.russianpost.pechkin`
- Московские сервисы — `ru.mos.*`
- Сервисы АО «Сбер» — `ru.sberbankmobile`, `com.sberbank.sberpravo`
- Сервисы АО «ТБанк» — `ru.tinkoff.*`
- Сервисы АО «ВТБ» — `az.vtb.android`, `ru.vtb.*`
- Газпромбанк, Райффайзен, РSHB и др. (также их сервисы) — `ru.gazprombank.android.mobilebank.app`, `ru.raiffeisennews`, `ru.rshb.*`
- РЖД и железнодорожные сервисы — `ru.rzd.pass`, `ru.rzd.*`
- Туту (расписания и билеты) — `ru.tutu.etrains`
- Пятёрочка, Магнит — `ru.pyaterochka.app.browser`, `ru.magnit.*`
- Rutube — `ru.rutube.app`
- Uchi (обучение) — `com.uchi.*`

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

Готово!