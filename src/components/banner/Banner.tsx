import React from "react";
import styles from "./banner.module.css";

interface BannerProps {
  bannerText: string; // Пропс для текста
  imageUrl: string; // Пропс для URL изображения
}

const Banner: React.FC<BannerProps> = ({ bannerText, imageUrl }) => {
  return (
    <div className={styles.bannerContainer}>
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className={styles.bannerText}>{bannerText}</div>{" "}{/* Используем текст из пропсов */}
      </div>
    </div>
  );
};

export default Banner;
