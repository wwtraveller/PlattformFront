// src/components/header/links.ts

interface ILinks {
  
    pathname: string,
    title: string;
  }

// Ссылки для незарегистрированных пользователей
export const guestLinks: ILinks[] = [
  // {
  //   pathname: '/dashboard',
  //   title: 'Главная',
  // },
  
  // {
  //     pathname: '/product',
  //     title: 'Продукт',
  //   },
    
    {
      pathname: '/catLinks',
      title: 'Контент'
    },

    {
      pathname: '/about',
      title: 'О нас',
    },

    {
      pathname: '/referenten',
      title: 'Авторы',
    },

    {
      pathname: '/partner',
      title: 'Партнерство',
    },

    {
      pathname: '/contact',
      title: 'Контакты',
    },

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
  ];

  // Ссылки для админов
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
      pathname: '/admin/createArticles',
      title: 'Управление статьями',
    },
    {
        pathname: '/admin/createCategories',
        title: 'Управление категориями'
      },
      {
        pathname: '/favorites',
        title: 'Избранное'
      },
      {
        pathname: '/userList',
        title: 'user'
      },
     
  ];
