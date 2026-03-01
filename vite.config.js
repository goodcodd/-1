import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages: base має бути назвою репозиторію
  // Якщо репозиторій називається username/repo-name, то base: '/repo-name/'
  // Для локальної розробки base: '/'
  base: process.env.GITHUB_ACTIONS 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : '/',
});
