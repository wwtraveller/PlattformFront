import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import styles from './articleForm.module.css';
import ModalArticleForm from './ModalArticleForm';

interface Article {
    id: number;
    title: string;
    content: string;
    photo: string | null;
    username: string;
    comments: any[];
}

interface Category {
    id: number;
    name: string; 
}

interface ArticleFormProps {
    articleId: number | null;  
    categoryId: number | null; 
    categories: Category[];
    onSuccess: () => void;
}

const ArticleForm = ({ articleId, categoryId, categories, onSuccess }: ArticleFormProps) => {
    const [article, setArticle] = useState<Article>({
        id: 0,
        title: '',
        content: '',
        photo: null,
        username: '',
        comments: [],
    });
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryId); 
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true); // Управление видимостью формы

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

                    const contentBlock = htmlToDraft(response.data.content);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const newEditorState = EditorState.createWithContent(contentState);
                        setEditorState(newEditorState);
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
        setEditorState(newEditorState);
    };

    const resetForm = () => {
        setArticle({
            id: 0,
            title: '',
            content: '',
            photo: null,
            username: '',
            comments: [],
        });
        setEditorState(EditorState.createEmpty());
        setSelectedCategory(categoryId);
        setError(null); // Сброс ошибки
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = checkAuthToken();
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }
    
        try {
            const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            const payload = {
                title: article.title,
                content: content,
                categories: selectedCategory ? [selectedCategory] : [],
            };
    
            console.log('Payload для отправки:', payload); // Логирование данных перед отправкой
    
            if (articleId) {
                await axios.put(`/api/articles/${articleId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post('/api/articles', payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
    
            console.log('Успех! Открываем модальное окно.');
            setIsModalOpen(true); // Открываем модальное окно
            setIsFormVisible(false); // Скрываем форму после успешного создания/обновления
            resetForm(); // Сбрасываем форму
            console.log('isModalOpen после установки:', true); // Логирование после установки
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };
    
   // if (!isFormVisible) return null; // Если форма не должна отображаться, ничего не рендерим

   return (
    <div>
        {isFormVisible && (
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
        )}
        <ModalArticleForm
            isOpen={isModalOpen}
            onClose={() => {
                console.log('Закрываем модальное окно');
                setIsModalOpen(false);
                resetForm(); // Сброс формы при закрытии модального окна
            }}
            message={articleId ? "Статья успешно обновлена!" : "Новая статья успешно создана!"}
        />
    </div>
);
}

export default ArticleForm;
