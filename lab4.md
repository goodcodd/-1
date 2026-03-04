# Лабораторна робота 4: Маршрутизація в React з react-router-dom

## Посилання

- **Репозиторій:** [GitHub Repository](https://github.com/your-username/my-react-app)
- **Розгорнута версія:** [GitHub Pages](https://your-username.github.io/my-react-app/) або [Vercel](https://your-app.vercel.app)

*Примітка: Замініть посилання на актуальні значення*

## Опис реалізованої структури маршрутів

### Архітектура маршрутизації

Проєкт використовує **React Router v6** з наступною ієрархічною структурою:

```
/ (MainLayout)
├── / (Home) - Головна сторінка
├── /feed (Feed) - Стрічка новин
├── /feed/:postId (PostPage) - Динамічний маршрут для окремого поста
├── /profile/* (Profile) - Профіль з вкладеною навігацією
│   ├── /profile (ProfileOverview) - Інформація профілю
│   └── /profile/settings (ProfileSettings) - Налаштування
└── * (NotFound) - 404 сторінка для неіснуючих маршрутів
```

### Обґрунтування вибору вкладеності

1. **Layout Route (`MainLayout`)**:
   - Використовується для спільної структури (навігація, footer)
   - Уникає дублювання коду навігації на кожній сторінці
   - Забезпечує консистентний UI на всіх сторінках
   - Використовує `Outlet` для рендерингу дочірніх компонентів

2. **Вкладена навігація в Profile (`/profile/*`)**:
   - Дозволяє створювати підсторінки всередині профілю
   - Використовує відносні шляхи (`""` та `"settings"`)
   - Забезпечує логічне групування пов'язаних сторінок
   - Покращує UX через бічну навігацію

3. **Динамічний маршрут (`/feed/:postId`)**:
   - Дозволяє переглядати окремі пости за унікальним ID
   - Використовує параметр URL для ідентифікації ресурсу
   - Забезпечує SEO-friendly URL структуру

4. **Wildcard маршрут (`*`)**:
   - Обробляє всі неіснуючі маршрути
   - Повинен бути останнім у списку маршрутів
   - Надає користувачу корисну інформацію про помилку

## Фрагменти коду

### 1. Конфігурація BrowserRouter

**src/main.jsx:**
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

**Пояснення:**
- `BrowserRouter` обгортає весь додаток для надання маршрутизації
- Використовує HTML5 History API для чистих URL (без `#`)
- Дозволяє використовувати кнопки "Назад/Вперед" браузера

### 2. Конфігурація Routes та Route

**src/App.jsx:**
```jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Feed from './pages/Feed/Feed';
import PostPage from './pages/PostPage/PostPage';
import Profile from './pages/Profile/Profile';
import ProfileOverview from './pages/Profile/ProfileOverview';
import ProfileSettings from './pages/Profile/ProfileSettings';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="feed" element={<Feed />} />
        <Route path="feed/:postId" element={<PostPage />} />
        <Route path="profile/*" element={<Profile />}>
          <Route index element={<ProfileOverview />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

**Ключові моменти:**
- `Routes` замінює `Switch` з v5
- `index` route відповідає точному шляху батьківського маршруту
- `:postId` - динамічний сегмент для параметрів URL
- `profile/*` - wildcard дозволяє вкладені маршрути
- `*` - catch-all маршрут для 404

### 3. Реалізація Layout із компонентом Outlet

**src/components/templates/MainLayout/MainLayout.jsx:**
```jsx
import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const getActiveClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.logo} end>
            React Lab
          </NavLink>
          <div className={styles.navLinks}>
            <NavLink to="/" className={getActiveClass} end>
              Головна
            </NavLink>
            <NavLink to="/feed" className={getActiveClass}>
              Стрічка
            </NavLink>
            <NavLink to="/profile" className={getActiveClass}>
              Профіль
            </NavLink>
          </div>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
```

**Пояснення:**
- `Outlet` - компонент, який рендерить дочірні маршрути
- `NavLink` - посилання з автоматичним визначенням активного стану
- `end` prop - забезпечує точний збіг для кореневого шляху `/`
- `getActiveClass` - функція для умовного застосування стилів

**Переваги Layout Route:**
- Уникає повторення навігації на кожній сторінці
- Зберігає стан навігації при переходах
- Спрощує підтримку та оновлення UI

### 4. Логіка обробки параметрів через useParams

**src/pages/PostPage/PostPage.jsx:**
```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { postsData } from '../../data';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = postsData.find(p => p.id === Number(postId));

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Пост не знайдено</h2>
          <p>Пост з ID {postId} не існує.</p>
          <button onClick={() => navigate('/feed')} className={styles.button}>
            Повернутися до стрічки
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Повернутися
        </button>
        
        <header className={styles.header}>
          <div className={styles.authorInfo}>
            <img src={post.avatar} alt={post.author} className={styles.avatar} />
            <div>
              <h2 className={styles.author}>{post.author}</h2>
              <p className={styles.date}>{post.date}</p>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <h1 className={styles.postTitle}>{post.content.split('.')[0]}</h1>
          <p>{post.content}</p>
        </div>

        <footer className={styles.footer}>
          <div className={styles.meta}>
            <span>❤️ {post.likes} лайків</span>
            <span>📝 Категорія: {post.category}</span>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;
```

**Ключові моменти:**
- `useParams()` - хук для отримання параметрів з URL
- `postId` відповідає `:postId` у визначенні маршруту
- Перетворення на число: `Number(postId)` для порівняння
- Обробка випадку, коли пост не знайдено
- Використання `navigate(-1)` для повернення в історії браузера

### 5. Приклад програмної навігації через useNavigate

**src/pages/Profile/ProfileSettings.jsx:**
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'Student_KP',
    email: 'student@example.com',
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Симуляція збереження налаштувань
    console.log('Налаштування збережено:', formData);
    
    // Програмне перенаправлення на головну сторінку
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Налаштування профілю</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ... поля форми ... */}
        
        <div className={styles.actions}>
          <Button type="submit" variant="primary">
            Зберегти зміни
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
```

**Пояснення:**
- `useNavigate()` - хук для програмної навігації
- `navigate('/')` - перехід на абсолютний шлях
- `navigate(-1)` - повернення на попередню сторінку
- `navigate('/path', { replace: true })` - заміна поточної записи в історії
- Використовується після асинхронних операцій (збереження даних)

**Переваги програмної навігації:**
- Дозволяє навігацію після виконання логіки
- Можна передавати стан через `state` prop
- Підтримує заміну історії (`replace: true`)

## Контрольні запитання

### 1. У чому різниця між `BrowserRouter` та `HashRouter`?

**BrowserRouter:**
- Використовує HTML5 History API
- Чисті URL без символу `#` (наприклад, `/feed/123`)
- Краще для SEO та індексації пошуковими системами
- Потребує налаштування сервера для SPA (redirect на `index.html`)

**HashRouter:**
- Використовує hash (`#`) в URL (наприклад, `/#/feed/123`)
- Не потребує налаштування сервера
- Менш SEO-friendly
- Може викликати проблеми з аналітикою

**В нашому проєкті:** Використовується `BrowserRouter` для чистих URL та кращого SEO.

### 2. Що таке `Outlet` і навіщо він потрібен?

**Outlet** - це компонент у React Router v6, який рендерить дочірні маршрути всередині батьківського маршруту.

**Призначення:**
- Дозволяє створювати Layout Route з спільною структурою
- Рендерить дочірні компоненти в місці розташування `<Outlet />`
- Уникає повторення коду (DRY принцип)

**Приклад:**
```jsx
// Layout компонент
<MainLayout>
  <nav>...</nav>
  <Outlet /> {/* Тут рендериться дочірній маршрут */}
  <footer>...</footer>
</MainLayout>
```

**Переваги:**
- Навігація залишається видимою при переходах
- Зберігається стан компонентів Layout
- Спрощує структуру коду

### 3. Як працюють динамічні сегменти в маршрутах?

Динамічні сегменти дозволяють передавати параметри через URL.

**Синтаксис:**
```jsx
<Route path="feed/:postId" element={<PostPage />} />
```

**Отримання параметрів:**
```jsx
const { postId } = useParams();
```

**Особливості:**
- Параметр позначається двокрапкою (`:postId`)
- Можна використовувати кілька параметрів: `/user/:userId/post/:postId`
- Параметри завжди рядки, потрібно перетворювати на числа за потреби
- `useParams()` повертає об'єкт з усіма параметрами

**Приклад використання:**
```jsx
// URL: /feed/123
const { postId } = useParams(); // postId = "123"
const post = posts.find(p => p.id === Number(postId));
```

### 4. У чому різниця між `Link` та `NavLink`?

**Link:**
- Базовий компонент для навігації
- Не має автоматичного визначення активного стану
- Використовується для простих посилань

**NavLink:**
- Розширення `Link` з підтримкою активного стану
- Автоматично додає клас `active` для поточного маршруту
- Підтримує функцію `className` з параметром `isActive`
- Ідеальний для навігаційних меню

**Приклад:**
```jsx
// Link - просте посилання
<Link to="/feed">Стрічка</Link>

// NavLink - з активним станом
<NavLink 
  to="/feed"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Стрічка
</NavLink>
```

### 5. Що таке `index` route і коли його використовувати?

**Index route** - це маршрут, який рендериться, коли батьківський маршрут точно відповідає URL.

**Синтаксис:**
```jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<Home />} />
  <Route path="feed" element={<Feed />} />
</Route>
```

**Еквівалент:**
```jsx
// Це те саме, що:
<Route path="/" element={<Home />} />
```

**Коли використовувати:**
- Коли потрібен компонент для точного шляху батьківського маршруту
- У вкладених маршрутах для дефолтного контенту
- Для створення чистої структури маршрутів

**Приклад з Profile:**
```jsx
<Route path="profile/*" element={<Profile />}>
  <Route index element={<ProfileOverview />} /> {/* /profile */}
  <Route path="settings" element={<ProfileSettings />} /> {/* /profile/settings */}
</Route>
```

### 6. Як обробляються неіснуючі маршрути (404)?

Для обробки неіснуючих маршрутів використовується **wildcard маршрут** (`*`).

**Реалізація:**
```jsx
<Routes>
  <Route path="/" element={<MainLayout />}>
    <Route path="feed" element={<Feed />} />
    <Route path="*" element={<NotFound />} /> {/* Має бути останнім */}
  </Route>
</Routes>
```

**Важливо:**
- Wildcard маршрут (`*`) має бути останнім у списку
- Він відповідає всім шляхам, які не збіглися з попередніми
- Можна використовувати на будь-якому рівні вкладеності

**Компонент NotFound:**
```jsx
const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Сторінку не знайдено</p>
      <Link to="/">Повернутися на головну</Link>
    </div>
  );
};
```

### 7. Як працює програмна навігація через `useNavigate`?

`useNavigate` - хук для імперативної навігації в React Router v6.

**Базове використання:**
```jsx
const navigate = useNavigate();

// Перехід на абсолютний шлях
navigate('/feed');

// Перехід на відносний шлях
navigate('../feed');

// Повернення назад
navigate(-1);

// Перехід вперед
navigate(1);
```

**Додаткові опції:**
```jsx
// Заміна поточної записи в історії
navigate('/feed', { replace: true });

// Передача стану
navigate('/feed', { state: { from: 'profile' } });

// Отримання стану в цільовому компоненті
const location = useLocation();
const state = location.state; // { from: 'profile' }
```

**Коли використовувати:**
- Після успішного збереження форми
- Після авторизації
- При обробці помилок
- Для кнопок "Назад/Вперед"

