import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import styles from './articleForm.module.css'


// Определяем интерфейс для статьи
interface Article {
    id: number;
    title: string;
    content: string;
    photo: string | null;
    username: string;
    comments: any[];
}

// Определяем интерфейс для категорий
interface Category {
    id: number;
    name: string; 
}

interface ArticleFormProps {
    articleId: number | null;  
    categoryId: number | null; 
    categories: Category[];
    onSuccess: () => void;

const ArticleForm = ({ articleId, categoryId, categories, onSuccess }: ArticleFormProps) => {
    const [article, setArticle] = useState<Article>({
        id: 0,
        title: '',
        content: '',
        photo: null,
        username: '',
        comments: [],
    });
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Добавляем состояние для редактора
    const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryId); 
    const [error, setError] = useState<string | null>(null);

    const checkAuthToken = (): string | null => {
        return localStorage.getItem('accessToken'); 
    };

    useEffect(() => {
        const fetchArticle = async () => {
            if (articleId) {
                const token = checkAuthToken(); 
                if (!token) {
                    setError('Токен не найден. Пожалуйста, войдите в систему.');
                    return;
                }

                try {
                    const response = await axios.get(`/api/articles/${articleId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setArticle(response.data);
                    setSelectedCategory(response.data.categories[0]?.id || null);

                    // Конвертируем HTML контент в формат редактора Draft.js
                    const contentBlock = htmlToDraft(response.data.content);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const newEditorState = EditorState.createWithContent(contentState);
                        setEditorState(newEditorState); // Устанавливаем состояние редактора
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('Произошла неизвестная ошибка');
                    }
                }
            }
        };

        fetchArticle();
    }, [articleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setArticle(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(Number(e.target.value));
    };

    const handleEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState); // Обновляем состояние редактора при изменениях
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = checkAuthToken();
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            // Конвертируем содержимое редактора в HTML
            const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

            const payload = {
                title: article.title,
                content: content, // Используем HTML-контент редактора
                categories: selectedCategory ? [selectedCategory] : [],
            };

            if (articleId) {
                const response = await axios.put(`/api/articles/${articleId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Статья успешно отредактирована:', articleId, response.data);
            } else {
                await axios.post('/api/articles', payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Новая статья успешно создана');
            }
            onSuccess();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    return (
        <form className={styles.articleForm} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage} style={{ color: 'red' }}>{error}</div>}
            <input
                className={styles.articleTitle}
                type="text"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Заголовок"
                required
            />

            {/* Редактор для содержимого статьи */}
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
                }}
            />

            <select value={selectedCategory || ''} onChange={handleCategoryChange} required>
                <option value="" disabled>Выберите категорию</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export default ArticleForm;
