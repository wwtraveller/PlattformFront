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

  const imagesFront = [
    {
      src: "https://avatars.githubusercontent.com/u/30770110?v=4",
      caption: "Алена Шилимова",
    },
    {
      src: "https://avatars.githubusercontent.com/u/165147653?v=4",
      caption: "Александр Варнавин-Браун",
    },
    {
      src: "https://ca.slack-edge.com/T049BEB3UQP-U06MLK1TMDF-22573012a44c-512",
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
      src: "https://ca.slack-edge.com/T049BEB3UQP-U06M741K0BT-5137324824fe-512",
      caption: "Тарас Чайковский",
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.stackTechnology}>
        <div className={styles.gridStack}>
          <div className={styles.leftBlock}>
            <h1>Стек технологий</h1>
            <div className={styles.logos}>
              <img src="https://lmsdo.rea.ru/pluginfile.php/14950/course/overviewfiles/react%404x.png" />
              <img src="https://www.lerned.top/imj/kurses/f4.png" />
              <img src="https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_typescript_icon_130108.png" />
              <img src="https://www.lerned.top/imj/kurses/b1.png" />
              <img src="https://ucarecdn.com/a1fe06da-7fe5-4e40-9726-267b4e91934c/" />
              <img src="https://i.pinimg.com/originals/06/86/c0/0686c0c85407548ea5bd737a572974b6.png" />
              <img src="https://harasou.jp/2018/02/10/one-execusion-file-in-docker-image/vertical.png" />
              <img src="https://lmsdo.rea.ru/pluginfile.php/24789/course/overviewfiles/spring_beecoder.org-3.png" />
              <img src="https://static.tildacdn.com/tild3435-3136-4939-a561-383935353232/javascript.png" />
              <img src="https://gromcode.com/static/images/maven.webp" />
              <img src="https://howtodoinjava.com/wp-content/uploads/2014/09/hibernate-logo.png" />
              <img src="https://user-images.githubusercontent.com/98197909/222990768-452ebe01-9134-48af-b539-3dc9ef1eb179.png" />
              <img src="https://assets.dataprovider.com/img/recipe/105-1631878131-DigitalOcean_NASDAQDOCN_COPY_2880pxDigitalOcean_logo_svg.png" />
              <img src="https://www.chrismsmalley.com/img/tech/css3.png" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/HTML5_logo_black.svg/2048px-HTML5_logo_black.svg.png" />
            </div>
          </div>
          <div className={styles.rightBlock}>
            <img
              src="https://edu.permaviat.ru/pluginfile.php/107289/course/overviewfiles/what-is-web-development.gif"
              alt="Технологии"
            />
          </div>
        </div>
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
