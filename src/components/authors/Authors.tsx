import React from 'react'
import styles from './authors.module.css'

export default function Authors() {
  return (
      <div>
        <h3>Authors</h3>
        {/* Контейнер для фото и текста */}
        <div className={styles.photoAndText}>
        {/* Фото */}
        <div className={styles.photoContainer}>
        <img src="/media/me4.png" alt="photo" className={styles.photo} />
        </div>
        <div className={styles.photoContainer}>
        <img src="https://media.licdn.com/dms/image/v2/D4E03AQH1RP883hIICw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727607343092?e=1733356800&v=beta&t=sg0uLqdY8V_AWw4FchS8gk4L-0dVOLzfeAMvbBsLICQ" alt="photo" className={styles.photo} />
        </div>
        <div className={styles.photoContainer}>
        <img src="https://ca.slack-edge.com/T049BEB3UQP-U064D5MSW3C-0e0bb58a63e4-512" alt="photo" className={styles.photo} />
        </div>
        <div className={styles.photoContainer}>
        <img src="https://ca.slack-edge.com/T049BEB3UQP-U06M0TQMKML-a58762b0836e-512" alt="photo" className={styles.photo} />
        </div>
        <div className={styles.photoContainer}>
        <img src="/media/me4.png" alt="photo" className={styles.photo} />
        </div>
        </div>
        </div>
  );
  }
