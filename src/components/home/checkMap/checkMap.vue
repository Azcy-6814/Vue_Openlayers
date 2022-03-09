<!--
 * @Author: your name
 * @Date: 2022-03-03 10:47:23
 * @LastEditTime: 2022-03-08 17:48:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\home\checkMap\checkMap.vue
-->
<template>
  <div class="checkMap" id="checkMap">
        <!-- 当前底图 -->
        <div class="mapBox" @click="showMapBox">
            <span :class="checked" :style="{background:mapImage}"></span>
            <span class="title">{{mapActive[checkedNum].name}}</span>
        </div>
        <!-- 底图切换 -->
        <div class="layersBox" :style="{width:mapActive.length*52+'px'}" v-show="showBox==1">
            <div v-for="(item, index) in mapActive" :key="index" class="layers" :style="{background:mapImage,backgroundPosition:showLayerBox[index]}" @click="checkLayer(index)">
                <div class="title">{{mapActive[index].name}}</div>
            </div>
        </div>
  </div>
</template>
<script lang='ts'>
export interface AnyObject { [key: string]: any }
// import "@/assets/scss/home/checkMap.scss";
import { defineComponent,ref, onMounted ,reactive,toRefs } from 'vue'
let state:AnyObject = reactive({
    //获取public文件夹
    baseURL:process.env.BASE_URL,
    //地图选择菜单显隐
    showBox:0,
    //底图容器
    mapActive:[
        {
            class:'dzdt',
            name:'电子地图',
        },
        {
            class:'wxyx',
            name:'卫星影像',
        },
    ],
    //当前底图
    checked:'dzdt',
    checkedNum:0,
    //显示可选图层
    showLayerBox:[],
})
export default defineComponent({
    setup(props,context) {
        //底图雪碧图
        const mapImage:string=`url(${state.baseURL}image/map_layer_icons.png)`
        
        /**
        * @description: 可选图层
        * @param {*} 
        * @return {*} 
        */
        const showLayer=():void=>{
            for(let i=0;i<state.mapActive.length;i++){
                state.showLayerBox.push(`left ${i*-50}px`)
            }
            return state.showLayerBox
        }

        /**
        * @description: 地图切换菜单显隐
        * @param {*} 
        * @return {*} 
        */
        const showMapBox=():void=>{
            state.showBox=!state.showBox
            return state.showBox
        }

        /**
        * @description: 底图选择
        * @param {*} i 循环创建dom的下标
        * @return {*} 调用home页面底图选择方法
        */
        const checkLayer=(i:Number):void=>{
            return context.emit('change',i );
        }
        
        onMounted(()=>{
            showLayer()
        })
        return{
            ...toRefs(state),
            mapImage,
            showLayer,
            showMapBox,
            checkLayer
        }
    },
})
</script>
<style lang='scss' scope>
    .checkMap{
        .mapBox{
            width: 52px;
            height: 50px;
            position: absolute;
            right: 10px;
            bottom: 20px;
            border: 2px solid #000;
            cursor: pointer;
            .dzdt{
                width: 100%;
                height: 100%;
                display:block;
                background-position: left 0;
            }
            .wxyx{
                width: 100%;
                height: 100%;
                display:block;
                background-position: left -50;
            }
            .title{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                font-size: 6px;
                color: #fff;
                display: block;
                background: rgba(0,0,0,.5);
                text-align: center;
            }
        }
        .layersBox{
            height: 50px;
            border: 2px solid #000;
            position: absolute;
            right: 70px;
            bottom: 20px;
            .layers{
                position: relative;
                left: 0;
                top: 0;
                width: 50px;
                height: 50px;
                float: left;
                // margin-right: 8px;
                cursor: pointer;
                .title{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    font-size: 9px;
                    color: #fff;
                    display: block;
                    background: rgba(0,0,0,.5);
                    text-align: center;
                }
            }
            .layers:last-child{
                margin-right: 0px;
            }
        }
    }

</style>
