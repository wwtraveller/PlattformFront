import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Button from "../button/Button";
import styles from "./registration.module.css";
import {
  checkEmail,
  checkUsername,
  registerUser,
} from "features/auth/authAction";
import { useAppDispatch } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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


  useEffect(() => {
    try{
    if (isRegistered) {
      console.log("Перенаправление на /success после регистрации.");
      console.log("Перенаправление: isRegistered =", isRegistered);
      navigate('/success');
    }
  } catch (error) {
    console.error("Ошибка при перенаправлении:", error);
  }
  }, [isRegistered, navigate]);

  const schema = Yup.object().shape({
    username: Yup.string()
      .required("Введите имя пользователя")
      .min(2, "Минимум 2 символа")
      .max(15, "Максимум 15 символов")
      .test("unique-username", "Имя пользователя уже занято", async (value) => {
        if (value) {
          try {
            const isUsernameTaken = await checkUsername(value);
            return !isUsernameTaken; // true, если имя доступно
          } catch (error) {
            console.error("Ошибка проверки имени пользователя:", error);
            return true; // Можно вернуть true, чтобы не блокировать регистрацию, или false, если хотите отобразить ошибку
          }
        }
        return true;
      }),

    email: Yup.string()
      .required("Введите email")
      .email("Некорректный формат email")
      .test("unique-email", "Email уже занят", async (value) => {
        if (value) {
          const isEmailTaken = await checkEmail(value);
          return !isEmailTaken;
        }
        return true;
      }),

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
        console.log("Отправка данных регистрации:", values);
        const result = await dispatch(registerUser(values)).unwrap();
        console.log("Результат регистрации:", result);

        setIsRegistered(true);  // Устанавливаем успешную регистрацию
        resetForm();
        onRegisterSuccess();
      } catch (error: any) {
        console.error("Ошибка регистрации:", error);
        setServerError(error.message || 'Произошла ошибка регистрации.');  // Устанавливаем ошибку сервера
      }
    },
  });

  return (
    <div>
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
