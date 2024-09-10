import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import styles from "./login.module.css"
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../features/auth/authAction';
import Button from '../button/Button';


export interface ILoginFormValues {
    username: string
    password: string
  }


export default function Login() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    } as ILoginFormValues,
    onSubmit: (values: ILoginFormValues, {resetForm}) => {
      dispatch(loginUser(values))
      .then(()=> {
        navigate ('/')
       resetForm()
      })
    }
  })



  return (
    <div>
      <form onSubmit={formik.handleSubmit} className={styles.loginForm}>

        <input value={formik.values.username} name='username' onChange={formik.handleChange} type="text" placeholder='Ваше имя' />

        <input value={formik.values.password} name='password' onChange={formik.handleChange} type="password" placeholder='Пароль' />

        <Button type='submit' name="Войти" />

      </form>
    </div>
  )
}


