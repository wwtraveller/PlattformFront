import styles from './header.module.css'
import { Link, useLocation } from 'react-router-dom';
import React from 'react'
import { links } from './links'


export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <span>Shalimova's Project</span>
      <div>
        {links.map((el, index) => (
          <Link
            key={index}
            className={location.pathname === el.pathname ? styles.active : ''}
            to={el.pathname}>{el.title}</Link>
        ))}

      </div>
    </header>
  )
}