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



