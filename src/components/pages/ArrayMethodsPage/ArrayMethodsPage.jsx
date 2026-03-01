import { useState, useMemo } from 'react';
import { studentsData as initialStudentsData } from '../../../studentsData';
import AddStudentForm from '../../molecules/AddStudentForm/AddStudentForm';
import styles from './ArrayMethodsPage.module.css';

const ArrayMethodsPage = () => {
  // Стан для списку студентів (починаємо з початкових даних)
  const [students, setStudents] = useState(initialStudentsData);

  // Функція для додавання нового студента
  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  // 1. Рендеринг списку через .map()
  const allStudents = students;

  // 2. Фільтрація даних через .filter()
  const activeStudents = students.filter(
    student => student.isActive && student.score > 60
  );

  // 3. Агрегація даних через .reduce()
  const averageScore = activeStudents.length > 0
    ? activeStudents.reduce((sum, student) => sum + student.score, 0) / activeStudents.length
    : 0;

  // 4. Сортування через .sort() (від найбільшого до найменшого)
  const [sortOrder, setSortOrder] = useState('desc');
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });
  }, [students, sortOrder]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Лабораторна робота: Методи масивів у React</h1>

      {/* Форма додавання студента */}
      <section className={styles.section}>
        <AddStudentForm onAddStudent={handleAddStudent} />
      </section>

      {/* Розділ 1: Рендеринг списку через .map() */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Всі студенти (Array.map)</h2>
        <ul className={styles.studentList}>
          {allStudents.map((student) => (
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
            </li>
          ))}
        </ul>
        <p className={styles.info}>
          Всього студентів: {allStudents.length}
        </p>
      </section>

      {/* Розділ 2: Фільтрація даних через .filter() */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Активні студенти з балом вище 60 (Array.filter)
        </h2>
        <ul className={styles.studentList}>
          {activeStudents.map((student) => (
            <li key={student.id} className={styles.studentItem}>
              <span className={styles.studentName}>{student.name}</span>
              <span className={styles.studentScore}>Бал: {student.score}</span>
            </li>
          ))}
        </ul>
        <p className={styles.info}>
          Знайдено: {activeStudents.length} студентів
        </p>
      </section>

      {/* Розділ 3: Агрегація даних через .reduce() */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          3. Середній бал активних студентів (Array.reduce)
        </h2>
        <div className={styles.averageScore}>
          <span className={styles.averageLabel}>Середній бал:</span>
          <span className={styles.averageValue}>
            {averageScore.toFixed(2)}
          </span>
        </div>
        <p className={styles.info}>
          Розраховано на основі {activeStudents.length} активних студентів
        </p>
      </section>

      {/* Розділ 4: Сортування через .sort() */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          4. Сортування студентів (Array.sort)
        </h2>
        <div className={styles.sortControls}>
          <button
            onClick={() => setSortOrder('desc')}
            className={`${styles.sortButton} ${sortOrder === 'desc' ? styles.active : ''}`}
          >
            За спаданням (↓)
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`${styles.sortButton} ${sortOrder === 'asc' ? styles.active : ''}`}
          >
            За зростанням (↑)
          </button>
        </div>
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
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ArrayMethodsPage;
