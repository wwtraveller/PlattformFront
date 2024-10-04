import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { setUserAvatar, setUserData } from "features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import axios from "axios";
import { RootState } from "redux/store";
import { toast } from "react-toastify";
// import { fetchUserData } from "features/auth/authAction";

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // Для URL аватара
  const [isLoading, setIsLoading] = useState(false); // Для состояния загрузки
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state: RootState) => state.auth.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName); // Предполагается, что это имя пользователя
      setEmail(userData.email);
      setAvatarPreview(userData.photo || null); // Предварительный просмотр аватара
    }
  }, [userData]);

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
        username: userData.username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        avatarUrl: avatarUrl,
      };

      // Если аватар выбран, сначала загружаем его
      if (avatar) {
        const avatarData = await uploadAvatar(avatar, accessToken);
        dataToSend.avatarUrl = avatarData; // Сохраняем URL загруженного аватара
      }

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
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(event.target.value);
    setAvatarPreview(event.target.value); // Обновить предварительный просмотр для URL
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setAvatarUrl(""); // Сбросить URL аватара
  };

  const handlePasswordChange = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Ошибка: пользователь не авторизован.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Все поля для смены пароля должны быть заполнены.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Новый пароль и подтверждение пароля не совпадают.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/users`, // проверьте корректность эндпоинта
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Пароль успешно изменен!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

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
    <div className={styles.background}>
      <div className={styles.title}>
        <h1>Настройки профиля:</h1>
        <p className={styles.headerUsername}>{userData.username}</p>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.backgroundHeader}></div>
        <h4 className={styles.profileName}>Редактировать профиль</h4>
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
          <p>Безопасность</p>

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
          <button
            className={styles.passwordButton}
            onClick={handlePasswordChange}
          >
            Изменить пароль
          </button>
        </div>
        <button
          onClick={handleDeleteAccount}
          className={styles.deleteAccountButton}
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
};

export default Profile;

// Написать полный функционал редактирования профиля.
//  чтоб можно было менять аватар и сохранять его,
//  так чтобы он отображался и в header и удалять его.
//  Также чтобы можно было изменять пароль и сохранять его,
//   вводя сначала старый пароль,
//    потом прописав новый и вновь подтвердить новый пароль.