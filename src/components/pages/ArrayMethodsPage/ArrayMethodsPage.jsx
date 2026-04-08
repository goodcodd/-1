import { useState, useMemo } from 'react';
import { studentsData as initialStudentsData } from '../../../studentsData';
import AddStudentForm from '../../molecules/AddStudentForm/AddStudentForm';
import styles from './ArrayMethodsPage.module.css';

const ArrayMethodsPage = () => {
  // Стан для списку студентів (починаємо з початкових даних)
  const [students, setStudents] = useState(initialStudentsData);

  // ===== Лабораторна: умовне відображення =====
  // 1) Просте умовне відображення через &&
  const [showHelp, setShowHelp] = useState(false);

  // 2) Тернарний оператор (toggle фільтра)
  const [filterActive, setFilterActive] = useState(false);

  // 3) Таби (більше ніж 2 стани)
  const [activeTab, setActiveTab] = useState('list'); // default

  // Функція для додавання нового студента
  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const allStudents = students;

  const filteredStudents = useMemo(() => {
    return students.filter((student) => student.score >= 60);
  }, [students]);

  const studentsToRender = filterActive ? filteredStudents : allStudents;

  const successfulCount = useMemo(() => {
    return students.filter((s) => s.score >= 60).length;
  }, [students]);

  const failedCount = useMemo(() => {
    return students.filter((s) => s.score < 60).length;
  }, [students]);

  // Середній бал серед "успішних" (score >= 60)
  const averageScore = filteredStudents.length > 0
    ? filteredStudents.reduce((sum, student) => sum + student.score, 0) / filteredStudents.length
    : 0;

  const [sortOrder, setSortOrder] = useState('desc');
  const sortedStudents = useMemo(() => {
    return [...studentsToRender].sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });
  }, [studentsToRender, sortOrder]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Логіка умовного відображення</h1>

      <section className={styles.section}>
        <div className={styles.topControls}>
          <button
            className={styles.controlButton}
            onClick={() => setShowHelp(!showHelp)}
          >
            {showHelp ? 'Приховати інструкцію' : 'Показати інструкцію'}
          </button>

          <button
            className={styles.controlButton}
            onClick={() => setFilterActive(!filterActive)}
          >
            {filterActive ? 'Показати всіх' : 'Показати тільки успішних'}
          </button>
        </div>

        {showHelp && (
          <p className={styles.helpText}>
            Довідка: Дозволяє керувати списками студентів та перемикати режими
            відображення (&&, тернарний оператор, таби).
          </p>
        )}

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Всі студенти
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'stats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Статистика
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'about' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Про автора
          </button>
        </div>
      </section>

      <div className={styles.content}>
        {activeTab === 'list' && (
          <>
            {/* Форма додавання студента */}
            <section className={styles.section}>
              <AddStudentForm onAddStudent={handleAddStudent} />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Список студентів</h2>
              <ul className={styles.studentList}>
                {sortedStudents.map((student) => (
                  <li
                    key={student.id}
                    className={styles.studentItem}
                    style={{
                      color: student.isActive ? '#333' : '#999',
                      textDecoration: student.isActive ? 'none' : 'line-through'
                    }}
                  >
                    <span className={styles.studentName}>{student.name}</span>
                    <span className={styles.studentScore}>Бал: {student.score}</span>
                    <span className={styles.studentStatus}>
                      {student.isActive ? '✓ Активний' : '✗ Неактивний'}
                    </span>
                    <span className={styles.passFail}>
                      <span style={{ color: student.score >= 60 ? 'green' : 'red' }}>
                        {student.score >= 60 ? 'Зараховано' : 'Незараховано'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.info}>
                Показано: {studentsToRender.length} / Всього: {allStudents.length}
              </p>
            </section>
          </>
        )}

        {activeTab === 'stats' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Статистика</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Всього студентів</div>
                <div className={styles.statValue}>{allStudents.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Успішні (≥ 60)</div>
                <div className={styles.statValue}>{successfulCount}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Неуспішні (&lt; 60)</div>
                <div className={styles.statValue}>{failedCount}</div>
              </div>
            </div>

            <div className={styles.averageScore}>
              <span className={styles.averageLabel}>Середній бал успішних:</span>
              <span className={styles.averageValue}>{averageScore.toFixed(2)}</span>
            </div>
            <p className={styles.info}>
              Розраховано на основі {filteredStudents.length} студентів з балом ≥ 60
            </p>
          </section>
        )}

        {activeTab === 'about' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Про автора</h2>
            <p className={styles.aboutText}>
              Цей розділ демонструє таби та умовний рендеринг у React. Заповніть
              інформацію про автора під ваші дані (ПІБ, група, курс).
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArrayMethodsPage;
