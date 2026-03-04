import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const getActiveClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.logo} end>
            React Lab
          </NavLink>
          <div className={styles.navLinks}>
            <NavLink to="/" className={getActiveClass} end>
              Головна
            </NavLink>
            <NavLink to="/feed" className={getActiveClass}>
              Стрічка
            </NavLink>
            <NavLink to="/profile" className={getActiveClass}>
              Профіль
            </NavLink>
          </div>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;


