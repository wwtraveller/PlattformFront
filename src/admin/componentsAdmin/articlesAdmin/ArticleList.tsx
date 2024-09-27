import React from 'react';

interface Article {
    id: number;
    title: string;
    username: string;
}

interface ArticleListProps {
    articles: Article[];
    onEdit: (articleId: number) => void;
    onDelete: (articleId: number) => void;
}

const ArticleList = ({ articles, onEdit, onDelete }: ArticleListProps) => {
    console.log('Полученные статьи для отображения:', articles); // Логирование статей перед отображением
    return (
        <div>
            <h2>Список артиклей</h2>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <strong>{article.title}</strong> — Автор: {article.username}
                        <div>
                            <button onClick={() => onEdit(article.id)}>Редактировать</button>
                            <button onClick={() => onDelete(article.id)}>Удалить</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;
