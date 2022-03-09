<!--
 * @Author: your name
 * @Date: 2022-03-03 11:34:09
 * @LastEditTime: 2022-03-03 15:57:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\home\addPoint\addPoint.vue
-->
<template>
  <div class="addPoint" id="addPoint">
        <!-- 撒点功能 -->
        <button class="btn" @click="addPoint">{{buttonState}}</button>
  </div>
</template>
<script lang='ts'>
export interface AnyObject { [key: string]: any }
// import "@/assets/scss/home/addPoint.scss";
import { defineComponent } from 'vue'
import { ref, onMounted ,reactive,toRefs } from 'vue' // vue相关方法
import axios from 'axios';
let state:AnyObject = reactive({
    baseURL:process.env.BASE_URL,//获取public文件夹
    buttonState:'撒点',
})
export default defineComponent({
    setup(props,context) {
        //获取撒点wkt
        const wkt:string=`${state.baseURL}json/pointAll.json`

        /**
        * @description: 添加撒点图层或清除撒点图层
        * @param {*} 
        * @return {*} 根据撒点或清除触发地图添加图层或清除功能
        */
        const addPoint=():void=>{
            if(state.buttonState=='撒点'){
                state.buttonState='清除'
                axios.get(wkt).then((res)=>{
                    let data:AnyObject=res.data
                    context.emit('change',data)
                })
            }else{
                state.buttonState='撒点'
                context.emit('change',null)
            }
        }
        
        return{
            ...toRefs(state),
            wkt,
            addPoint
        }
    },
})
</script>
<style lang="scss" scope>
    .addPoint{
        .btn{
            position: absolute;
            top: 2%;
            left: 45%;
            cursor: pointer;
        }
    }
</style>   