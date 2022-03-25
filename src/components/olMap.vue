<!--
 * @Author: your name
 * @Date: 2022-02-14 16:28:25
 * @LastEditTime: 2022-03-18 17:52:18
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
    import { Feature, Map, View } from 'ol'      // 地图实例方法、视图方法
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
    import {fromLonLat} from 'ol/proj';
    import Point from 'ol/geom/Point';
    import * as olInteraction from 'ol/interaction';
import { de } from 'element-plus/lib/locale';

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
            //天地图Token
            const mapToken='e0a1aa6cc57edf2692f9c53d4936a97e';
            //天地图矢量底图
            const baseMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://t{0-7}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk="+mapToken,
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            );
            //天地图矢量标注
            const labelMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://t{0-7}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk="+mapToken,
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            );
            //天地图卫星影像
            const satelliteMap:AnyObject =new TileLayer(
                {
                    source: new XYZ({
                        url: "http://t3.tianditu.com/DataServer?T=img_c&x={x}&y={y}&l={z}&tk="+mapToken,
                        projection: 'EPSG:4326'
                    }),
                    //图层容器层级
                    zIndex: 1,
                }  
            );
            //地图定制
            let customizationMap:AnyObject =ref()
            
            /**
            * @description: 地图创建
            * @param {*} :
            * @return {*} :地图对象
            */
            const addMap=():void=>{
                state.layers.push(baseMap);
                state.layers.push(labelMap);
                state.layers.push(satelliteMap);
                state.map= new Map({
                    target: 'map',
                    layers:state.layers,
                    view: new View({
                        center:[104.06387329101562,30.670990790779168],//中心点(wkt形式撒点使用)
                        projection: 'EPSG:4326',//(wkt形式撒点使用)
                        zoom:11,    //初始化地图级别
                        rotation:0, //地图旋转弧度，默认为0，最大2π
                        minZoom: 3,
                        maxZoom: 20,
                    }),
                })
                baseMap.setVisible(true);
                labelMap.setVisible(true);
                satelliteMap.setVisible(false);
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
                        satelliteMap.setVisible(false);
                    break;
                    case 1:
                        baseMap.setVisible(false);
                        labelMap.setVisible(false);
                        satelliteMap.setVisible(true);
                }
                return state.map;
            }

            /**
            * @description: 撒点
            * @param {*} :WKT数据
            * @return {*} :
            */
            const addPoint=(data:AnyObject,msg:String):void=>{
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
                    if(i===0 && msg==''){
                        setInitialize()
                    }else{
                        layersFly(pointAll[i].location)
                    }
                    let coordinate:Array<any>= fromLonLat(pointAll[i].location,'EPSG:4326');
                    let newFeature:AnyObject=new Feature({
                        geometry:new Point(coordinate)
                    })
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
                    newFeature.setStyle(style);
                    state.pointAll.getSource().addFeature(newFeature);
                }
                
                
                return state.pointAll
            }
            
            /**
            * @description: 视角飞行
            * @param {*} :坐标
            * @return {*} :
            */
            const layersFly=(coor:Array<Number>):void=>{
                state.map.getView().animate({
                    center: coor,
                    zoom: 12,
                    duration: 600,
                });
                return
            }

            //清除撒点图层
            const clearLayers=():void=>{
                if(state.pointAll!=null){
                    state.pointAll.getSource().clear();
                }
                return state.pointAll;
            }

            //测距
            const lengthMeasure=():void=>{
                if(state.measure===true){
                    //vue3.0无法使用外部引入的删除测量功能 Measure.clearDraw()
                    state.map.getInteractions().forEach(function (interaction:AnyObject) {
                        if(interaction instanceof olInteraction.Draw){
                            state.map.removeInteraction(interaction);
                        }
                    });
                    Measure.deleteAllLayers(state.map);
                    state.measure=false;
                }
                state.measure=true;
                Measure.measure(state.map, 'LineString',()=>{
                });
                return;
            }

            //测面
            const areaMeasure=():void=>{
                if(state.measure===true){
                    //vue3.0无法使用外部引入的删除测量功能 Measure.clearDraw()
                    state.map.getInteractions().forEach(function (interaction:AnyObject) {
                        if(interaction instanceof olInteraction.Draw){
                            state.map.removeInteraction(interaction);
                        }
                    });
                    Measure.deleteAllLayers(state.map);
                    state.measure=false;
                }
                state.measure=true;
                Measure.measure(state.map, 'Polygon',()=>{
                });
                return;
            }

            //清除地图绘画
            const clearDraw=():void=>{
                //清除测量工具
                if(state.measure===true){
                    //vue3.0无法使用外部引入的删除测量功能 Measure.clearDraw()
                    state.map.getInteractions().forEach(function (interaction:AnyObject) {
                        if(interaction instanceof olInteraction.Draw){
                            state.map.removeInteraction(interaction);
                        }
                    });
                    Measure.deleteAllLayers(state.map);
                    state.measure=false;
                }
                //清除标绘工具
                if(state.plottingNow){
                    state.plottingSource.clear();
                    state.map.removeInteraction(state.plottingNow);
                }
                return;
            }

            /**
            * @description: 地图标绘
            * @param {*} :类型(点、线、面)
            * @return {*} :
            */
            const plotting=(type:string):void=>{
                Measure.clearDraw(state.map);
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
            const mapClick=():void=>{
                state.map.on('singleclick',function(e:AnyObject) {
                    return console.log(e.coordinate)
                })
            }

            //视野初始化
            const setInitialize=():void=>{
                state.map.getView().animate({
                    center: [104.06387329101562,30.670990790779168],
                    zoom: 11,
                    duration: 600,
                });
                return
            }

            //地图缩放获取当前层级
            const move=():void=>{
                state.map.on('moveend', function () {
                    let zoom = state.map.getView().getZoom();  //获取当前地图的缩放级别
                    zoom=parseInt(zoom)
                    context.emit('change',zoom)
                });
                return;
            }

            /**
            * @description: 地图定制
            * @param {*} :底图属性
            * @return {*} :
            */
            const customizationFn=(data)=>{
                let url:string
                if((data.input1+'').indexOf(',')===-1){
                    return
                }else{
                    let center=(data.input1+'').split(',')
                    layersFly([Number(center[0]),Number(center[1])])
                }
                if(data.radio0==='无'){
                    url=data.input0
                }else{
                    url=data.input0+'.'+data.radio0
                }
                
                if(customizationMap!=undefined){
                    state.map.removeLayer(customizationMap)
                }
                //地图定制
                customizationMap=new TileLayer(
                    {
                        source:new XYZ({
                            url,
                            projection: data.select0
                        }),
                        //图层容器层级
                        zIndex: 997,
                    });
                customizationMap.set('id','customization')
                state.map.addLayer(customizationMap)
            }

            //清除地图定制
            const removeCustomizationFn=():void=>{
                state.map.removeLayer(customizationMap)
            }

            //挂载结束时
            onMounted(()=>{
                addMap()
                mapClick()
                move()
            })
            
            return{
                ...toRefs(state),
                mapToken,
                baseMap,
                labelMap,
                satelliteMap,
                customizationMap,
                addPoint,
                layersFly,
                checkedLayer,
                clearLayers,
                lengthMeasure,
                areaMeasure,
                clearDraw,
                plotting,
                mapClick,
                setInitialize,
                move,
                customizationFn,
                removeCustomizationFn
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