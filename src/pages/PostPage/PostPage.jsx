import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useMemo } from 'react';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Отримуємо дані поста з API
  const {
    data: apiPost,
    isLoading,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

  // Адаптація даних з API до формату, який очікує компонент
  const post = useMemo(() => {
    if (!apiPost) return null;

    const categoriesList = ['News', 'Updates', 'Tech', 'Education', 'General'];
    const categoryIndex = (apiPost.id - 1) % categoriesList.length;

    return {
      id: apiPost.id,
      author: `User ${apiPost.userId}`,
      avatar: `https://i.pravatar.cc/50?img=${apiPost.userId}`,
      content: apiPost.body,
      date: `${Math.floor(Math.random() * 24)} год тому`,
      likes: Math.floor(Math.random() * 50),
      category: categoriesList[categoryIndex],
      title: apiPost.title,
    };
  }, [apiPost]);

  // Стан завантаження
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Завантаження поста...</p>
        </div>
      </div>
    );
  }

  // Стан помилки
  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Пост не знайдено</h2>
          <p>{error || `Пост з ID ${postId} не існує.`}</p>
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
          <h1 className={styles.postTitle}>{post.title || post.content.split('.')[0]}</h1>
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

