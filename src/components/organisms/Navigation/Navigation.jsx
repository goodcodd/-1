import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <NavLink to="/" className={styles.logo}>
          React Lab
        </NavLink>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/array-methods"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Методи масивів
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Стрічка новин
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
