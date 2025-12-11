import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const pathName = useLocation();

  useEffect(()=>{
    window.scrollTo({top:0, behaviour:'smooth'})
  },[pathName])
}

export default ScrollToTop