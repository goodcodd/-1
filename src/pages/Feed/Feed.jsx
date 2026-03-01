import { Link } from 'react-router-dom';
import Post from '../../components/molecules/Post/Post';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryFilter from '../../components/molecules/CategoryFilter/CategoryFilter';
import EmptyState from '../../components/molecules/EmptyState/EmptyState';
import { postsData } from '../../data';
import { useState, useMemo } from 'react';
import styles from './Feed.module.css';

const Feed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Отримуємо унікальні категорії з даних
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(postsData.map(post => post.category))];
    return ['All', ...uniqueCategories];
  }, []);

  // Логіка фільтрації
  const filteredPosts = useMemo(() => {
    return postsData.filter(post => {
      // Фільтрація за пошуковим запитом
      const matchesSearch = 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фільтрація за категорією
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

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

