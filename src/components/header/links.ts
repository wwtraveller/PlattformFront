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
    pathname: '/product',
    title: 'Продукт',
  },

  {
    pathname: '/favorites',
    title: 'Избранное',
  },
  ];

  // Ссылки для зарегистрированных пользователей
export const adminLinks: ILinks[] = [
  {
    pathname: '/dashboard',
    title: 'Главная',
  },
  {
    pathname: '/catLinks',
    title: 'Категории'
    },
    {
      pathname: '/product',
      title: 'Продукт',
    },
    {
      pathname: '/admin/createArticles',
      title: 'Создание статьи',
    },
    {
        pathname: '/admin/createCategories',
        title: 'Управление категориями'
      },
      {
        pathname: '/favorites',
        title: 'Избранное'
      },
  ];
