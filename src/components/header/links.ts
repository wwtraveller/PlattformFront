// src/components/header/links.ts

interface ILinks {
  
    pathname: string,
    title: string;
  }

// Ссылки для незарегистрированных пользователей
export const guestLinks: ILinks[] = [
  {
    pathname: '/about',
    title: 'О нас',
  },
  {
    pathname: '/marketing',
    title: 'Маркетинг',
  },
  {
    pathname: '/product',
    title: 'Продукт',
  },
  {
    pathname: '/blog',
    title: 'Блог',
  },
  {
    pathname: '/catlinks',
    title: 'категории'
    }
];

// Ссылки для зарегистрированных пользователей
export const userLinks: ILinks[] = [
  {
    pathname: '/dashboard',
    title: 'Главная',
  },
  // {
  //   pathname: '/profile',
  //   title: 'Профиль',
  // },
  {
    pathname: '/articles',
    title: 'Статьи',
  },
  
  {
      pathname: '/categories',
      title: 'уп.категории'
    },
  {
    pathname: '/favorites',
    title: 'Избранное',
  },
  {
    pathname: '/about',
    title: 'О нас',
  },
  {
    pathname: '/marketing',
    title: 'Маркетинг',
  },
  {
    pathname: '/product',
    title: 'Продукт',
  },
  {
    pathname: '/blog',
    title: 'Блог',
  }, 
  {
    pathname: '/catlinks',
    title: 'категории'
    }
];
