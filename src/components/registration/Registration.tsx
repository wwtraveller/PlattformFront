import React from 'react';
import { useFormik } from 'formik';
import Button from '../button/Button';
import styles from './registration.module.css';

export default function Registration() {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    onSubmit: (values) => {
      console.log('Registration form values:', values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.signupForm}>
      <input
        type="text"
        name="username"
        placeholder="Username"
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
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <Button type="submit" name="Sign Up" />
    </form>
  );
}
