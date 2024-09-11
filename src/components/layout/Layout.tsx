import React from 'react';

import styles from './layout.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <Header setError={function (message: string | null): void {
        throw new Error('Function not implemented.');
      } } setSearchResults={function (results: SearchItem[]): void {
        throw new Error('Function not implemented.');
      } } />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
