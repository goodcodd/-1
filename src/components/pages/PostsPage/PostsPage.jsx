import Post from '../../molecules/Post/Post';
import { postsData } from '../../../data';
import styles from './PostsPage.module.css';

const PostsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Стрічка новин</h1>
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
};

export default PostsPage;

