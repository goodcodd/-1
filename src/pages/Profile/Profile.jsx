import { NavLink, Outlet } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const getActiveClass = ({ isActive }) =>
    isActive ? `${styles.sidebarLink} ${styles.active}` : styles.sidebarLink;

  return (
    <div className={styles.profileLayout}>
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Мій акаунт</h3>
        <nav className={styles.sidebarNav}>
          <NavLink to="" className={getActiveClass} end>
            Інформація
          </NavLink>
          <NavLink to="settings" className={getActiveClass}>
            Налаштування
          </NavLink>
        </nav>
      </aside>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;

