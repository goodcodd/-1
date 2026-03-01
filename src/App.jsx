import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Feed from './pages/Feed/Feed';
import PostPage from './pages/PostPage/PostPage';
import Profile from './pages/Profile/Profile';
import ProfileOverview from './pages/Profile/ProfileOverview';
import ProfileSettings from './pages/Profile/ProfileSettings';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="feed" element={<Feed />} />
        <Route path="feed/:postId" element={<PostPage />} />
        <Route path="profile/*" element={<Profile />}>
          <Route index element={<ProfileOverview />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
