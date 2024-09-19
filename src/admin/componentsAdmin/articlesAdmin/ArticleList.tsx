import styles from './articleList.module.css';

interface Article {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string } | null;
}

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
}

export default function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  return (
    <ul className={styles.articleList}>
      {articles.map((article) => (
        <li key={article.id} className={styles.articleItem}>
          <div>
            <h4>{article.title}</h4>
            <p>{article.content}</p>
            <p>{article.category ? article.category.name : 'Без категории'}</p>
          </div>
          <div>
            <button className={styles.editButton} onClick={() => onEdit(article)}>Редактировать</button>
            <button className={styles.deleteButton} onClick={() => onDelete(article.id)}>Удалить</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
