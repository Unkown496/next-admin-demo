# Содержание

- [Деплой](#деплой)
- [Проблемы совместимости](#проблемы-совместимости)
- [Стандартная конфигурация](#стандартная-конфигурация)
- [Подход к конфигам](#подход-к-конфигам)
- [Архитектура папок](#архитектура-папок)
- [Выход к adminjs](#выход-к-adminjs)
- [Мультиязычность](#мультиязычность)

# Деплой

```bash
git clone https://github.com/Unkown496/next-admin-demo.git <folder-name>
cd <folder-name>
git remote remove origin # Отвязка от исходного репозитория
cp .env.example .env # Заполните .env
npm i
npm run dev|start
```

# Проблемы совместимости

`adminjs` адаптер для `prisma`, не умеет работать с свежими версиями `prisma`, а работает только с версией `5.0.0`. Но это создает баги только при установке зависимостей, т.к `Npm` ругается на несовместимость версий, поэтому в этом прокте пример для `prisma@5.0.0`.

### Использование с другими orm

`adminjs` поддерживает более трех адаптеров по стандарту, можно использовать `mikroorm` для `next+ts` проекта к примеру, там таких проблем с версиями не будет

# Стандартная конфигурация

1. tailwindCss + scss
2. prisma
3. eslint + styleLint (опционально)
4. cross-env|dotenv - для запуска в разных `NODE_ENV` и импорта env в стартер

# Подход к конфигам

`.env` - Конфиги без префикса `NEXT_` относятся к серверу `express`

#### Предустановленные .env

```env
# Jwt setup
JWT_SECRET=
JWT_EXPIRES=

# Cookie setup
COOKIE_SECRET=
```

Эти `env` обязательные к заполению, чтобы админку можно было поднять

# Архитектура папок

`utils` - Папка для серверных утилит, сюда пойдут любые утилиты для express сервера
`generate` - Папка для генерирования различных вещей при помощи node.js

# Выход к adminjs

```js
const app = new App(modelsNames, {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  // Выход на все опции кроме ресурсов и пути
  adminJSOptions: {
    branding: {
      companyName: 'skeleton',
    },
  },
});
```

`Admin`

```prisma
model Admin {
  id Int @id @default(autoincrement())
  email     String   @unique
  password  String
}
```

Спец модель для администратора, если нужно менять под специфику проекта, то затронуть аунтетификацию
Для смены способа аунтетификации (сейчас jwt+hash password argon2id)

```js
  async singIn({ email, password }) {
        const admin = await client.admin.findUnique({
          where: {
            email,
          },
        });

        if (!admin) return null;

        const passwordVerify = await argon2.verify(admin.password, password);
        if (!passwordVerify) return null;

        const token = jwt.sign(
          {
            id: admin.id,
            email: admin.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES || '1h' },
        );

        return token;
      },
```

Переписывается этот метод в `prisma/orm.js`

# Мультиязычность

Чтобы добавить свой перевод, нужно загрузить `.json` в папку `locales`, где ключом языка станет название файла по методу `localName.json`
Вводить только короткий ключ языка
