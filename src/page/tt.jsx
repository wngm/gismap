/*
 * @Author: wengqi wengqi925@163.com
 * @Date: 2022-08-23 09:17:14
 * @LastEditors: wengqi wengqi925@163.com
 * @LastEditTime: 2022-08-24 08:51:00
 * @FilePath: /GisMap/src/page/tt.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
        <img src={bottom} alt="" />
        <div className="box-inline">
          {/* <img src={back} alt="" /> */}
          <img src={left} alt="" />
        </div>
        <div
          className="box-inline"
          style={{ width: "400px", top: "0px", left: 0 }}
        >
          {/* <img src={back} alt="" /> */}
          {/* <img src={left} alt="" /> */}
          <img src={right} alt="" />
        </div>
      </div>
    </>
  );
}

// 3.渲染react元素
const root = createRoot(document.getElementById("app"));
root.render(<Content />);
