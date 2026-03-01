import { Routes, Route } from 'react-router-dom';
import Navigation from './components/organisms/Navigation/Navigation';
import PostsPage from './components/pages/PostsPage/PostsPage';
import ArrayMethodsPage from './components/pages/ArrayMethodsPage/ArrayMethodsPage';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <Navigation />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<ArrayMethodsPage />} />
          <Route path="/array-methods" element={<ArrayMethodsPage />} />
          <Route path="/posts" element={<PostsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
