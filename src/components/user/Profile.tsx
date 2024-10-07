import React, { useEffect, useState } from "react";
import { updateUserProfile,  logoutUser, setUserAvatar, setUserData } from "features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import axios from "axios";
import { RootState } from "redux/store";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import Sidebar from "./Sidebar"; // Подключаем боковое меню
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector } from "react-redux";
// import { fetchUserData } from "features/auth/authAction";

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // Для URL аватара
  const [isLoading, setIsLoading] = useState(false); // Для состояния загрузки
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData = useAppSelector((state: RootState) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useSelector((state:any) => state.auth); // Получаем данные текущего пользователя

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName); // Предполагается, что это имя пользователя
      setEmail(userData.email);
      setUsername(userData.username);
      setInitialUsername(userData.username);
      setAvatarPreview(userData.photo || null); // Предварительный просмотр аватара
    }
  }, [userData]);


  const handleUsernameChange = () => {
    if (username !== initialUsername) {
      confirmAlert({
        title: "Подтверждение",
        message:
          "Вы изменили никнейм. После этого вам потребуется войти в аккаунт снова используя новый Никнейм. Продолжить?",
        buttons: [
          {
            label: "Да",
            onClick: () => {
              saveProfile(); // Сохранение профиля с новым никнеймом
              dispatch(logoutUser()); // Выход из аккаунта
              navigate('/');
              console.log("Никнейм изменен, выход из аккаунта");
            },
          },
          {
            label: "Нет",
            onClick: () => console.log("Изменение никнейма отменено"),
          },
        ],
      });
    } else {
      saveProfile(); // Если никнейм не изменился, просто сохраняем профиль
    }
  };

  const saveProfile = () => {
    const updatedProfile = { ...user, username };
    dispatch(updateUserProfile(updatedProfile)); // Экшен для сохранения данных на сервере
  };


  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = userData.id;

    if (!accessToken) {
      toast.error("Пожалуйста, войдите в систему.");
      return;
    }

  try {
    setIsLoading(true);

      const dataToSend = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        avatarUrl: avatarUrl,
      };

      // Если аватар выбран, сначала загружаем его
      if (avatar) {
        const avatarData = await uploadAvatar(avatar, accessToken);
        dataToSend.avatarUrl = avatarData; // Сохраняем URL загруженного аватара
      }else if (avatarUrl) {
        // Если URL аватара был введен, сохраняем его
        dataToSend.avatarUrl = avatarUrl;
      }

      handleUsernameChange();

      const response = await axios.put(`/api/users/${userId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      dispatch(setUserAvatar(response.data.avatar));

      toast.success("Профиль успешно обновлен!");

      
      
      setAvatarPreview(response.data.avatar);
      setAvatarUrl("");
      
   
      
    } catch (error: any) {
      console.error(
        "Ошибка при сохранении профиля:",
        error.response || error.message
      );
      toast.error("Ошибка при сохранении профиля.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File, accessToken: string) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put("/api/users", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.avatarUrl; // Предполагается, что сервер возвращает URL загруженного аватара
  };
  // загрузка аватарки с локального компьютера.
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Пример валидации размера файла (например, не более 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Файл слишком большой! Выберите файл размером до 2MB.");
        return;
      }

      // Пример проверки типа файла
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Неверный формат файла! Выберите JPEG или PNG.");
        return;
      }

      // Предварительный просмотр аватара
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatar(file);
      setAvatarPreview(newAvatarUrl);
      event.target.value = "";
    } else {
      // Сброс состояния, если файл удален
      setAvatar(null);
      setAvatarPreview(null);
    }
  };
  // Загрузка аватара через URL
  const handleUrlChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAvatarUrl = event.target.value;
    setAvatarUrl(newAvatarUrl);
    setAvatarPreview(newAvatarUrl);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Пользователь не авторизован");
      }
      
      const response = await axios.post(`/api/users/photo/url`, { avatarUrl: newAvatarUrl }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const updatedAvatarUrl = response.data.photoUrl;

      dispatch(setUserAvatar(updatedAvatarUrl)); // Обновляем состояние аватара в Redux
      toast.success("Аватар успешно обновлен!");
    } catch (error: any) {
      console.error("Ошибка при обновлении аватара:", error);
      toast.error("Ошибка при обновлении аватара.");
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setAvatarUrl(""); // Сбросить URL аватара
  };

  const handlePasswordChange = async () => {
    console.log("handlePasswordChange вызвана");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("Пользователь не авторизован"); // временный лог
      toast.error("Ошибка: пользователь не авторизован.");
      return;
    }

    if (!currentPassword !== !currentPassword) {
      console.log("Неверно введён текущий пароль"); // временный лог
      toast.error("Неверно введён текущий пароль.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log("Все поля должны быть заполнены"); // временный лог
      toast.error("Все поля для смены пароля должны быть заполнены.");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log("Пароли не совпадают"); // временный лог
      toast.error("Новый пароль и подтверждение пароля не совпадают.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/changePassword`,
        {
          oldPassword: currentPassword,   
          newPassword: newPassword,
          repeatPassword: confirmPassword, 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Пароль успешно изменен"); // временный лог
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Пароль успешно изменен!");
      
      // Если API возвращает новый токен после смены пароля, обновите его
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
      }
    } catch (error: any) {
      console.error("Ошибка при смене пароля:", error);
      toast.error("Ошибка при изменении пароля.");
    }
  };


  const handleDeleteAccount = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Ошибка: пользователь не авторизован.");
      return;
    }

    const confirmed = window.confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие невозможно отменить.");

    if (!confirmed) return;

    try {
      await axios.delete(`/api/users/${userData.id}`, { // Убедитесь в корректности эндпоинта
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Очистить состояние и localStorage
      dispatch(setUserData(userData));
      localStorage.removeItem("accessToken");
      toast.success("Аккаунт успешно удалён.");

      // Перенаправить на главную страницу или страницу регистрации
      window.location.href = "/";
    } catch (error: any) {
      console.error("Ошибка при удалении аккаунта:", error.response || error.message);
      toast.error("Ошибка при удалении аккаунта.");
    }
  };

  return (
    <div className={styles.profilePage}>
      <Sidebar /> {/* Боковое меню */}
      <div className={styles.profileContainer}>
        <div className={styles.title}>
          <h1>Настройки профиля</h1>
          <p className={styles.headerUsername}>{userData.username}</p>
        </div>
        <div className={styles.backgroundHeader}></div>

        <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.profileAvatar}
            />
          ) : (
            <img
              src="/default-FFA-avatar.png"
              alt="Default Avatar"
              className={styles.profileAvatar}
            />
          )}

          <div className={styles.avatarButtons}>
            <label htmlFor="fileInput" className={styles.customFileButton}>
              <span>Выбрать аватар</span>
            </label>

            {avatarPreview && (
              <button
                onClick={handleRemoveAvatar}
                className={styles.removeAvatarButton}
              >
                Удалить
              </button>
            )}
          </div>
        </div>

          <form className={styles.profileForm}>
          <input
            id="fileInput"
            className={styles.imageInput}
            type="file"
            onChange={handleAvatarChange}
          />
           <input
            className={styles.profileInput}
            type="text"
            placeholder="URL аватара"
            value={avatarUrl}
            onChange={handleUrlChange}
          />
            <p>Никнейм</p>
            <input
              className={styles.profileInput}
              type="text"
              placeholder="Никнейм"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>Имя</p>
            <input
              className={styles.profileInput}
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <p>Фамилия</p>
            <input
              className={styles.profileInput}
              type="text"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <p>Email</p>
            <input
              className={styles.profileInput}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
            type="button"
            className={styles.profileButton}
            onClick={handleSave}
            disabled={isLoading} // Отключить кнопку при загрузке
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          </form>

          <div className={styles.changePasswordContainer}>
            <p>Изменить пароль</p>
            <input
              className={styles.profileInputPassword}
              type="password"
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              className={styles.profileInputPassword}
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className={styles.profileInputPassword}
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className={styles.passwordButton} onClick={handlePasswordChange}>
              Изменить пароль
            </button>
          </div>

          <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>
            Удалить аккаунт
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;

// Написать полный функционал редактирования профиля.
//  чтоб можно было менять аватар и сохранять его,
//  так чтобы он отображался и в header и удалять его.