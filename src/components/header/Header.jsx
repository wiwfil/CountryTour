import React from 'react'
import icon from "../../assets/icon.png"

const Header = () => {
  return (
    <div className="header"><img className="icon" src={icon} alt="logo"/><span>Country Tour</span></div>
  )
}

export default Header