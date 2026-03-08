# Налаштування GitHub Pages

Цей проєкт налаштований для автоматичного деплою на GitHub Pages через GitHub Actions.

## Автоматичне розгортання (рекомендовано)

### Крок 1: Налаштування репозиторію

1. Завантажте код на GitHub:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

2. Увімкніть GitHub Pages:
   - Перейдіть до вашого репозиторію на GitHub
   - Відкрийте **Settings** → **Pages**
   - У розділі **Source** виберіть **GitHub Actions**
   - Збережіть зміни

### Крок 2: Автоматичний деплой

Після налаштування, кожен push до гілки `main` або `master` автоматично:
- Збирає проєкт (`npm run build`)
- Розгортає його на GitHub Pages

### Крок 3: Доступ до сайту

Ваш сайт буде доступний за адресою:
```
https://username.github.io/repository-name/
```

**Примітка:** Замініть `username` та `repository-name` на ваші значення.

## Ручне розгортання (альтернатива)

Якщо ви хочете розгорнути вручну:

1. Зберіть проєкт:
   ```bash
   npm run build
   ```

2. Оновіть `vite.config.js` з правильним `base`:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/repository-name/', // Замініть на назву вашого репозиторію
   });
   ```

3. Перебудують проєкт:
   ```bash
   npm run build
   ```

4. Завантажте вміст папки `dist` на гілку `gh-pages` або використайте GitHub CLI:
   ```bash
   npx gh-pages -d dist
   ```

## Налаштування base path

Якщо ваш репозиторій знаходиться в організації або має іншу структуру, вам може знадобитися оновити `base` в `vite.config.js`:

- Для репозиторію `username/repo-name`: `base: '/repo-name/'`
- Для репозиторію в організації: `base: '/org-name/repo-name/'`
- Для кореневого домену: `base: '/'`

## Перевірка деплою

1. Перевірте статус workflow:
   - Перейдіть до вкладки **Actions** у вашому репозиторії
   - Переконайтеся, що workflow успішно виконався

2. Перевірте налаштування Pages:
   - **Settings** → **Pages**
   - Переконайтеся, що вибрано правильне джерело

3. Відкрийте ваш сайт:
   - Зачекайте кілька хвилин після деплою
   - Відкрийте URL вашого сайту

## Усунення проблем

### Сайт не відображається правильно

- Перевірте, що `base` в `vite.config.js` відповідає назві репозиторію
- Переконайтеся, що файл `.nojekyll` присутній у папці `public/`
- Перевірте консоль браузера на наявність помилок

### 404 помилки

- Переконайтеся, що `base` path правильний
- Перевірте, що всі шляхи до ресурсів відносні
- Очистіть кеш браузера

### Workflow не запускається

- Перевірте, що файл `.github/workflows/deploy.yml` існує
- Переконайтеся, що ви працюєте з гілкою `main` або `master`
- Перевірте налаштування permissions у репозиторії

## Додаткові ресурси

- [Офіційна документація Vite - GitHub Pages](https://vite.dev/guide/static-deploy#github-pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)



