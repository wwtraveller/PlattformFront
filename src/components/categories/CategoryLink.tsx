import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../categories/categoryLink.module.css'

const CategoryLinks: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        const data = response.data;
        console.log('Категории из API:', data);
        
        if (Array.isArray(data) && data.every(item => typeof item === 'object' && 'name' in item)) {
          setCategories(data.map((item: { name: string }) => item.name));
        } else {
          console.error('Некорректный формат данных категорий:', data);
          setError('Некорректный формат данных категорий.');
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        setError('Ошибка при получении категорий.');
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.div}>
      <h2 className={styles.h2}>Категории</h2>
      {categories.length > 0 ? (
        <ul className={styles.ul}>
          {categories.map(category => (
            <li className={styles.li} key={category}>
              <Link className={styles.a} to={`/category/${encodeURIComponent(category)}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Загрузка категорий...</p>
      )}
    </div>
  );
};

export default CategoryLinks;
