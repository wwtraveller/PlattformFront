import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import styles from "./login.module.css"
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../features/auth/authAction';
import Button from '../button/Button';
import * as Yup from 'yup';


export interface ILoginFormValues {
    username: string
    password: string
  }
  export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
  

     // Валидационная схема Yup для формы
  const schema = Yup.object().shape({
    username: Yup.string()
      .required('Введите имя пользователя')
      .min(2, 'Минимум 2 символа')
      .max(15, 'Максимум 15 символов'),
    password: Yup.string()
      .required('Введите пароль')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
  });
    const formik = useFormik({
      initialValues: {
        username: 'emilys',
        password: 'emilyspass'
      } as ILoginFormValues,
      validationSchema: schema,
      onSubmit: (values: ILoginFormValues) => {
        // Диспатчим экшен для логина
        dispatch(loginUser(values))
          .unwrap()
          .then((response) => {
            // Если авторизация успешна, делаем редирект
            navigate('/');
          })
          .catch((error) => {
            console.error('Ошибка авторизации:', error);
          });
      },
    });
  
    return (
      <form onSubmit={formik.handleSubmit}>
        <input
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Имя пользователя"
          className={formik.touched.username && formik.errors.username ? styles.inputError : ''}

        />
         {formik.touched.username && formik.errors.username && (
          <div className={styles.error}>{formik.errors.username}</div>
        )}
        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Пароль"
          className={formik.touched.password && formik.errors.password ? styles.inputError : ''}

        />
          {formik.touched.password && formik.errors.password && (
          <div className={styles.error}>{formik.errors.password}</div>
        )}
        <Button type="submit" name="Войти" />
      </form>
    );
  }