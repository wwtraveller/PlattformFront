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
    
    // {
      //   pathname: '/authors',
      //   title: 'Авторы',
      // },
      
      // {
      //   pathname: '/partner',
      //   title: 'Партнерство',
      // },
      
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
      pathname: '/blog',
      title: 'Блог'
    },

  {
    pathname: '/favorites',
    title: 'Избранное',
  },

  {
    pathname: '/glossary',
    title: 'Глоссарий'
  },

  {
    pathname: '/faq',
    title: 'FAQ'
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
      pathname: '/admin/adminarticles',
      title: 'Статьи',
    },
    {
        pathname: '/admin/admincategories',
        title: 'Категории'
      },
      {
        pathname: '/userlist',
        title: 'Пользователи'
      },
     
  ];
