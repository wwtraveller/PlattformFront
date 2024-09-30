import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Button from "../button/Button";
import styles from "./registration.module.css";
import {
  checkEmail,
  isAvailableUsername,
  registerUser,
} from "features/auth/authAction";
import { useAppDispatch } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export interface IRegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface RegistrationProps {
  onRegisterSuccess: () => void;
}

export default function Registration({ onRegisterSuccess }: RegistrationProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // Убедитесь, что состояние определено
  const [isRegistered, setIsRegistered] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const schema = Yup.object().shape({
    username: Yup.string()
      .required("Введите имя пользователя")
      .min(2, "Минимум 2 символа")
      .max(15, "Максимум 15 символов")
      .test(
        "unique-username",
        "Имя пользователя уже существует!",
        async (value) => {
          return (await isAvailableUsername(value));
        }
      ),

    email: Yup.string()
      .required("Введите email")
      .email("Некорректный формат email")
      .test(
        "unique-email",
        "Email уже занят!",
        async (value) => {
         
              return (await checkEmail(value));
            }
         
      ),

    password: Yup.string()
      .required("Введите пароль")
      .min(8, "Пароль должен содержать минимум 8 символов")
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
      username: "",
      email: "",
      password: "",
    } as IRegisterFormValues,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values: IRegisterFormValues, { resetForm }) => {
      try {
        const result = await dispatch(registerUser(values)).unwrap();
        toast.success('Регистрация прошла успешно!');
        setIsRegistered(true); // Устанавливаем успешную регистрацию
        resetForm();
        setTimeout(() => {
          if (typeof onRegisterSuccess === "function") {
            onRegisterSuccess();
          }
        }, 2000);
      } catch (error: any) {
        toast.error("Ошибка регистрации: " + (error.message || "Произошла ошибка регистрации."));
        setServerError(error.message || "Произошла ошибка регистрации."); // Устанавливаем ошибку сервера
      }
    },
  });

  return (
    <div>
       <ToastContainer />
      <form onSubmit={formik.handleSubmit} className={styles.signupForm}>
        {serverError && <div className={styles.error}>{serverError}</div>}{" "}
        <input
          type="text"
          name="username"
          placeholder="Никнейм"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.username && formik.errors.username
              ? styles.inputError
              : ""
          }
        />
        {formik.touched.username && formik.errors.username && (
          <div className={styles.error}>{formik.errors.username}</div>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.email && formik.errors.email ? styles.inputError : ""
          }
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.error}>{formik.errors.email}</div>
        )}
        <div className={styles.passwordContainer}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Пароль"
            className={
              formik.touched.password && formik.errors.password
                ? styles.inputError
                : ""
            }
          />
          <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className={styles.error}>{formik.errors.password}</div>
        )}
        <Button type="submit" name="Зарегистрироваться" />
      </form>
    </div>
  );
}
