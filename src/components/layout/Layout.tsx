import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../header/Header.tsx'
import Footer from '../footer/Footer.tsx'

const Layout = () => {
  return (
    <div>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer/>
    </div>
  )
}

export default Layout