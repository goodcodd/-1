# Лабораторна робота №6
## Підключення до зовнішнього API. Використання JSONPlaceholder для синхронізації даних додатку

---

## Фрагменти коду

### 1. Кастомний хук useFetch.js

```jsx
import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController для скасування запиту,
    // якщо компонент розмонтовується (захист від витоку пам'яті)
    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url, { signal: abortController.signal });
        
        if (!response.ok) {
          throw new Error(`Помилка HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Запит скасовано');
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Функція очищення (cleanup)
    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, isLoading, error };
};
```

**Пояснення:**
- Хук інкапсулює логіку отримання даних з API
- Використовує `AbortController` для скасування запитів при розмонтуванні компонента
- Повертає тріаду станів: `data`, `isLoading`, `error`
- Автоматично обробляє помилки та стани завантаження

---

### 2. Компонент Feed.jsx з життєвим циклом запиту

```jsx
import { Link } from 'react-router-dom';
import Post from '../../components/molecules/Post/Post';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryFilter from '../../components/molecules/CategoryFilter/CategoryFilter';
import EmptyState from '../../components/molecules/EmptyState/EmptyState';
import { useFetch } from '../../hooks/useFetch';
import { useState, useMemo } from 'react';
import styles from './Feed.module.css';

const Feed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Викликаємо наш кастомний хук для отримання даних з API
  const {
    data: apiPosts,
    isLoading,
    error,
  } = useFetch('https://jsonplaceholder.typicode.com/posts');

  // Адаптація даних з API до формату, який очікує наш компонент
  const posts = useMemo(() => {
    if (!apiPosts) return [];

    const categoriesList = ['News', 'Updates', 'Tech', 'Education', 'General'];
    
    return apiPosts.map((post, index) => ({
      id: post.id,
      author: `User ${post.userId}`,
      avatar: `https://i.pravatar.cc/50?img=${post.userId}`,
      content: post.body,
      date: `${Math.floor(Math.random() * 24)} год тому`,
      likes: Math.floor(Math.random() * 50),
      category: categoriesList[index % categoriesList.length],
    }));
  }, [apiPosts]);

  // Отримуємо унікальні категорії з даних
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))];
    return ['All', ...uniqueCategories];
  }, [posts]);

  // Логіка фільтрації
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Фільтрація за пошуковим запитом
      const matchesSearch = 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фільтрація за категорією
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, activeCategory]);

  // 1. Стан завантаження
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Завантаження новин...</p>
        </div>
      </div>
    );
  }

  // 2. Стан помилки
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Сталася помилка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 3. Стан успішного завантаження
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Стрічка новин</h1>
      
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className={styles.resultsInfo}>
        {filteredPosts.length > 0 && (
          <p className={styles.count}>
            Знайдено постів: <strong>{filteredPosts.length}</strong>
          </p>
        )}
      </div>

      <div className={styles.feed}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/feed/${post.id}`}
              className={styles.postLink}
            >
              <Post
                author={post.author}
                content={post.content}
                date={post.date}
                avatar={post.avatar}
                initialLikes={post.likes}
              />
            </Link>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Feed;
```

**Ключові особливості:**
- Використовує хук `useFetch` для отримання даних
- Реалізує тріаду станів: `isLoading`, `error`, успішне завантаження
- Адаптує дані з API до формату компонента
- Зберігає функціональність пошуку та фільтрації

---

### 3. Оновлений AuthContext з асинхронним login

```jsx
import { createContext, useState } from 'react';

// Створення контексту
export const AuthContext = createContext();

// Компонент-провайдер
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email) => {
    try {
      // Симуляція мережевої затримки для показу лоадера на кнопці
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // "Стягуємо" дані фіктивного користувача з API
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users/1'
      );
      
      if (!response.ok) {
        throw new Error('Помилка отримання даних користувача');
      }
      
      const userData = await response.json();

      setIsAuthenticated(true);
      // Зберігаємо справжні дані з API у нашому стейті
      setUser({ ...userData, email });
    } catch (error) {
      console.error('Помилка авторизації:', error);
      throw error; // Прокидаємо помилку для обробки в компоненті
    }
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

---

### 4. Компонент Login з обробкою стану завантаження

```jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/atoms/Input/Input';
import Button from '../../components/atoms/Button/Button';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (email.trim()) {
      setIsLoading(true);
      try {
        // Викликаємо асинхронну функцію login
        await login(email.trim());
        // Перенаправлення в профіль після успішного входу
        navigate('/profile', { replace: true });
      } catch (err) {
        setError('Помилка авторизації. Спробуйте ще раз.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вхід в систему</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Завантаження...' : 'Увійти'}
        </Button>
      </form>
      <p className={styles.hint}>
        Для демонстрації достатньо ввести будь-який коректний email.
      </p>
    </div>
  );
};

export default Login;
```

---

## Відповіді на контрольні запитання

### 1. Поясніть призначення об'єкта AbortController у нашому хуку useFetch. Яку загрозу для React-додатку він усуває?

**AbortController** — це нативний Web API, який дозволяє скасовувати асинхронні операції (зокрема, fetch-запити). У контексті React-додатку він виконує критично важливу функцію запобігання **витокам пам'яті (memory leaks)** та **race conditions**.

**Загрози, які він усуває:**

1. **Витоки пам'яті (Memory Leaks):**
   - Коли компонент розмонтовується (unmount) під час виконання асинхронного запиту, React намагається оновити стан (`setData`, `setIsLoading`) у вже неіснуючому компоненті
   - Це призводить до попереджень React: "Can't perform a React state update on an unmounted component"
   - AbortController скасовує запит перед розмонтуванням, запобігаючи оновленню стану

2. **Race Conditions (Стан гонитви):**
   - Якщо користувач швидко перемикає між сторінками, кілька запитів можуть виконуватися одночасно
   - Без AbortController останній завершений запит може перезаписати дані від попереднього, що призводить до некоректного відображення
   - Скасування попередніх запитів гарантує, що відображаються лише актуальні дані

3. **Мережеві ресурси:**
   - Скасування непотрібних запитів економить пропускну здатність мережі та ресурси сервера

**Приклад проблеми без AbortController:**
```jsx
// ПРОБЛЕМА: Компонент розмонтується, але запит продовжує виконуватися
useEffect(() => {
  fetch('/api/posts').then(data => {
    setData(data); // Помилка: компонент вже розмонтовано!
  });
}, []);
```

**Рішення з AbortController:**
```jsx
// РІШЕННЯ: Запит скасовується при розмонтуванні
useEffect(() => {
  const abortController = new AbortController();
  fetch('/api/posts', { signal: abortController.signal })
    .then(data => setData(data));
  
  return () => abortController.abort(); // Cleanup
}, []);
```

---

### 2. Що таке патерн "Тріада станів" (loading, error, data) при роботі з мережею і чому він є обов'язковим для якісного UX?

**Тріада станів** — це патерн проектування, який визначає три можливі стани асинхронної операції:
1. **Loading** (`isLoading: true`) — дані завантажуються
2. **Error** (`error !== null`) — сталася помилка
3. **Success** (`data !== null && !isLoading && !error`) — дані успішно завантажені

**Чому це обов'язково для якісного UX:**

1. **Інформативність для користувача:**
   - **Loading**: Користувач бачить індикатор завантаження (спінер, скелетон), розуміє, що додаток працює, а не "завис"
   - **Error**: Користувач отримує зрозуміле повідомлення про помилку замість порожнього екрану або некоректних даних
   - **Success**: Користувач бачить актуальні дані

2. **Запобігання плутанині:**
   - Без стану Loading користувач може подумати, що додаток не працює
   - Без стану Error користувач не розуміє, чому дані не відображаються
   - Без явного стану Success можна показати дані до їх повного завантаження

3. **Доступність (Accessibility):**
   - Індикатори завантаження та помилок важливі для користувачів з обмеженими можливостями
   - Screen readers можуть оголошувати зміни станів

4. **Професійний вигляд:**
   - Додаток виглядає більш надійним та продуманим
   - Покращує загальне враження користувача

**Приклад реалізації:**
```jsx
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

---

### 3. Чому функція виконання мережевого запиту (fetch або axios.get) розміщується всередині хука useEffect, а не прямо в тілі функціонального компонента?

**Причини розміщення fetch в useEffect:**

1. **Життєвий цикл компонента:**
   - Функціональні компоненти виконуються при кожному рендері
   - Якщо fetch розміщений безпосередньо в тілі компонента, він виконуватиметься при **кожному рендері**, що призводить до:
     - Нескінченних циклів запитів
     - Надмірного навантаження на сервер
     - Втрати продуктивності

2. **Контрольований момент виконання:**
   - `useEffect` дозволяє визначити, коли саме виконувати запит:
     - При монтуванні компонента (`[]` — пустий масив залежностей)
     - При зміні певних значень (наприклад, `[url]`)
   - Це дає контроль над життєвим циклом запиту

3. **Cleanup функції:**
   - `useEffect` дозволяє повернути функцію очищення (cleanup), яка виконується при розмонтуванні
   - Це критично для скасування запитів через `AbortController`

4. **Уникнення побічних ефектів:**
   - Fetch-запити є **побічними ефектами** (side effects) — вони не пов'язані безпосередньо з рендерингом UI
   - React рекомендує виконувати побічні ефекти в `useEffect`, а не в тілі компонента

**Приклад проблеми без useEffect:**
```jsx
// ПРОБЛЕМА: Запит виконується при кожному рендері
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  fetch('/api/data')  // Виконується КОЖЕН РАЗ!
    .then(res => res.json())
    .then(data => setData(data)); // setData викликає рендер → fetch знову → нескінченний цикл!
  
  return <div>{data}</div>;
};
```

**Правильне рішення:**
```jsx
// РІШЕННЯ: Запит виконується лише при монтуванні
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []); // Виконується лише один раз
  
  return <div>{data}</div>;
};
```

---

### 4. У чому полягають головні переваги використання бібліотеки axios у порівнянні з нативним fetch (якщо студенти використовували її під час самостійної розробки)?

**Головні переваги axios над нативним fetch:**

1. **Автоматичне парсування JSON:**
   - **fetch**: Потрібно викликати `.json()` вручну
   - **axios**: Автоматично парсить JSON відповіді
   ```jsx
   // fetch
   fetch('/api/data').then(res => res.json()).then(data => ...);
   
   // axios
   axios.get('/api/data').then(res => res.data);
   ```

2. **Краща обробка помилок:**
   - **fetch**: Не відхиляє проміси для HTTP статусів 4xx/5xx (тільки для мережевих помилок)
   - **axios**: Автоматично відхиляє проміси для статусів >= 400
   ```jsx
   // fetch - потрібна перевірка вручну
   fetch('/api/data').then(res => {
     if (!res.ok) throw new Error('Error');
     return res.json();
   });
   
   // axios - автоматично
   axios.get('/api/data').catch(err => {
     // Автоматично обробляє 4xx/5xx
   });
   ```

3. **Interceptors (Перехоплювачі):**
   - Дозволяють додавати заголовки, токени, логування глобально
   ```jsx
   axios.interceptors.request.use(config => {
     config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```

4. **Спрощена робота з параметрами:**
   - **fetch**: Потрібно вручну формувати URL з query-параметрами
   - **axios**: Підтримує параметри як об'єкт
   ```jsx
   // fetch
   fetch(`/api/data?page=${page}&limit=${limit}`);
   
   // axios
   axios.get('/api/data', { params: { page, limit } });
   ```

5. **Підтримка завантаження файлів:**
   - Вбудована підтримка `FormData` та відстеження прогресу
   ```jsx
   axios.post('/upload', formData, {
     onUploadProgress: (progressEvent) => {
       const percent = (progressEvent.loaded / progressEvent.total) * 100;
     }
   });
   ```

6. **Спрощена робота з POST/PUT/DELETE:**
   - **fetch**: Потрібно вказувати метод, заголовки, body вручну
   - **axios**: Методи як окремі функції
   ```jsx
   // fetch
   fetch('/api/data', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
   });
   
   // axios
   axios.post('/api/data', data);
   ```

7. **Краща підтримка TypeScript:**
   - Більш детальна типізація для TypeScript проектів

**Недоліки axios:**
- Додаткова залежність (збільшує розмір bundle)
- fetch є нативним API, не потребує встановлення

**Висновок:** Axios спрощує роботу з HTTP-запитами та покращує читабельність коду, але для простих проектів fetch може бути достатнім.

---

### 5. Опишіть потенційні ризики багу "Стан гонитви" (Race Condition), якщо користувач буде дуже швидко перемикати сторінки з різними URL-параметрами, за якими робляться запити.

**Race Condition (Стан гонитви)** — це ситуація, коли результат операції залежить від послідовності виконання асинхронних операцій, які можуть завершуватися в неправильному порядку.

**Сценарій проблеми:**

1. Користувач відкриває сторінку `/feed/1` → починається запит `GET /api/posts/1`
2. Користувач швидко переходить на `/feed/2` → починається запит `GET /api/posts/2`
3. Запит для `/feed/2` завершується **раніше**, ніж запит для `/feed/1`
4. Компонент оновлює стан даними від `/feed/2`
5. Запит для `/feed/1` завершується **пізніше** і **перезаписує** дані від `/feed/2`
6. **Результат**: Користувач бачить дані поста #1, хоча знаходиться на сторінці поста #2

**Ризики та наслідки:**

1. **Некоректне відображення даних:**
   - Користувач бачить дані, які не відповідають поточному URL
   - Плутанина та погіршення UX

2. **Втрата продуктивності:**
   - Виконуються непотрібні запити
   - Надмірне навантаження на сервер

3. **Помилки в логіці:**
   - Якщо дані використовуються для подальших операцій (наприклад, коментарі), можуть виникнути невідповідності

4. **Витоки пам'яті:**
   - Старі запити продовжують виконуватися навіть після переходу на іншу сторінку

**Рішення проблеми:**

1. **Використання AbortController (як у нашому useFetch):**
   ```jsx
   useEffect(() => {
     const abortController = new AbortController();
     fetch(`/api/posts/${postId}`, { signal: abortController.signal })
       .then(data => setData(data));
     
     return () => abortController.abort(); // Скасовує попередній запит
   }, [postId]);
   ```

2. **Перевірка актуальності запиту:**
   ```jsx
   useEffect(() => {
     let isCancelled = false;
     
     fetch(`/api/posts/${postId}`)
       .then(res => res.json())
       .then(data => {
         if (!isCancelled) setData(data); // Оновлюємо лише якщо запит актуальний
       });
     
     return () => { isCancelled = true; };
   }, [postId]);
   ```

3. **Використання бібліотек для керування запитами:**
   - React Query / TanStack Query автоматично обробляє race conditions
   - SWR також має вбудований захист

**Приклад проблеми:**
```jsx
// ПРОБЛЕМА: Race condition
const PostPage = ({ postId }) => {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data)); // Може оновитися некоректними даними
  }, [postId]);
  
  return <div>{post?.title}</div>;
};
```

**Правильне рішення:**
```jsx
// РІШЕННЯ: AbortController скасовує попередні запити
const PostPage = ({ postId }) => {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    fetch(`/api/posts/${postId}`, { signal: abortController.signal })
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    
    return () => abortController.abort(); // Скасовує при зміні postId
  }, [postId]);
  
  return <div>{post?.title}</div>;
};
```

**Висновок:** Race conditions є серйозною проблемою в асинхронних додатках. Використання `AbortController` або інших механізмів скасування запитів є обов'язковим для забезпечення коректної роботи додатку.

---

## Висновки

У ході виконання лабораторної роботи було:
- Створено кастомний хук `useFetch` для інкапсуляції логіки роботи з API
- Реалізовано тріаду станів (Loading, Error, Data) для покращення UX
- Інтегровано JSONPlaceholder API замість захардкоджених даних
- Оновлено систему автентифікації для роботи з асинхронними запитами
- Забезпечено захист від витоку пам'яті та race conditions через AbortController

Додаток тепер працює з реальними даними з API та коректно обробляє всі стани асинхронних операцій.

