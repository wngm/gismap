import GisMap from "../code/gisMap";
import * as Cesium from "@modules/cesium/Source/Cesium";
import React,{useState,useCallback} from 'react'
import {createRoot} from 'react-dom/client';
import "./index.less"
// window['CESIUM_BASE_URL'] = '/static/Cesium'
let gisMap = new GisMap('cesium');

window.gisMap = gisMap
gisMap.cSetView({
    longitude:104.06836,
    latitude:30.60,
    altitude:800,
    pitch:-45.0

})

const Content =()=>{

    const [name,setName]= useState('测试')
    const [latitude,setLatitude]= useState(30.60)
    const [longitude,setLongitude]= useState(104.06836)
    const [altitude,setAltitude]= useState(800)
    const [labelName,setLabelName]= useState('测试点')
    const [tip,setTip]= useState('')

    const setView=useCallback(()=>{
        gisMap.cSetView({
            longitude:Number(longitude),
            latitude:Number(latitude),
            altitude:Number(altitude),
            pitch:-45.0
        
        })
    },[latitude,longitude,altitude])

    const test = ()=>{

        let points =[
            [104.06834473029204, 30.644507622074453, 10],
            [104.06835473784035, 30.641167540489427, 10],
            [104.0649213449914, 30.641261363072736, 10],
            [104.0652037488406, 30.640307797224754, 10],
            [104.06842086951482, 30.600165370177698, 10],
        ]
        gisMap.drawPolyLine(points,{width:6, color:'#0099cc'})
    }
    const test2 = ()=>{

        let points =[
            [104.06814473029204, 30.644507622074453, -20],
            [104.06815473784035, 30.641167540489427, -20],
            [104.0646213449914, 30.641261363072736, -20],
            [104.0650037488406, 30.640307797224754, -20],
            [104.06822086951482, 30.600165370177698, -20],
        ]
        gisMap.drawPolyLine(points,{width:6, color:'#990000'})
    }

    const test3 =()=>{
        gisMap.viewer.scene.globe.depthTestAgainstTerrain = false

    }
    const test4 =()=>{
        gisMap.viewer.scene.globe.depthTestAgainstTerrain = true

    }
    return (<div className="box">
        <div>
            <div>
                <span>经度</span><input type="number" value={longitude} onChange={(e)=>setLongitude(e.target.value)}/> 
            </div>
            <div>
                <span>纬度</span><input type="number" value={latitude} onChange={(e)=>{setLatitude(e.target.value)}}/> 
            </div>
            <div>
                <span>高度</span><input type="number" value={altitude} onChange={(e)=>setAltitude(e.target.value)}/> 
            </div>
        </div>
        <div className="btn" onClick={setView}>设置显示</div>         
        <div className="btn" onClick={test}>管道</div>      
        <div className="btn" onClick={test2}>地下管道</div>      
        <div className="btn" onClick={test3}>地下可视</div>      
        <div className="btn" onClick={test4}>地下隐藏</div>      
    
    </div>)

}

// 3.渲染react元素
const root = createRoot( document.getElementById('app'))
root.render(<Content />)
