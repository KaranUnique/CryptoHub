//@@viewOn:imports
import React from "react";
import "./Features.css";
import { PAGE_TEXT } from "../constants/pages";
//@@viewOff:imports

function Features() {
  //@@viewOn:render
  return (
    <div className="features-page">
      <div className="features-title">{PAGE_TEXT.FEATURES.TITLE}</div>
      <div className="features-desc">
          <>
            {PAGE_TEXT.FEATURES.LINE1}
            <br />
            {PAGE_TEXT.FEATURES.LINE2}
          </>
      </div>
    </div>
  );
  //@@viewOff:render
}

//@@viewOn:exports
export default Features;
//@@viewOff:exports
