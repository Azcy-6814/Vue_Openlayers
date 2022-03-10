<!--
 * @Author: your name
 * @Date: 2022-02-14 15:14:09
 * @LastEditTime: 2022-03-10 16:56:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\views\Home.vue
-->
<template>
  <div class="home" id="homeBox">
        <!-- 地图组件 -->
        <Map ref="mapFn" @change='getZoom'> </Map>
        <!-- 底图选择组件 -->
        <CheckMap @change='checkLayer'></CheckMap>
        <!-- 撒点组件 -->
        <!-- <GetPoint @change='addPoint'></GetPoint> -->
        <!-- 地图工具组件 -->
        <MapTools @change='Tools'></MapTools>
        <!-- 地图搜索组件 -->
        <SearchBox @change="addPoint"></SearchBox>
        <!-- 当前地图层级 -->
        <div class="zoom">
            <div>
                层级:{{zoom}}
            </div> 
        </div>
        <!-- 初始化视野 -->
        <div class="initialize" @click="initializeFly">
            <div>
                <BankOutlined/>
            </div>    
        </div>   
  </div>
</template>

<script lang="ts">
    export interface AnyObject { [key: string]: any }
    import { ref, onMounted ,reactive,toRefs,defineComponent } from 'vue' // vue相关方法
    import "@/assets/scss/home/home.scss";
    import Map from '@/components/olMap.vue';//引入地图组件
    import CheckMap from '@/components/home/checkMap/checkMap.vue';//引入底图选择组件
    // import GetPoint from '@/components/home/addPoint/addPoint.vue';//引入撒点组件
    import MapTools from '@/components/home/mapTools/mapTools.vue';//引入地图工具组件
    import SearchBox from '@/components/home/search/search.vue';//引入搜索POI组件
    import {
        BankOutlined,
    } from '@ant-design/icons-vue';
    const mapFn:any = ref('')
    let state:AnyObject = reactive({
        //获取public文件夹
        baseURL:process.env.BASE_URL,
        zoom:'11',
    })
    export default defineComponent({
        components: {
            Map,
            CheckMap,
            // GetPoint,
            MapTools,
            SearchBox,
            BankOutlined
        },
        setup(){
            /**
            * @description: 底图选择
            * @param {*} i 循环创建dom的下标
            * @return {*} 地图组件显隐图层
            */
            const checkLayer=(i:Number):void=>{
                return mapFn.value.checkedLayer(i)
            }

            /**
            * @description: 撒点
            * @param {*} data wkt数据
            * @return {*} 地图组件添加撒点图层
            */
            const addPoint=(data:AnyObject):void=>{
                if(data!=null){
                    return mapFn.value.addPoint(data)
                }
            }

            /**
            * @description: 工具选择
            * @param {*} 
            * @return {*} :调用地图组件对应方法
            */
            const Tools=(type:string):void=>{
                switch (type){
                    case '测距':
                        mapFn.value.lengthMeasure()
                        break
                    case '测面':
                        mapFn.value.areaMeasure()
                        break
                    case '标记':
                        mapFn.value.plotting('标记')
                        break
                    case '绘线':
                        mapFn.value.plotting('绘线')
                        break
                    case '绘面':
                        mapFn.value.plotting('绘面')
                        break
                    case '清除':
                        mapFn.value.clearDraw()
                        break
                }
            }

            /**
            * @description: 视野初始化
            * @param {*} 
            * @return {*} :调用地图组件对应方法
            */
            const initializeFly=():void=>{
                return mapFn.value.setInitialize()
            }

            /**
            * @description: 获取当前层级
            * @param {*} :地图组件返回的当前层级
            * @return {*} :
            */
            const getZoom=(data:string)=>{
                return state.zoom=data
            }

            onMounted(()=>{
                
            })
            return{
                ...toRefs(state),
                mapFn,
                addPoint,
                checkLayer,
                Tools,
                initializeFly,
                getZoom
            }
        }
    })
</script>

