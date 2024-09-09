interface ILinks {
  pathname: string,
  title: string;
}


export const links:ILinks[] = [
  {
    pathname: '/',
    title: 'Home'
  },
  {
    pathname: '/management',
    title: 'Management'
  },
  {
    pathname: '/promotion',
    title: 'Promotion'
  },
];
