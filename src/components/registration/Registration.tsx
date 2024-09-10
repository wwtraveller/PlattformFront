import React from 'react';
import { useFormik } from 'formik';
import Button from '../button/Button';
import styles from './registration.module.css';
import { loginUser, registerUser } from 'features/auth/authAction';
import { useAppDispatch } from 'redux/hooks';
import { useNavigate } from 'react-router-dom';


export interface IRegisterFormValues {
    username: string
    email: string
    password: string
  }

export default function Registration() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    } as IRegisterFormValues,
    onSubmit: (values: IRegisterFormValues, {resetForm}) => {
        dispatch(registerUser(values))
        .then(()=> {
          navigate ('/')
         resetForm()
        })
   
    }
  });



  return (
    <form onSubmit={formik.handleSubmit} className={styles.signupForm}>
      <input
        type="text"
        name="username"
        placeholder="Ваше имя"
        value={formik.values.username}
        onChange={formik.handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <Button type="submit" name="Зарегистрироваться" />
    </form>
  );
}
