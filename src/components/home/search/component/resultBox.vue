<!--
 * @Author: your name
 * @Date: 2022-03-10 09:51:00
 * @LastEditTime: 2022-03-10 15:12:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\components\home\search\component\resultBox.vue
-->
<template>
    <div class="resultBox" v-if="haveResult">
        <ul>
            <li v-for="i in listData" :key="i" :title="i">{{i}}</li>
        </ul>
        <a-pagination :total="total" size="small" @change='onChange'/>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,toRefs,ref} from 'vue'
import {Pagination} from 'ant-design-vue'//安装2.1.3版本
export interface AnyObject { [key: string]: any }
let state:AnyObject = reactive({
    baseURL:process.env.BASE_URL,//获取public文件夹
    listData:[],//搜索结果
    haveResult:false,
    total:'',//总页数
})
export default defineComponent({
    components: {
        APagination:Pagination
    },
    setup(props,context) {
        /**
        * @description: 渲染搜索结果
        * @param {*} :data(高德搜索数据结果),total(结果总条数)
        * @return {*} 
        */
        const getData=(data:AnyObject,total:string):void=>{
            state.listData=[]
            for(let i=0;i<data.length;i++){
                state.listData.push(data[i].pname+data[i].cityname+data[i].address+data[i].name)
            }
            state.total=total
            state.haveResult=true
            return
        }

        /**
        * @description: 翻页
        * @param {*} :page(ant方法自带参数当前页),pageSize(ant方法自带参数单页总条数)
        * @return {*} :调用父组件翻页方法
        */
        const onChange=(page, pageSize):void=>{
            return context.emit('change',page)
        }

        return{
            ...toRefs(state),
            getData,
            onChange
        }
    },
})
</script>
<style lang='scss' scoped>
    .resultBox{
        width: 300px;
        height: 360px;
        position: absolute;
        left: 0;
        top: 34px;
        background: #fff;
        box-sizing: border-box;
        padding: 2px 0 0 12px;
        ul{
            li{
                list-style: none;
                white-space: nowrap;
                /*设置不换行*/
                overflow: hidden;
                /*设置溢出隐藏*/
                text-overflow: ellipsis;
                /*文本隐藏设置省略号*/
                cursor: pointer;
                font-size: 14px;
                margin-top: 8px;
            }
        }
        .ant-pagination{
            position: absolute;
            left: 6px;
            bottom: 14px;
        }
    }
</style>
