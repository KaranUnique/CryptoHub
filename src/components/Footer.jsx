//@@viewOn:imports
import React from 'react'
import './Footer.css'
import { PAGE_TEXT } from '../constants/pages'
//@@viewOff:imports

const Footer = () => {
  //@@viewOn:render
  return (
    <div className='footer'>
      <p>{PAGE_TEXT.FOOTER.COPYRIGHT}</p>
    </div>
  )
  //@@viewOff:render
}

//@@viewOn:exports
export default Footer
//@@viewOff:exports
