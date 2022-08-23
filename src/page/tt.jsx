import React from "react";
import { createRoot } from "react-dom/client";
import GisMap from "../code/gisMap";
import "./index.less";
import left from "../assets/images/skybox/00h+00.jpg";
import right from "../assets/images/skybox/12h+00.jpg";
import top from "../assets/images/skybox/06h-90.jpg";
// import top from "../assets/images/skybox/top.jpg";
// import bottom from "../assets/images/skybox/06h+90.jpg";
import bottom from "../assets/images/skybox/06h+90.jpg";
import front from "../assets/images/skybox/18h+00.jpg";
import back from "../assets/images/skybox/06h+00.jpg";

function Content() {
  return (
    <>
      <div className="box" style={{ width: "400px" }}>
        <img src={bottom} alt="" />
        <img src={back} alt="" />
        <img src={top} alt="" />
        <img src={front} alt="" />
        <div className="box-inline">
          <img src={right} alt="" />
          <img src={back} alt="" />
          <img src={left} alt="" />
          <img src={front} alt="" />
          x
        </div>
      </div>
    </>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
