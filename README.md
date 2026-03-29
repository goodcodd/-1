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

---

## Лекція №11: Глобальне керування станом

### Завдання 1. Аналіз: Prop Drilling і «вузькі місця»

**Ланцюжок пропсів у проєкті.** На сторінці товару дані про продукт проходять маршрут `ProductPage → ProductContainer → ProductDetails` (поля `image`, `title`, `description`, `price`, `rating`) та `ProductContainer → ProductActions` (кількість і обробники). Це **два рівні** вкладеності для картки товару. Додатково у стрічці `Feed` список постів рендериться як `Feed → Post` з багатьма пропсами — також без глибокого «свердла», але батько передає багато полів.

**Гіпотетична проблема глибини 3+.** Якщо додати спільний **кошик** і показувати його в шапці (`MainLayout`), типовий підхід без глобального сховища — підняти стан у `App` або окремий провайдер і передавати `cart` / `onAddToCart` через `MainLayout` → `Outlet` → сторінку товару → контейнер. Це **чотири і більше рівнів** посередників, які не використовують дані кошика напряму — класичний Prop Drilling.

**Контекст авторизації (`AuthContext`).** Стан `isAuthenticated` і `user` живе в одному `value` об’єкті провайдера. Будь-яка зміна цього об’єкта змушує **усі** нащадки, що підписані на контекст, перераховуватися, якщо не розбити контекст чи не мемоїзувати значення. Для рідких змін (логін/логікаут) це прийнятно; для частого оновлення кошика чи списку товарів — гірше.

**Обґрунтування Zustand замість лише `useState` або простого Context.** Кошик — **складний стан**, який змінюється при кожному «Купити», може відображатися в різних гілках UI (шапка, сторінка товару). Потрібні **часткові підписки**: навігація має реагувати лише на загальну кількість позицій, а список рядків — на масив `items`. Контекст без розбиття та селекторів часто дає зайві перерендери всього піддерева; Redux Toolkit був би доречним у великій команді з time-travel і строгими патернами, але для лабораторної швидкої інтеграції **Zustand** з селекторами простіший і достатній.

---

### Завдання 2. Реалізація

- Встановлено: `zustand`.
- Файл сховища: [`src/store/useStore.js`](./src/store/useStore.js) — `items`, дії `addToCart`, `removeLine`, `clearCart`, селектори `selectTotalItems`, `selectTotalPrice`.
- `ProductContainer` додає товари в кошик через `addToCart` замість `alert`.
- `MainLayout` показує бейдж кількості на посиланні «Товар» через `useCartStore(selectTotalItems)`.
- На `ProductPage` додано блок `CartSummary` з переглядом кошика та очищенням.

---

### Завдання 3. Рефлексія

**Які компоненти-посередники вдалося «очистити» від непотрібних пропсів?** Після рефакторингу **не довелося** прокидати `cart`, `onAddToCart` або лічильник через `App`, `MainLayout` чи `ProductPage`. `MainLayout` і сторінка товару отримують дані кошика **напряму зі сховища**; посередники взагалі не беруть участі в передачі цих пропсів.

**Чому обрано Zustand?** По-перше, **мінімальний шаблонний код** — немає `Provider`, `slice`, `configureStore` для однієї сутності. По-друге, **зручні селектори**: `useCartStore(selectTotalItems)` повертає число; компонент оновлюється лише коли змінюється саме це значення, а не весь об’єкт стану.

**Як змінилася продуктивність і чому не перерендериться весь додаток?** Zustand порівнює **результат селектора** з попереднім значенням (за замовчуванням `Object.is`). Якщо компонент підписаний лише на `selectTotalItems`, зміна, наприклад, лише назви товару в іншому полі не змінить число — компонент не оновиться. На відміну від широкого React Context з одним `value`, де часто оновлюються всі споживачі при будь-якій зміні, **вузькі селектори** обмежують коло перерендерів лише тими компонентами, чиї обрані дані дійсно змінилися.
