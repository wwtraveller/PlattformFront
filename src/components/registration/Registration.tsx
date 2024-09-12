import React from "react";
import { useFormik } from "formik";
import Button from "../button/Button";
import styles from "./registration.module.css";
import { registerUser } from "features/auth/authAction";
import { useAppDispatch } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export interface IRegisterFormValues {
  firstName: string;
  lastName: string;
  // username: string;
  email: string;
  password: string;
}

export default function Registration() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup.string()
      // .required("Введите имя пользователя")
      // .min(2, "Минимум 2 символа")
      // .max(15, "Максимум 15 символов")
      ,
    email: Yup.string()
      .required("Введите email")
      .email("не корректный формат email"),
    password: Yup.string()
      .required("Введите пароль")
      .min(8, "Пароль должен содержать минимум 6 символов")
      .matches(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .matches(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .matches(/\d/, "Пароль должен содержать хотя бы одну цифру")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Пароль должен содержать хотя бы один специальный символ"
      ),
  });
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      // username: "",
      email: "",
      password: "",
    } as IRegisterFormValues,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: (values: IRegisterFormValues, { resetForm }) => {
      console.log("1234")
      dispatch(registerUser(values))
        .then(() => {
          navigate("/");
          resetForm();
        })
        .catch((error) => {
          console.error("Ошибка регистрации:", error);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.signupForm}>
      <input
        type="text"
        name="username"
        placeholder="Ваше имя"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        className={
          formik.touched.lastName && formik.errors.lastName
            ? styles.inputError
            : ""
        }
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <div className={styles.error}>{formik.errors.lastName}</div>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        className={
          formik.touched.email && formik.errors.email ? styles.inputError : ""
        }
      />
      {formik.touched.email && formik.errors.email && (
        <div className={styles.error}>{formik.errors.email}</div>
      )}
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formik.values.password}
        onChange={formik.handleChange}
        className={
          formik.touched.password && formik.errors.password
            ? styles.inputError
            : ""
        }
      />
      {formik.touched.password && formik.errors.password && (
        <div className={styles.error}>{formik.errors.password}</div>
      )}

      <Button type="submit" name="Зарегистрироваться" />
    </form>
  );
}
