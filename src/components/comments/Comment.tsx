import axios from 'axios';
import Button from 'components/button/Button';
import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../comments/coment.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

// Интерфейсы для комментариев
interface CommentProps {
  comment: {
    id: number;
    author: string;
    text: string;
    date: string;
    likes?: number;
    dislikes?: number;
    replies?: CommentProps['comment'][];
  };
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onReply: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

const Comment = ({ comment, onReply, onEdit, onDelete, onLike, onDislike }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [currentTime, setCurrentTime] = useState(new Date());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Устанавливаем интервал для обновления времени каждую минуту
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 мс = 1 минута

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleEditSubmit = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };
  const isShortComment = comment.text ? comment.text.length < 50 : false;

  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '08.10.2024 14:35'; 
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата'; 
    return formatDistanceToNow(date, { addSuffix: true });

  };

  return (
    <div className={`${styles.comment} ${isShortComment ? styles.shortComment : ''}`}>
      <div className={styles.commentHeader}>
        <p><strong>{comment.author}</strong> - {formatDate(comment.date)}</p>
      </div>
      {!isEditing ? (
        <p>{comment.text}</p>
      ) : (
        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
      )}
      <div className={styles.commentActions}>
        <button onClick={() => onLike(comment.id)}>
          <i className="bi bi-hand-thumbs-up"></i> {comment.likes || 0}
        </button>
        <button onClick={() => onDislike(comment.id)}>
          <i className="bi bi-hand-thumbs-down"></i> {comment.dislikes || 0}
        </button>
        <button onClick={() => onReply(comment.id)}>
          <i className="bi bi-reply"></i>
        </button>
        <div className={styles.moreOptions} onClick={() => setIsEditing(true)}>
          <i className="bi bi-pencil"></i>
        </div>

        {isEditing && (
          <div>
            <button onClick={handleEditSubmit}>
              <i className="bi bi-save"></i> Сохранить
            </button>
            <button onClick={() => onDelete(comment.id)}>
              <i className="bi bi-trash"></i> Удалить
            </button>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.map(reply => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          onLike={onLike} 
          onDislike={onDislike}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Компонент для отображения списка комментариев
interface CommentsProps {
  article_id: number;
  currentUserId: string;
}

interface CommentData {
  id: number;
  author: string;
  text: string;
  date: string;
  likes?: number;
  dislikes?: number;
  replies?: CommentData[];
}

const Comments = ({ article_id }: CommentsProps) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Получение userId из глобального состояния Redux
  const currentUser = useSelector((state: RootState) => state.auth.user); // Здесь user — это слайс аутентификации
  const currentUserId = currentUser?.id;

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Отсутствует токен авторизации');
      }

      const response = await axios.get(`/api/articles/${article_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const transformedComments = response.data.comments.map((comment: any) => ({
        id: comment.id,
        author: comment.author,
        text: comment.text,
        date: comment.date,
        likes: comment.likes,
        dislikes: comment.dislikes,
        replies: comment.replies,
      }));

      // Новый код: добавление сохраненных лайков и дизлайков
      const storedLikes = localStorage.getItem('commentLikes');
      const storedDislikes = localStorage.getItem('commentDislikes');
      const likes = storedLikes ? JSON.parse(storedLikes) : {};
      const dislikes = storedDislikes ? JSON.parse(storedDislikes) : {};

      const updatedComments = transformedComments.map((comment: CommentData) => ({
        ...comment,
        likes: comment.likes + (likes[comment.id] || 0),
        dislikes: comment.dislikes + (dislikes[comment.id] || 0),
      }));
      

      setComments(updatedComments);
    } catch (error) {
      console.error("Ошибка при загрузке комментариев:", error);
      setError("Ошибка при загрузке комментариев.");
    }
  };

  const handleAddComment = () => {
    // Проверка на авторизацию пользователя
    if (!currentUserId || currentUserId === 0) {
      alert('Пользователь не аутентифицирован');
      return;
    }

    // Получение токена из localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    // Данные комментария
    const commentData = {
      text: newComment,
      user_id: currentUserId,
      article_id: article_id,
    };

    // Вывод данных комментария в консоль для проверки
    console.log(commentData);

    // Отправка запроса на сервер
    fetch(`/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Добавляем токен авторизации в заголовки
      },
      body: JSON.stringify(commentData), // Преобразуем данные в JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then(newComment => {
        // Преобразование и добавление нового комментария в состояние
        const transformedComment = {
          id: newComment.id,
          author: newComment.author,
          text: newComment.text,
          date: newComment.date,
          likes: newComment.likes,
          dislikes: newComment.dislikes,
        };

        // Обновляем список комментариев
        setComments([...comments, transformedComment]);
        setNewComment(''); // Очищаем текстовое поле после добавления комментария
      })
      .catch(error => {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий. Проверьте сервер или маршрут.');
      });
  };

  const handleDeleteComment = (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setComments(comments.filter(c => c.id !== commentId));
      })
      .catch(error => console.error('Ошибка при удалении комментария:', error));
  };

  const handleEditComment = (commentId: number, newText: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newText }),
    })
      .then(response => response.json())
      .then(updatedComment => {
        const transformedComment = {
          id: updatedComment.id,
          author: updatedComment.author,
          text: updatedComment.text,
          date: updatedComment.date,
          likes: updatedComment.likes,
          dislikes: updatedComment.dislikes,
        };

        setComments(comments.map(c => c.id === commentId ? transformedComment : c));
      })
      .catch(error => console.error('Ошибка при редактировании комментария:', error));
  };

  const handleLikeComment = (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    // Новый код: обновление localStorage
    const storedLikes = localStorage.getItem('commentLikes');
    const likes = storedLikes ? JSON.parse(storedLikes) : {};
    likes[commentId] = (likes[commentId] || 0) + 1;
    localStorage.setItem('commentLikes', JSON.stringify(likes));

    // Обновление состояния комментариев
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
  };

  const handleDislikeComment = (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    // Новый код: обновление localStorage
    const storedDislikes = localStorage.getItem('commentDislikes');
    const dislikes = storedDislikes ? JSON.parse(storedDislikes) : {};
    dislikes[commentId] = (dislikes[commentId] || 0) + 1;
    localStorage.setItem('commentDislikes', JSON.stringify(dislikes));

    // Обновление состояния комментариев
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, dislikes: (c.dislikes || 0) + 1 } : c
    ));
  };

  const handleReplyComment = (parentCommentId: number) => {
    const replyText = prompt('Введите ваш ответ:');
    if (!replyText) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    const replyData = {
      text: replyText,
      article_id,
      parentId: parentCommentId,
      author: currentUserId,
      date: new Date(),
    };

    fetch(`/api/comments/${parentCommentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(replyData),
    })
      .then(response => response.json())
      .then(newReply => {
        setComments(prevComments => {
          const updatedComments = prevComments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }
            return comment;
          });
          return updatedComments;
        });
      })
      .catch(error => console.error('Ошибка при добавлении ответа:', error));
  };

  useEffect(() => {
    fetchComments();
  }, [article_id]);

  return (
    <div className={styles.comments}>
      <h2 className={styles.h2}>Комментарии</h2>
      <div className={styles.commentInputContainer}>
        <textarea
          className={styles.textarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставьте комментарий"
        />
        <button className={styles.addCommentButton} onClick={handleAddComment}>
          <FontAwesomeIcon icon={faPaperPlane} /> 
        </button>
      </div>
      {Array.isArray(comments) && comments.map(comment => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          onDislike={handleDislikeComment}
          onLike={handleLikeComment}
          onReply={handleReplyComment}
          onEdit={handleEditComment} 
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};

export default Comments;
