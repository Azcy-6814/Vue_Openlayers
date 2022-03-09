<!--
 * @Author: your name
 * @Date: 2022-02-14 16:28:25
 * @LastEditTime: 2022-03-08 18:00:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\olMap.vue
-->
<template>
  <div class="map" id="map">
  </div>
</template>

<script lang='ts'>
    export interface AnyObject { [key: string]: any }
    import Measure from '@/components/home/mapTools/src/mapFunction.js'
    import { ref, onMounted ,reactive,toRefs,defineComponent} from 'vue' // vue相关方法
    import { Map, View } from 'ol'      // 地图实例方法、视图方法
    import XYZ from 'ol/source/XYZ';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js'
    import WKT from 'ol/format/WKT';
    import 'ol/ol.css'                 // 地图样式
    import VectorSource from 'ol/source/Vector';
    import Style from 'ol/style/Style';
    import Icon from 'ol/style/Icon';
    import Text from 'ol/style/Text';
    import Fill from 'ol/style/Fill';
    import Stroke from "ol/style/Stroke";
    import Circle from 'ol/style/Circle';
    import Draw from 'ol/interaction/Draw';

    //获取public文件夹
    const baseURL = process.env.BASE_URL;

    //数据存储
    let state:AnyObject= reactive({
        pointImage:baseURL+'image/location_active_icon.png',//点标记图片
        layers:[],//底图容器
        map:null,//地图对象
        nowMap:0,//底图切换标识
        pointAll:null,//撒点点图层对象
        measure:false,//地图工具测量是否启用
        plottingLayer:null,//地图标绘工具图层
        plottingSource:null,//地图标绘工具图层源
        plottingNow:null,//当前使用的绘制工具
    })

    export default defineComponent({
        setup(props,context){
            //天地图矢量底图
            const baseMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://t{0-7}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=e0a1aa6cc57edf2692f9c53d4936a97e",
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            )
            //天地图矢量标注
            const labelMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=e0a1aa6cc57edf2692f9c53d4936a97e",
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            )
            //地图定制
            const customizationMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://222.73.139.7:8081/tileMap/services/MapServer/ms5953e37086/tile/{z}/{y}/{x}",
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            )

            /**
            * @description: 地图创建
            * @param {*} :
            * @return {*} :地图对象
            */
            const addMap=():void=>{
                state.layers.push(baseMap);
                state.layers.push(labelMap);
                state.layers.push(customizationMap);
                state.map= new Map({
                    target: 'map',
                    layers:state.layers,
                    view: new View({
                        // center:[93.6814904389711, 31.480876176873185],//中心点(wkt形式撒点使用)
                        center:[120.31, 36.52],//中心点(wkt形式撒点使用)
                        projection: 'EPSG:4326',//(wkt形式撒点使用)
                        zoom:16,    //初始化地图级别
                        rotation:0, //地图旋转弧度，默认为0，最大2π
                        minZoom: 3,
                        maxZoom: 18,
                    }),
                })
                baseMap.setVisible(true);
                labelMap.setVisible(true);
                customizationMap.setVisible(false);
                return state.map;
            }

            /**
            * @description: 底图切换
            * @param {*} :点击div的下标
            * @return {*} :
            */
            const checkedLayer=(i:Number):void=>{
                state.nowMap=i
                switch(i){
                    case 0:
                        baseMap.setVisible(true);
                        labelMap.setVisible(true);
                        customizationMap.setVisible(false);
                        state.map.getView().setZoom(16);
                        state.map.getView().setCenter([93.6814904389711, 31.480876176873185]);
                    break;
                    case 1:
                        baseMap.setVisible(false);
                        labelMap.setVisible(false);
                        customizationMap.setVisible(true);
                        state.map.getView().setZoom(10);
                        state.map.getView().setCenter([94.20516180623038, 31.72198193440369]);
                }
                return state.map;
            }

            /**
            * @description: 撒点
            * @param {*} :WKT数据
            * @return {*} :
            */
            const addPoint=(data:AnyObject):void=>{
                const pointAll:AnyObject=JSON.parse(JSON.stringify(data));

                if(state.pointAll!=null){
                    state.pointAll.getSource().clear();
                }

                state.pointAll=new VectorLayer({
                    source:new VectorSource({
                        features:[],
                    }),
                    zIndex: 999,
                });

                state.map.addLayer(state.pointAll);
                
                for(let i=0;i<pointAll.length;i++){
                    const format:AnyObject = new WKT();
                    const wkt:string=pointAll[i].geo;
                    const style:AnyObject=new Style({
                        image:new Icon({
                            src: state.pointImage,
                            anchor: [0.5, 0.9],
                        }),
                        text:new Text({
                            textAlign: 'center',     //对齐方式
                            textBaseline: 'middle',    //文本基线
                            font: 'normal 12px 微软雅黑',     //字体样式
                            text: pointAll[i].name,    //文本内容
                            offsetY: -30,    // Y轴偏置
                            fill: new Fill({        //填充样式
                                color: '#ffffff'
                            }),
                            backgroundFill: new Fill({      // 填充背景
                                color: '#95c5f8',
                            }),
                            padding: [1, 4, 1, 4],
                        })
                    });
                    const feature:AnyObject = format.readFeature(wkt, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:4326',
                    });
                    feature.setStyle(style);
                    state.pointAll.getSource().addFeature(feature);
                }
                return state.pointAll
            }

            //清除撒点图层
            const clearLayers=():void=>{
                if(state.pointAll!=null){
                    state.pointAll.getSource().clear();
                }
                return state.pointAll;
            }

            //测距
            const lengthMeasure=()=>{
                Measure.clearDraw(state.map);
                state.measure=true;
                Measure.measure(state.map, 'LineString',()=>{
                });
                return;
            }

            //测面
            const areaMeasure=()=>{
                Measure.clearDraw(state.map);
                state.measure=true;
                Measure.measure(state.map, 'Polygon',()=>{
                });
                return;
            }

            //清除地图绘画
            const clearDraw=()=>{
                //清除测量工具
                if(state.measure===true){
                    Measure.deleteAllLayers(state.map);
                    state.measure=false;
                }
                //清除标绘工具
                if(state.plottingNow){
                    state.plottingSource.clear();
                    state.map.removeInteraction(state.plottingNow);
                }
            }

            /**
            * @description: 地图标绘
            * @param {*} :类型(点、线、面)
            * @return {*} :
            */
            const plotting=(type:string)=>{
                if(state.plottingSource==null){
                    state.plottingSource= new VectorSource();
                    state.plottingLayer=new VectorLayer({
                        source:state.plottingSource,
                        style:new Style({
                            fill: new Fill({               //填充样式
                                color: 'rgba(255, 255, 255, 0.2',
                            }),
                            stroke: new Stroke({           //线样式
                                color: '#00c033',
                                width: 2,
                            }),
                            image: new Circle({            //点样式
                                radius: 7, 
                                fill: new Fill({
                                    color: '#00c033',
                                }),
                            })
                        }),
                        zIndex:999,
                    })
                    state.map.addLayer(state.plottingLayer);
                }else{
                    if(state.measure===true){
                        Measure.deleteAllLayers(state.map);
                        state.measure=false;
                    }
                    state.map.removeInteraction(state.plottingNow);
                }
                switch(type){
                    case '标记':
                        state.plottingNow=new Draw({
                            source:state.plottingSource,
                            type:'Point',
                        })
                        state.map.addInteraction(state.plottingNow);
                        break;
                    case '绘线':
                        state.plottingNow=new Draw({
                            source:state.plottingSource,
                            type:'LineString',
                        })
                        state.map.addInteraction(state.plottingNow);
                        break;
                    case '绘面':
                        state.plottingNow=new Draw({
                            source:state.plottingSource,
                            type:'Polygon',
                        })
                        state.map.addInteraction(state.plottingNow);
                        break;
                }
            }

            //地图添加点击事件
            const mapClick=()=>{
                state.map.on('singleclick',function(e) {
                    console.log(e.coordinate)
                })
            }

            //挂载结束时
            onMounted(()=>{
                addMap()
                mapClick()
            })
            
            return{
                ...toRefs(state),
                baseMap,
                labelMap,
                customizationMap,
                addPoint,
                checkedLayer,
                clearLayers,
                lengthMeasure,
                areaMeasure,
                clearDraw,
                plotting,
                mapClick
            }
            
        }
    })
    
</script>

<style lang="scss">
    .map{
        width: 100vw;
        height: 100vh;
    }
    .ol-zoom{
        position: absolute;
        top: 85%;
        left: 98%
    }
</style>