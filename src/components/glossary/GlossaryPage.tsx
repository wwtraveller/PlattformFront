import React from 'react';
import styles from './glossaryPage.module.css';

interface GlossaryItem {
  term: string;
  definition: string;
}

const glossaryData: GlossaryItem[] = [
  { 
    term: "Лид-магнит", 
    definition: "Бесплатное ценное предложение (например, электронная книга, вебинар, чек-лист), предоставляемое потенциальному клиенту в обмен на его контактные данные с целью дальнейшего маркетинга." 
  },
  { 
    term: "Целевая аудитория (ЦА)", 
    definition: "Группа людей, объединенных общими характеристиками и потребностями, на которую направлены маркетинговые усилия и продукты компании." 
  },
  { 
    term: "Воронка продаж", 
    definition: "Модель пути клиента от первого знакомства с продуктом до совершения покупки, разделенная на этапы: осведомленность, интерес, решение и действие." 
  },
  { 
    term: "Контент-маркетинг", 
    definition: "Стратегия создания и распространения ценного и релевантного контента для привлечения и удержания целевой аудитории с целью стимулирования прибыльных действий клиентов." 
  }
];

const GlossaryPage: React.FC = () => {
  return (
    <div className={styles.glossaryPage}>
      <h1 className={styles.title}>Глоссарий</h1>
      <ul className={styles.glossaryList}>
        {glossaryData.map((item, index) => (
          <li key={index} className={styles.glossaryItem}>
            <h2 className={styles.term}>{item.term}</h2>
            <p className={styles.definition}>{item.definition}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlossaryPage;
