import { styleText } from 'node:util';

import prompts from 'prompts';

import orm from '../prisma/orm.js';
import ora from 'ora';

const load = ora('Создание админа...');

(async () => {
  const data = await prompts([
    {
      type: 'text',
      name: 'email',
      message: 'Email админа: ',
    },
    {
      type: 'text',
      name: 'password',
      message: 'Пароль админа: ',
    },
  ]);

  load.start();
  try {
    await orm.admin.register(data);

    return load.stopAndPersist({
      text: `${styleText('green', 'Админ успешно создан!')} \n Email: ${
        data.email
      } \n Пароль: ${data.password}`,
    });
  } catch (err) {
    load.stopAndPersist({
      text: `${styleText('red', 'Ошибка при создании администратора!')}`,
    });

    return console.error(err);
  }
})();
