import { useState, useMemo, useCallback } from 'react';
import DemoListItem from '../../components/molecules/DemoListItem/DemoListItem';
import styles from './PerformanceDemo.module.css';

/**
 * Штучно «важка» функція (кількість ітерацій можна зменшити, якщо зависає вкладка).
 * У методичці — ~100–300 ms на виклик; тут підібрано під типовий ПК.
 */
const HEAVY_ITERATIONS = 50_000_000;

const generateHeavyAnalytics = (num) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Запуск важких обчислень (generateHeavyAnalytics)...');
  }
  let result = 0;
  for (let i = 0; i < HEAVY_ITERATIONS; i++) {
    result += num;
  }
  return result;
};

const DEMO_POSTS = [
  { id: 1, title: 'Пост A' },
  { id: 2, title: 'Пост B' },
  { id: 3, title: 'Пост C' },
  { id: 4, title: 'Пост D' },
  { id: 5, title: 'Пост E' },
];

const PerformanceDemo = () => {
  // --- 1) Важкі обчислення + інпут (useMemo) ---
  const [searchHeavy, setSearchHeavy] = useState('');
  const [analyticsNumber, setAnalyticsNumber] = useState(1);
  const [useMemoForAnalytics, setUseMemoForAnalytics] = useState(false);

  const memoizedAnalytics = useMemo(
    () => generateHeavyAnalytics(analyticsNumber),
    [analyticsNumber]
  );

  // Без useMemo: важка функція на кожному рендері (у т.ч. при кожному символі в пошуку).
  // З useMemo: показуємо лише кеш за [analyticsNumber] — введення в інпут не перераховує цикл.
  const analyticsResult = useMemoForAnalytics
    ? memoizedAnalytics
    : generateHeavyAnalytics(analyticsNumber);

  // --- 2) Список + React.memo + useCallback ---
  const [searchList, setSearchList] = useState('');
  const [useStableLikeHandler, setUseStableLikeHandler] = useState(true);

  const handleLikeStable = useCallback((id) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Liked (useCallback)', id);
    }
  }, []);

  const handleLikeUnstable = (id) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Liked (нова функція кожен рендер)', id);
    }
  };

  const onLike = useStableLikeHandler ? handleLikeStable : handleLikeUnstable;

  // --- 3) 10 000 елементів: без useMemo vs з useMemo для масиву ---
  const [search10k, setSearch10k] = useState('');
  const [memoize10kArray, setMemoize10kArray] = useState(false);

  const items10kBroken = Array.from({ length: 10000 }, (_, i) => i);
  const items10kMemo = useMemo(
    () => Array.from({ length: 10000 }, (_, i) => i),
    []
  );
  const items10k = memoize10kArray ? items10kMemo : items10kBroken;

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Важкі обчислення та useMemo</h2>
        <p className={styles.hint}>
          Якщо <strong>не</strong> використовувати <code>useMemo</code>, то при кожному
          символі в полі пошуку знову виконується важкий цикл. Увімкніть оптимізацію —
          введення тексту має стати плавним; час рендеру в React DevTools суттєво зменшиться.
        </p>
        <div className={styles.row}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={useMemoForAnalytics}
              onChange={(e) => setUseMemoForAnalytics(e.target.checked)}
            />
            Увімкнути useMemo для аналітики (залежність: [analyticsNumber])
          </label>
          <span
            className={`${styles.badge} ${
              useMemoForAnalytics ? styles.badgeGood : styles.badgeBad
            }`}
          >
            {useMemoForAnalytics ? 'Оптимізовано' : 'Повільно при кожному вводі'}
          </span>
        </div>
        <div className={styles.row}>
          <label htmlFor="analytics-num" style={{ fontSize: 14 }}>
            Число для аналітики:
          </label>
          <input
            id="analytics-num"
            type="number"
            min={1}
            max={10}
            value={analyticsNumber}
            onChange={(e) =>
              setAnalyticsNumber(Number(e.target.value) || 1)
            }
            style={{ width: 80, padding: 8 }}
          />
        </div>
        <p className={styles.result}>
          Результат аналітики: <strong>{analyticsResult}</strong>
        </p>
        <input
          className={styles.input}
          placeholder="Пошук (друкуйте — і дивіться лаг без useMemo)..."
          value={searchHeavy}
          onChange={(e) => setSearchHeavy(e.target.value)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Список: React.memo + useCallback</h2>
        <p className={styles.hint}>
          <code>DemoListItem</code> обгорнутий у <code>memo</code>. Якщо батько передає
          нову функцію <code>onLike</code> на кожен рендер, діти все одно перемальовуються.
          Увімкніть стабільний обробник через <code>useCallback</code> — у React DevTools рядки
          отримають «Did not render» при введенні тексту.
        </p>
        <div className={styles.row}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={useStableLikeHandler}
              onChange={(e) => setUseStableLikeHandler(e.target.checked)}
            />
            useCallback для onLike (стабільне посилання)
          </label>
        </div>
        <input
          className={styles.input}
          placeholder="Введіть текст — список не повинен оновлюватися зайво (з useCallback)..."
          value={searchList}
          onChange={(e) => setSearchList(e.target.value)}
        />
        <div style={{ marginTop: 16 }}>
          {DEMO_POSTS.map((post) => (
            <DemoListItem
              key={post.id}
              id={post.id}
              title={post.title}
              onLike={onLike}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 10 000 елементів у DOM</h2>
        <p className={styles.hint}>
          Без <code>useMemo</code> масив з 10 000 індексів створюється заново на кожному
          рендері (наприклад, при введенні символу). З <code>useMemo</code> посилання
          стабільне — менше роботи при оновленні батька. Порівняйте FPS / час у React DevTools.
        </p>
        <div className={styles.row}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={memoize10kArray}
              onChange={(e) => setMemoize10kArray(e.target.checked)}
            />
            useMemo для масиву з 10 000 елементів
          </label>
        </div>
        <input
          className={styles.input}
          placeholder="Друкуйте тут, щоб викликати ре-рендер батька..."
          value={search10k}
          onChange={(e) => setSearch10k(e.target.value)}
        />
        <div className={styles.grid10k} aria-hidden>
          {items10k.map((i) => (
            <div key={i} className={styles.cell} title={String(i)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PerformanceDemo;
