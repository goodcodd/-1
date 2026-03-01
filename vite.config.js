import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages: base має бути назвою репозиторію
  // Репозиторій називається "-1", тому base: '/-1/'
  // Для локальної розробки використовуємо '/', для production (GitHub Pages) - '/-1/'
  base: process.env.GITHUB_ACTIONS 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : process.env.NODE_ENV === 'production'
      ? '/-1/'
      : '/',
});
