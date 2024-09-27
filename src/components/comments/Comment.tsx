import axios from 'axios';
import Button from 'components/button/Button';
import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import styles from '../comments/coment.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ru } from 'date-fns/locale'; // Исправленный импорт локали

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
  //onLike: (id: number) => void;
  //onDislike: (id: number) => void;
  onReply: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

const Comment = ({ comment, onReply, onEdit, onDelete }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleEditSubmit = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };
  const isShortComment = comment.text ? comment.text.length < 50 : false;


  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    console.log("Исходная дата:", dateString); // Логируем дату для отладки
    if (!dateString) return 'Дата недоступна'; // Проверка на наличие даты

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        console.warn("Некорректная дата:", dateString); // Логируем предупреждение о некорректной дате
        return 'Некорректная дата'; // Возвращаем сообщение о некорректной дате
    }
    
    return format(date, 'dd MMMM yyyy в HH:mm', { locale: ru }); // Форматируем дату
};



  return (
    <div className={`${styles.comment} ${isShortComment ? styles.shortComment : ''}`}>
      <div className={styles.commentHeader}>
      <p><strong>{comment.author}</strong> - {formatDate(comment.date)}</p></div>
      {!isEditing ? (
        <p>{comment.text}</p>
      ) : (
        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
      )}
      <div className={styles.commentActions}>
        {/*<button onClick={() => onLike(comment.id)}>
        <i className="bi bi-hand-thumbs-up" ></i> 
        </button>
        <button onClick={() => onDislike(comment.id)}>
        <i className="bi bi-hand-thumbs-down"></i>
        </button>*/}
        <button onClick={() => onReply(comment.id)}>
        <i className="bi bi-reply"></i> 
        </button>
        <div className={styles.moreOptions} onClick={() => setIsEditing(true)}>
        <i className="bi bi-pencil"></i> 
        </div>

            {isEditing && (
               <div>
            <button onClick={handleEditSubmit}>
            <i className="bi bi-save"></i> Сохранить</button>
            <button onClick={() => onDelete(comment.id)}>
            <i className="bi bi-trash"></i>Удалить</button>
          </div>
            )}
          </div>
      

      {comment.replies && comment.replies.map(reply => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          //onLike={onLike} 
          //onDislike={onDislike}
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

const Comments = ({ article_id}: CommentsProps) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

    // Получение userId из глобального состояния Redux
    const currentUser = useSelector((state: RootState) => state.user.user); // Здесь user — это слайс аутентификации
    const currentUserId = currentUser?.id;

// В функции fetchComments
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

      console.log("Полученные данные комментариев:", response.data.comments);

      const transformedComments = response.data.comments.map((comment: any) => ({
          id: comment.id,
          author: comment.author,
          text: comment.text,
          date: comment.date ? new Date(comment.date).toISOString() : null, // Устанавливаем дату с сервера
          replies: comment.replies || [], // Убедитесь, что это массив
      }));

      setComments(transformedComments);
  } catch (error) {
      console.error("Ошибка при загрузке комментариев:", error);
      setError("Ошибка при загрузке комментариев.");
  }
};

// В функции handleAddComment
const handleAddComment = () => {
  if (!currentUserId || currentUserId === 0) {
      alert('Пользователь не аутентифицирован');
      return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
      alert('Отсутствует токен авторизации');
      return;
  }

  const commentData = {
      text: newComment,
      user_id: currentUserId,
      article_id: article_id,
      date: new Date().toISOString(), // Отправляем текущую дату в момент добавления
  };

  console.log(commentData);

  fetch(`/api/comments`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
  })
  .then(newComment => {
      const transformedComment = {
          id: newComment.id,
          author: newComment.author,
          text: newComment.text,
          date: newComment.date ? new Date(newComment.date).toISOString() : new Date().toISOString(), // Если есть, используем дату из ответа сервера
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
          //likes: updatedComment.likes,
//dislikes: updatedComment.dislikes,
        };

        setComments(comments.map(c => c.id === commentId ? transformedComment : c));
      })
      .catch(error => console.error('Ошибка при редактировании комментария:', error));
  };

 /* const handleLikeComment = (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
      .catch(error => console.error('Ошибка при лайке комментария:', error));
  };

  const handleDislikeComment = (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Отсутствует токен авторизации');
      return;
    }

    fetch(`/api/comments/${commentId}/dislike`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
      .catch(error => console.error('Ошибка при дизлайке комментария:', error));
  };*/

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
      <h2>Комментарии</h2>
      <div className={styles.commentInputContainer}>
      <textarea 
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Оставьте комментарий"
      />
<button className={styles.addCommentButton} onClick={handleAddComment}>
  <FontAwesomeIcon icon={faPaperPlane} /> 
</button>
</div>
{/*/onLike={handleLikeComment} 
          //onDislike={handleDislikeComment}*/}
      {Array.isArray(comments) && comments.map(comment => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          
          onReply={handleReplyComment}
          onEdit={handleEditComment} 
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};

export default Comments;
