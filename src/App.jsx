import Post from './components/molecules/Post/Post';
import { postsData } from './data';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Стрічка новин</h1>
      <div className={styles.feed}>
        {postsData.map((post) => (
          <Post
            key={post.id}
            author={post.author}
            content={post.content}
            date={post.date}
            avatar={post.avatar}
            initialLikes={post.likes}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
