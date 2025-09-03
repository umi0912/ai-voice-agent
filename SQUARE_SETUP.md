# Настройка подключения к Square

## Шаги для подключения к вашему Square аккаунту:

### 1. Получите Production Credentials

1. Перейдите на https://developer.squareup.com/
2. Войдите в ваш Square аккаунт
3. Выберите ваше приложение
4. Перейдите в раздел "Credentials"
5. Скопируйте:
   - **Application ID** (production) - начинается с `sq0idp-`
   - **Application Secret** (production) - начинается с `sq0csb-`

### 2. Обновите конфигурацию

✅ **Уже настроено!** Ваши production credentials:

```bash
SQUARE_APP_ID=sq0idp-jXJquQQ4uPG0_NwR7DL86Q
SQUARE_APP_SECRET=your_production_app_secret_here
```

### 3. Настройте OAuth Redirect URL

В Square Developer Dashboard:

1. Перейдите в раздел "OAuth"
2. Добавьте redirect URL: `https://f719395c2ed1.ngrok-free.app/oauth/callback`
3. Сохраните изменения

### 4. Перезапустите приложение

✅ **Уже выполнено!** Сервер запущен с production credentials.

### 5. Тестирование подключения

1. Откройте http://localhost:3000/
2. Нажмите кнопку "Connect to Square"
3. Вас перенаправит на Square для авторизации
4. После авторизации вы вернетесь в приложение

### 6. Проверка статуса

- Health check: http://localhost:3000/health
- OAuth connect: http://localhost:3000/oauth/connect

## Важные замечания:

- Убедитесь, что ngrok запущен для внешнего доступа
- Production credentials отличаются от sandbox
- После подключения вы сможете принимать реальные платежи
