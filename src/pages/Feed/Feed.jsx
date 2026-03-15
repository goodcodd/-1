import { Link, useSearchParams } from 'react-router-dom';
import Post from '../../components/molecules/Post/Post';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryFilter from '../../components/molecules/CategoryFilter/CategoryFilter';
import EmptyState from '../../components/molecules/EmptyState/EmptyState';
import { useFetch } from '../../hooks/useFetch';
import { useMemo } from 'react';
import styles from './Feed.module.css';

const Feed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const sortOrder = searchParams.get('sort') || 'asc';

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'All' || (key === 'sort' && value === 'asc')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (text) => setParam('query', text);
  const handleCategoryChange = (category) => setParam('category', category);
  const handleSortChange = (e) => setParam('sort', e.target.value);

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
      title: post.title,
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

  // 1) Фільтрація за пошуком і категорією; 2) сортування за назвою поста
  const filteredPosts = useMemo(() => {
    const filtered = posts.filter(post => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    const sorted = [...filtered].sort((a, b) => {
      const titleA = (a.title || a.content || '').toLowerCase();
      const titleB = (b.title || b.content || '').toLowerCase();
      if (sortOrder === 'desc') return titleB.localeCompare(titleA);
      return titleA.localeCompare(titleB);
    });
    return sorted;
  }, [posts, searchQuery, activeCategory, sortOrder]);

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
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className={styles.sortRow}>
        <label htmlFor="feed-sort" className={styles.sortLabel}>Сортування:</label>
        <select
          id="feed-sort"
          value={sortOrder}
          onChange={handleSortChange}
          className={styles.sortSelect}
        >
          <option value="asc">Від А до Я</option>
          <option value="desc">Від Я до А</option>
        </select>
      </div>

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
          <EmptyState
            message={
              searchQuery
                ? `За вашим запитом «${searchQuery}» нічого не знайдено.`
                : 'Нічого не знайдено за вашим запитом.'
            }
          />
        )}
      </div>
    </div>
  );
};

export default Feed;



