# Лабораторна робота 1: React компоненти та Atomic Design

## Контрольні запитання

### 1. Що таке Atomic Design і навіщо ми розділяємо компоненти на атоми та молекули?

**Atomic Design** — це методологія проектування інтерфейсів, запропонована Бредом Фростом, яка розділяє UI-компоненти на п'ять рівнів складності:

- **Atoms (Атоми)** — найменші, базові компоненти, які не можна розбити далі (кнопки, інпути, мітки)
- **Molecules (Молекули)** — прості комбінації атомів, що формують функціональні групи (поля форм, картки)
- **Organisms (Організми)** — складні комбінації молекул та атомів (хедер, футер, форми)
- **Templates (Шаблони)** — макети сторінок без реального контенту
- **Pages (Сторінки)** — конкретні сторінки з реальним контентом

**Навіщо розділяти на атоми та молекули:**
- **Модульність** — компоненти можна легко перевикористовувати
- **Підтримуваність** — легше знаходити та виправляти помилки
- **Масштабованість** — простіше додавати нові функції
- **Консистентність** — однакові атоми забезпечують узгоджений дизайн
- **Тестування** — простіші компоненти легше тестувати
- **Співпраця** — різні команди можуть працювати над різними рівнями одночасно

### 2. Як працюють CSS Modules і як вони вирішують проблему глобальних імен класів?

**CSS Modules** — це технологія, яка автоматично генерує унікальні імена класів для CSS-файлів, роблячи їх локальними для конкретного компонента.

**Як це працює:**
1. Створюємо файл з розширенням `.module.css` (наприклад, `Button.module.css`)
2. Імпортуємо стилі як об'єкт: `import styles from './Button.module.css'`
3. Використовуємо класи через об'єкт: `className={styles.button}`
4. Під час збірки CSS Modules автоматично перетворює імена класів на унікальні (наприклад, `button` → `Button_button__a1b2c3`)

**Як вирішується проблема глобальних імен:**
- **Ізоляція стилів** — класи з одного модуля не конфліктують з класами з іншого
- **Автоматична унікальність** — не потрібно вручну додавати префікси або використовувати BEM
- **Безпека** — можна використовувати прості імена на кшталт `button`, `input` без ризику конфліктів
- **Легке рефакторинг** — можна перейменовувати класи в одному модулі, не боячись вплинути на інші

**Приклад:**
```css
/* Button.module.css */
.button {
  padding: 10px;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';
// className="button" стає className="Button_button__a1b2c3"
<button className={styles.button}>Click</button>
```

### 3. Що таке `props.children` і в якому компоненті цієї лабораторної роботи ми його використали?

**`props.children`** — це спеціальний проп у React, який містить все, що передано між відкриваючим та закриваючим тегами компонента.

**Як це працює:**
```jsx
<Card>
  <h2>Заголовок</h2>
  <p>Текст</p>
</Card>
// Усередині Card компонента props.children = [<h2>Заголовок</h2>, <p>Текст</p>]
```

**У цій лабораторній роботі `props.children` використано в компоненті `Card`:**

```jsx
// Card.jsx
const Card = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};
```

Це дозволяє компоненту `Card` приймати будь-який контент і відображати його всередині обгортки зі стилями картки. У `App.jsx` ми передаємо форму входу як `children`:

```jsx
<Card>
  <h2>Ласкаво просимо</h2>
  <Input type="email" placeholder="Email" />
  <Input type="password" placeholder="Пароль" />
  <Button>Увійти</Button>
</Card>
```

### 4. Чому атрибут HTML `class` у JSX записується як `className`?

**Причина:** `class` є зарезервованим словом у JavaScript (використовується для оголошення класів ES6). Щоб уникнути конфліктів та підтримати сумісність з JavaScript, React використовує `className` замість `class`.

**Історичний контекст:**
- У HTML використовується `class`: `<div class="container">`
- У JSX використовується `className`: `<div className="container">`
- Під час рендерингу React автоматично перетворює `className` на `class` у DOM

**Інші відмінності між HTML та JSX:**
- `for` → `htmlFor` (для елементів `<label>`)
- `tabindex` → `tabIndex`
- Події пишуться в camelCase: `onclick` → `onClick`, `onchange` → `onChange`
- Стилі передаються як об'єкт: `style={{ color: 'red' }}` замість рядка

## Фрагмент коду

### App.jsx - Форма входу

```jsx
import Button from './components/atoms/Button/Button';
import Input from './components/atoms/Input/Input';
import Card from './components/molecules/Card/Card';

function App() {
  const handleLogin = () => {
    alert('Логіка входу буде реалізована пізніше');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Ласкаво просимо</h2>

        <div style={{ marginBottom: '15px' }}>
          <Input type="email" placeholder="Email" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input type="password" placeholder="Пароль" />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button onClick={handleLogin} variant="primary">Увійти</Button>
          <Button variant="secondary">Реєстрація</Button>
        </div>
      </Card>
    </div>
  );
}

export default App;
```

