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



