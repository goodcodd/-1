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

