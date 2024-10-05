// src/components/header/links.ts

interface ILinks {
  
    pathname: string,
    title: string;
  }

// Ссылки для незарегистрированных пользователей
export const guestLinks: ILinks[] = [
  
  // {
  //     pathname: '/product',
  //     title: 'Продукт',
  //   },
    
    {
      pathname: '/catLinks',
      title: 'База знаний'
    },

    {
      pathname: '/faq',
      title: 'FAQ'
    },

    {
      pathname: '/glossary',
      title: 'Глоссарий'
    },
    
    // {
      //   pathname: '/authors',
      //   title: 'Авторы',
      // },
      
      {
        pathname: '/partner',
        title: 'Партнерство',
      },
      
      {
        pathname: '/about',
        title: 'О нас',
      },
    // {
    //   pathname: '/contact',
    //   title: 'Контакты',
    // },

  ];

// Ссылки для зарегистрированных пользователей
export const userLinks: ILinks[] = [
  // {
  //   pathname: '/about',
  //   title: 'О нас',
  // },
  // {
  //   pathname: '/dashboard',
  //   title: 'Главная',
  // },
  {
    pathname: '/catLinks',
    title: 'База знаний'
    },

  {
    pathname: '/favorites',
    title: 'Избранное',
  },
  ];

  // Ссылки для админов
export const adminLinks: ILinks[] = [

  {
    pathname: '/catLinks',
    title: 'База знаний'
    },
    {
      pathname: '/favorites',
      title: 'Избранное'
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
        pathname: '/userList',
        title: 'Управление пользователями'
      },
     
  ];
