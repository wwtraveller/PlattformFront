interface ILinks {
    pathname: string,
    title: string;
  }
  
  
  export const links:ILinks[] = [
    {
      pathname: '/about',
      title: 'О нас'
    },
    {
      pathname: '/marketing',
      title: 'Маркетинг'
    },
    {
      pathname: '/product',
      title: 'Продукт'
    },
    {
      pathname: '/blog',
      title: 'Блог'
    },
  ];