import React, { useRef } from "react";
import styles from "./about.module.css";
import { FaArrowDown } from "react-icons/fa";

interface PhotoCardProps {
  img: string;
  caption: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ img, caption }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const reflection = reflectionRef.current;

    if (card && reflection) {
      const relX = (event.nativeEvent.offsetX + 1) / card.offsetWidth;
      const relY = (event.nativeEvent.offsetY + 1) / card.offsetHeight;
      const rotY = `rotateY(${(relX - 0.5) * 60}deg)`;
      const rotX = `rotateX(${(relY - 0.5) * -60}deg)`;

      card.style.transform = `perspective(500px) scale(2) ${rotY} ${rotX}`;

      const lightX = scale(relX, 0, 1, 150, -50);
      const lightY = scale(relY, 0, 1, 30, -100);
      const lightConstrain = Math.min(Math.max(relY, 0.3), 0.7);
      const lightOpacity = scale(lightConstrain, 0.3, 1, 0.3, 0) * 255;
      const lightShade = `rgba(${lightOpacity}, ${lightOpacity}, ${lightOpacity}, 0.1)`;
      const lightShadeBlack = `#00000078`;

      reflection.style.backgroundImage = `radial-gradient(circle at ${lightX}% ${lightY}%, ${lightShade} 20%, ${lightShadeBlack})`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const reflection = reflectionRef.current;
    if (card && reflection) {
      card.style.transform = `perspective(500px) scale(1)`;
      reflection.style.opacity = "0";
    }
  };

  const handleMouseOver = () => {
    const reflection = reflectionRef.current;
    if (reflection) {
      reflection.style.opacity = "1";
    }
  };

  const scale = (
    val: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) => outMin + ((val - inMin) * (outMax - outMin)) / (inMax - inMin);

  return (
    <div
      className={styles.card}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
    >
      <div className={styles.reflection} ref={reflectionRef}></div>
      <img src={img} alt="Photo" className={styles.img} />
      <p className={styles.caption}>{caption}</p>
    </div>
  );
};

export default function About() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const imagesFront = [
    {
      src: "https://avatars.githubusercontent.com/u/30770110?v=4",
      caption: "Алена Шилимова",
    },
    {
      src: "https://1.downloader.disk.yandex.ru/preview/fb642bb231c2a33a4ec7238a503e66cf30bc228acbff0ad3a102787071c079f3/inf/cMyxO6zz9fcvKyknLKom00p4KrYTav2nFrw8tmij4Luoaak_LKrDQ4Pp6WDP8Wv-kcTC-3uLL8d8K8etXOjemQ==?uid=7119991&filename=2022-07-21+19-19-55.HEIC&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&tknv=v2&owner_uid=7119991&size=3200x1362",
      caption: "Александр Варнавин-Браун",
    },
    {
      src: "https://downloader.disk.yandex.ru/preview/0588dde01021512a5d1f09f020256c33c7df7e558ecffe53cb3d1191046319c0/66f356ba/MVIcg3Z41wRWFN397QByzgDYy_4kLq2wUCrAY2U9cfHc_PYJ8NfLNXcsQZlDRkGKi2zrWBDFzEgIpx36PvopGw%3D%3D?uid=0&filename=IMG_1477.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=2048x2048",
      caption: "Катя Ваймер",
    },
  ];
  const imagesQa = [
    {
      src: "https://ca.slack-edge.com/T049BEB3UQP-U064D5MSW3C-0e0bb58a63e4-512",
      caption: "Акмоор Забытахунова",
    },
    {
      src: "https://ca.slack-edge.com/T049BEB3UQP-U06M0TQMKML-a58762b0836e-512",
      caption: "Анастасия Григоренко",
    },
  ];
  const imagesBack = [
    {
      src: "https://avatars.githubusercontent.com/u/165147557?v=4",
      caption: "Денис Коваленко",
    },
    {
      src: "https://media.licdn.com/dms/image/v2/D4E03AQH1RP883hIICw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727607343092?e=1733356800&v=beta&t=sg0uLqdY8V_AWw4FchS8gk4L-0dVOLzfeAMvbBsLICQ",
      caption: "Алиса Тонгалюк",
    },
    {
      src: "https://avatars.githubusercontent.com/u/165147653?v=4",
      caption: "Тарас Чайковский",
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.background}>
        <h1>Хочешь узнать о нас больше?</h1>
        <button className={styles.scrollButton} onClick={scrollToCarousel}>
          <FaArrowDown />
        </button>
      </div>

      <div className={styles.ourDevelopers} ref={carouselRef}>
        <h2>Наши разработчики</h2>
      </div>

      <div className={styles.carouselContainer}>
        <div className={styles.category}>
          <p className={styles.categoryTitle}>Front-end</p>
          <div className={styles.grid}>
            {imagesFront.map((imgObj: any, index) => (
              <PhotoCard
                key={index}
                img={imgObj.src}
                caption={imgObj.caption}
              />
            ))}
          </div>
        </div>

        <div className={styles.category}>
          <p className={styles.categoryTitle}>QA</p>
          <div className={styles.grid}>
            {imagesQa.map((imgObj: any, index) => (
              <PhotoCard
                key={index}
                img={imgObj.src}
                caption={imgObj.caption}
              />
            ))}
          </div>
        </div>

        <div className={styles.category}>
          <p className={styles.categoryTitle}>Back-end</p>
          <div className={styles.grid}>
            {imagesBack.map((imgObj: any, index) => (
              <PhotoCard
                key={index}
                img={imgObj.src}
                caption={imgObj.caption}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
