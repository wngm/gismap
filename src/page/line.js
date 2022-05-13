import GisMap from "../code/gisMap";
import * as Cesium from "@modules/cesium/Source/Cesium";
import React,{useState,useCallback} from 'react'
import {createRoot} from 'react-dom/client';
import "./index.less"
// window['CESIUM_BASE_URL'] = '/static/Cesium'
let gisMap = new GisMap('cesium');

window.gisMap = gisMap

const Content =()=>{

    const [name,setName]= useState('测试')
    const [latitude,setLatitude]= useState(30)
    const [longitude,setLongitude]= useState(100)
    const [altitude,setAltitude]= useState(1000000)
    const [labelName,setLabelName]= useState('测试点')
    const [tip,setTip]= useState('')

    const setView=useCallback(()=>{
        gisMap.cSetView({longitude:Number(longitude),latitude:Number(latitude),altitude:Number(altitude)})
    },[latitude,longitude,altitude])
    const drawMpoint=()=>{
       let point = gisMap.drawPoint(
           {
                name,
                pixelSize:60,
                color:'rgba(0,255,255,1)',
                longitude:Number(longitude),
                latitude:Number(latitude),
                altitude:Number(altitude),
                label:{
                    show:true,
                    text:labelName,
                    outlineColor:"#ff0000",
                    fillColor:'rgba(173, 255, 47,1)'
                },
                tip:{
                    show:true,
                    content:tip
                },
                menu:{
                    className:'test-menu',
                    show:true,
                    menuItems:[
                        {text:'编辑',type:'edit'},
                        {text:'展示详情',type:'detail'},
                        {text:'删除',type:'delete'},
                    ],
                    onSelect:(type,entity)=>{
                        console.log(`选择了 ${type}`,name)
                        if(type === 'delete'){
                            gisMap.remove(entity)
                        }
                    }
                }
            })
        console.log('new point ',point )
    }

    const test = ()=>{
   
        const start = {latitude:Number(latitude),longitude:Number(longitude),altitude:Number(altitude)}
        const ends = [[110,20,0],[100,10],[90,0,0],[70,20,0],[50,10,0]]

        ends.forEach(i=>{
            gisMap.drawLine(start,{longitude:i[0],latitude:i[1],altitude:i[2]},{


                menu:{
                    className:'test-menu',
                    show:true,
                    menuItems:[
                        {text:'编辑',type:'edit'},
                        {text:'展示详情',type:'detail'},
                        {text:'删除',type:'delete'},
                    ],
                    onSelect:(type,entity)=>{
                        console.log(`选择了 ${type}`,name)
                        if(type === 'delete'){
                            gisMap.remove(entity)
                        }
                    }
                }
            })

        })
    }
    return (<div className="box">
        <div>
            <div>
                <span>标签</span><input value={name} onChange={(e)=>setName(e.target.value)}/> 
            </div>
            <div>
                <span>经度</span><input type="number" value={longitude} onChange={(e)=>setLongitude(e.target.value)}/> 
            </div>
            <div>
                <span>纬度</span><input type="number" value={latitude} onChange={(e)=>{setLatitude(e.target.value)}}/> 
            </div>
            <div>
                <span>高度</span><input type="number" value={altitude} onChange={(e)=>setAltitude(e.target.value)}/> 
            </div>
            <div>
                <span>labelName</span><input value={labelName} onChange={(e)=>setLabelName(e.target.value)}/> 
            </div>
            <div>
                <span>tip</span><input value={tip} onChange={(e)=>setTip(e.target.value)}/> 
            </div>
            
        </div>
        <div className="btn" onClick={setView}>设置显示</div>    
        <div className="btn" onClick={drawMpoint}>绘点</div>      
        <div  className="btn" onClick={test}>测试</div>    
    </div>)

}

// 3.渲染react元素
const root = createRoot( document.getElementById('app'))
root.render(<Content />)
