import Button from 'components/button/Button';
import React, { useState, useEffect } from 'react';

// Интерфейсы для комментариев
interface CommentProps {
  comment: {
    id: number;
    author: string;
    text: string;
    date: string;
    likes: number;
    dislikes: number;
    replies?: CommentProps['comment'][];
  };
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onReply: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

const Comment = ({ comment, onLike, onDislike, onReply, onEdit, onDelete }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleEditSubmit = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="comment">
      <p><strong>{comment.author}</strong> - {new Date(comment.date).toLocaleString()}</p>
      {!isEditing ? (
        <p>{comment.text}</p>
      ) : (
        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
      )}
      <div className="comment-actions">
        <Button onClick={() => onLike(comment.id)} name='👍' count ={comment.likes}/>
        <Button onClick={() => onDislike(comment.id)} name='👎' count={comment.dislikes}/>
        <Button onClick={() => onReply(comment.id)} name='Ответить'/>
        <Button onClick={() => setIsEditing(true)} name='Изменить'/>
        <Button onClick={() => onDelete(comment.id)} name='Удалить'/>
        {isEditing && <Button onClick={handleEditSubmit} name='Сохранить'/>}
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
  articleId: number;
  currentUser: string; // Имя текущего пользователя
}

interface CommentData {
  id: number;
  author: string;
  text: string;
  date: string;
  likes: number;
  dislikes: number;
  replies?: CommentData[];
}

const Comments = ({ articleId, currentUser }: CommentsProps) => {
  const [comments, setComments] = useState<CommentData[]>([]); // Инициализация пустым массивом
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`/api/articles/${articleId}/comments`)
      .then(response => response.json())
      .then(data => {
        console.log('Комментарии с сервера:', data); // Проверьте формат данных
        setComments(data);
      })
      .catch(error => console.error('Ошибка при загрузке комментариев:', error));
  }, [articleId]);
  

  const handleAddComment = () => {
    const commentData = {
      text: newComment,
      articleId,
      author: currentUser,
      date: new Date(),
    };
  
    fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    })
      .then(response => {
        if (!response.ok) {
          // Если статус ответа не OK, выбросим ошибку
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then(newComment => {
        // Проверяем, что возвращаемые данные - это массив комментариев
        if (!Array.isArray(comments)) {
          throw new Error('Комментарии должны быть массивом');
        }
        setComments([...comments, newComment]);
        setNewComment('');
      })
      .catch(error => {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий. Проверьте сервер или маршрут.');
      });
  };

  const handleLikeComment = (commentId: number) => {
    fetch(`/api/comments/${commentId}/like`, { method: 'POST' })
      .then(response => response.json())
      .then(updatedComment => {
        setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      })
      .catch(error => console.error('Ошибка при лайке комментария:', error));
  };


  const handleDislikeComment = (commentId: number) => {
    fetch(`/api/comments/${commentId}/dislike`, { method: 'POST' })
      .then(response => response.json())
      .then(updatedComment => {
        setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      })
      .catch(error => console.error('Ошибка при дизлайке комментария:', error));
  };

  const handleDeleteComment = (commentId: number) => {
    fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      .then(() => {
        setComments(comments.filter(c => c.id !== commentId));
      })
      .catch(error => console.error('Ошибка при удалении комментария:', error));
  };

  const handleEditComment = (commentId: number, newText: string) => {
    fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    })
    .then(response => response.json())
    .then(updatedComment => {
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
    })
    .catch(error => console.error('Ошибка при редактировании комментария:', error));
  };

  const handleReplyComment = (parentCommentId: number) => {
    const replyText = prompt('Введите ваш ответ:');
    if (!replyText) return;

    const replyData = {
      text: replyText,
      articleId,
      parentId: parentCommentId,
      author: currentUser,
      date: new Date(),
    };

    fetch(`/api/comments/${parentCommentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    })
    .then(response => response.json())
    .then(newReply => {
      setComments(comments.map(c =>
        c.id === parentCommentId
          ? { ...c, replies: c.replies ? [...c.replies, newReply] : [newReply] }
          : c
      ));
    })
    .catch(error => console.error('Ошибка при ответе на комментарий:', error));
  };

  return (
    <div className="comments">
      <h2>Комментарии</h2>
      <textarea 
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Оставьте комментарий"
      />
      <Button onClick={handleAddComment} name='Добавить комментарий'/>

      {Array.isArray(comments) && comments.map(comment => (
  <Comment 
    key={comment.id} 
    comment={comment} 
    onLike={handleLikeComment} 
    onDislike={handleDislikeComment}
    onReply={handleReplyComment}
    onEdit={handleEditComment}
    onDelete={handleDeleteComment}
  />
))}

    </div>
  );
};

export default Comments;
