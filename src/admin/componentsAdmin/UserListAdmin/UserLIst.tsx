import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './userList.module.css';

interface User {
  id: number;
  username: string;
  email: string;
  isBlocked: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem('accessToken'); // Получаем токен из localStorage

  useEffect(() => {
    if (!accessToken) {
      // Если токен отсутствует, перенаправляем на страницу логина
      window.location.href = '/login'; // Можно заменить на другой путь в зависимости от вашего приложения
      return;
    }

    // Функция для получения списка пользователей
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data); // Предполагаем, что список пользователей приходит в response.data
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла ошибка при загрузке пользователей');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken]);

  // Функция для блокировки пользователя
  const blockUser = async (userId: number) => {
    try {
      await axios.post(
        `/api/users/${userId}/block`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Обновляем состояние пользователей после успешной блокировки
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: true } : user
        )
      );
    } catch (error) {
      setError('Не удалось заблокировать пользователя');
    }
  };

  // Функция для разблокировки пользователя
  const unblockUser = async (userId: number) => {
    try {
      await axios.post(
        `/api/users/${userId}/unblock`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Обновляем состояние пользователей после успешной разблокировки
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: false } : user
        )
      );
    } catch (error) {
      setError('Не удалось разблокировать пользователя');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.userList}>
      <h2>Список пользователей</h2>
      <ul className={styles.userGrid}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            {/* <p><strong>Имя пользователя:</strong> {user.username}</p> */}
            <span className={styles.userInfo}>
              <strong>{user.username}</strong>
            </span>
            {/* <p><strong>Email:</strong> {user.email}</p> */}
            <span className={styles.userInfo}>{user.email}</span>
            {/* <p><strong>Статус:</strong> {user.isBlocked ? 'Заблокирован' : 'Активен'}</p> */}
            <span className={styles.userStatus}>
              {user.isBlocked ? 'Заблокирован' : 'Активен'}
            </span>
            {/* <div className={styles.buttonGroup}>
              {user.isBlocked ? (
                <button onClick={() => unblockUser(user.id)}>Разблокировать</button>
              ) : (
                <button onClick={() => blockUser(user.id)}>Заблокировать</button>
              )}
            </div> */}
            <span className={styles.actionButton}>
              {user.isBlocked ? (
                <button onClick={() => unblockUser(user.id)} className={styles.unblockButton}>Разблокировать</button>
              ) : (
                <button onClick={() => blockUser(user.id)} className={styles.blockButton}>Заблокировать</button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
