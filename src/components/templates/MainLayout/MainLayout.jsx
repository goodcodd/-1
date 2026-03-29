import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';
import useOnlineStatus from '../../../hooks/useOnlineStatus';
import { useCartStore, selectTotalItems } from '../../../store/useStore';

const MainLayout = () => {
  const getActiveClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const isOnline = useOnlineStatus();
  const cartTotalItems = useCartStore(selectTotalItems);

  return (
    <div className={styles.wrapper}>
      {!isOnline && (
        <div
          style={{
            background: 'red',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            position: 'sticky',
            top: 0,
            zIndex: 9999,
          }}
        >
          ⚠️ Відсутнє підключення до Інтернету. Деякі функції можуть бути
          недоступні.
        </div>
      )}

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
            <NavLink to="/performance" className={getActiveClass}>
              Продуктивність
            </NavLink>
            <NavLink to="/product" className={getActiveClass}>
              Товар
              {cartTotalItems > 0 && (
                <span className={styles.cartBadge} aria-label={`Товарів у кошику: ${cartTotalItems}`}>
                  {cartTotalItems > 99 ? '99+' : cartTotalItems}
                </span>
              )}
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



