# Лабораторна робота 5: Context API, автентифікація та Protected Routes

## Фрагменти коду

### 1. Конфігурація `AuthContext.jsx`

```jsx
import { createContext, useState } from 'react';

// Створення контексту
export const AuthContext = createContext();

// Компонент-провайдер
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Реалізація компонента `ProtectedRoute.jsx`

```jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Захищений маршрут (HOC)
const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // replace: true важливо для чистої історії браузера
    return <Navigate to={redirectPath} replace />;
  }

  // Якщо є children — рендеримо їх, інакше Outlet для вкладених маршрутів
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
```

## Контрольні запитання

### 1. Яку архітектурну проблему (prop drilling) вирішує Context API?

**Context API** дозволяє уникнути «prop drilling» — ситуації, коли один і той самий пропс потрібно передавати через багато проміжних компонентів, які самі його не використовують. Замість передачі `isAuthenticated`, `user`, `login`, `logout` через весь ланцюг компонентів, ми один раз огортаємо додаток у `AuthProvider`, а потрібні компоненти (`ProtectedRoute`, `Login`, `Header` тощо) отримують доступ до цих значень напряму через `useContext(AuthContext)`. Це спрощує структуру, робить код читабельнішим і зменшує зв’язність між рівнями компонентів.

### 2. Чому іноді обирають Redux/Zustand замість чистого Context API?

Context API добре підходить для невеликих або середніх додатків, але у складних застосунках виникають обмеження:

- **Грані продуктивності**: будь-яка зміна значення в `Provider` може перерендерювати всіх нащадків, які підписані на цей контекст. У великих дереві компонентів це може стати проблемою. Redux/Zustand використовують селектори та оптимізації, щоб мінімізувати кількість перерендерів.
- **Складні патерни стану**: Redux/Zustand пропонують зрозумілий односпрямований потік даних, middleware, DevTools, time-travel debug, нормалізацію стану тощо.
- **Модульність та масштабованість**: у великих командах централізований стор Redux/Zustand часто простіше організувати, розділити і підтримувати, ніж кілька різних контекстів.

У нашій лабораторній достатньо Context API, але для продукційного великого проєкту частіше обирають Redux/Zustand як більш потужний інструмент керування станом.

### 3. Яка роль патерна HOC при реалізації Protected Routes?

Патерн **Higher-Order Component (HOC)** в цьому контексті — це компонент-обгортка (`ProtectedRoute`), який інкапсулює перевірку доступу:

- Перевіряє `isAuthenticated` з контексту.
- Якщо користувач неавторизований — повертає `<Navigate />` (редірект).
- Якщо авторизований — рендерить дочірні елементи (`children` або `<Outlet />`).

Таким чином, логіка захисту маршруту зосереджена в одному місці і не дублюється у кожній сторінці. Будь-який маршрут можна зробити захищеним, просто обгорнувши його у `<Route element={<ProtectedRoute />}>...</Route>`, що відповідає концепції HOC — «компонент, який приймає компонент і повертає новий компонент із додатковою поведінкою».

### 4. Чому в `Navigate` використовується `replace: true`?

Властивість `replace: true` контролює, як запис про перенаправлення потрапляє в **історію браузера**:

- **Без `replace` (за замовчуванням)**: `Navigate` додає новий запис у стек історії. Якщо неавторизований користувач переходить на `/profile`, його редіректить на `/login`, але кнопка «Назад» поверне його знову на `/profile`, де його знову редіректить — виникає «петля».
- **З `replace: true`**: поточний запис (`/profile`) **замінюється** на `/login` у стеці історії. Кнопка «Назад» поверне користувача на сторінку, яка була до спроби зайти в профіль (наприклад, `/` або `/feed`), а не на заборонений маршрут.

Тобто `replace: true` робить поведінку історії логічною: спроба зайти на приватну сторінку не «залишається» в історії як окремий крок, а просто веде користувача на коректний маршрут (логоін), не створюючи плутанини при навігації «Назад».


