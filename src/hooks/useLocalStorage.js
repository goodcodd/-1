import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) return initialValue;
      return JSON.parse(storedValue);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Якщо localStorage недоступний або переповнений — просто не зберігаємо.
    }
  }, [key, value]);

  // Додатково зберігаємо синхронно при оновленні state,
  // щоб при швидкій навігації (unmount) localStorage все одно встиг оновитись.
  const setValueAndStore = (nextValue) => {
    setValue((prev) => {
      const resolvedValue =
        typeof nextValue === 'function' ? nextValue(prev) : nextValue;

      try {
        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      } catch {
        // ігноруємо помилки localStorage
      }

      return resolvedValue;
    });
  };

  return [value, setValueAndStore];
};

export default useLocalStorage;

