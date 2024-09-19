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
  // {
  //   pathname: '/marketing',
  //   title: 'Маркетинг',
  // },
  {
    pathname: '/product',
    title: 'Продукт',
  },
  // {
  //   pathname: '/blog',
  //   title: 'Блог',
  // },
  {
    pathname: '/catLinks',
    title: 'Категории'
    }
];

// Ссылки для зарегистрированных пользователей
export const userLinks: ILinks[] = [
  {
    pathname: '/about',
    title: 'О нас',
  },
  {
    pathname: '/dashboard',
    title: 'Главная',
  },
  {
    pathname: '/catLinks',
    title: 'Категории'
    },

    {
      pathname: '/favorites',
      title: 'Избранное',
    },

    {
      pathname: '/product',
      title: 'Продукт',
    },
  



    
    {
      pathname: '/articles',
      title: 'Статьи',
    },
    
    {
        pathname: '/categories',
        title: 'уп.категории'
      },
  ];
