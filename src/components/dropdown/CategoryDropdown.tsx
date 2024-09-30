import { useState } from 'react';
import styles from './categoryDropdown.module.css';

interface CategoryDropdownProps {
  categories: string[];
}

export default function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles.dropdownToggle}>
        Категории
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {categories.map((category, index) => (
            <li key={index} className={styles.dropdownItem}>
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
