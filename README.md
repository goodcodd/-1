# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🚀 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main` or `master` branch

3. **Your site will be available at:**
   ```
   https://username.github.io/repository-name/
   ```

### Manual Build

To build the project locally:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Local Development

```bash
npm install
npm run dev
```

## 📚 Project Structure

- `src/components/atoms/` - Basic UI components (Button, Input, Typography)
- `src/components/molecules/` - Composite components (Card, Post)
- `src/components/organisms/` - Complex components
- `src/components/pages/` - Page components

## 📖 Documentation

- [Lab 1: React Components & Atomic Design](./lab1.md)
- [Lab 2: Lists & Keys](./lab2.md)
