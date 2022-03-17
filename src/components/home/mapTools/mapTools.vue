<!--
 * @Author: your name
 * @Date: 2022-03-03 13:49:22
 * @LastEditTime: 2022-03-15 13:51:32
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\home\mapTools\mapTools.vue
-->
<template>
    <div class="mapTools" id="mapTools">
        <!-- 撒点功能 -->
        <div class="mapToolsBox">
        <a-dropdown v-for="(v,i) in htmlTree" :key="i">
            <p class="ant-dropdown-link title" @click="clear(v.name)">{{v.name}}</p>
            <template #overlay>
            <a-menu v-if="v.children!=null">
                <a-menu-item v-for="(v,i) in v.children" :key="i">
                    <a href="javascript:;" @click="change(v.name)">{{v.name}}</a>
                </a-menu-item>
            </a-menu>
            </template>
        </a-dropdown>
        </div>
        <Pop></Pop>
    </div>
</template>
<script lang='ts'>
import { defineComponent,VNodeChild } from 'vue'
export interface AnyObject { [key: string]: any }
import { ref, onMounted ,reactive,toRefs } from 'vue' // vue相关方法
import {Dropdown,Menu} from 'ant-design-vue'//安装2.1.3版本
import Pop from '@/components/home/mapTools/components/pop.vue'
let state:AnyObject = reactive({
    baseURL:process.env.BASE_URL,//获取public文件夹
})
export default defineComponent({
    components: {
        ADropdown:Dropdown,
        AMenu:Menu,
        AMenuItem:Menu.Item,
        Pop
    },
    setup(props,context) {
        const htmlTree:Array<AnyObject>=[
            {
                name:'测量',
                children:[
                    {
                        name:'测距'
                    },
                    {
                        name:'测面'
                    }
                ]
            },
            {
                name:'标绘',
                children:[
                    {
                        name:'标记'
                    },
                    {
                        name:'绘线'
                    },
                    {
                        name:'绘面'
                    },
                ]
            },
            {
                name:'清除',
                children:null
            },
        ]

        /**
        * @description: 地图绘制清除
        * @param {*} 
        * @return {*} :
        */
        const clear=(type:string)=>{
            if(type==='清除'){
                context.emit('change',type)
            }
            
        }

        /**
        * @description: 地图工具功能选择
        * @param {*} 
        * @return {*} :功能名称
        */
        const change=(type:string)=>{
            context.emit('change',type)
        }

        return{
            ...toRefs(state),
            htmlTree,
            clear,
            change
        }
    },
})
</script>
<style lang='scss' scope>
    .mapTools{
        .mapToolsBox{
            width: auto;
            height: 34px;
            background: rgba(255,255,255,1);
            position: absolute;
            right: 14px;
            top: 14px;
            .title{
                cursor: pointer;
                width: 60px;
                height: 24px;
                border-right: 1px solid #797878;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                margin-top: 5px;
                float: left;
                color: #797878;
            }
            .title:last-child{
                border-right: none;
            }
        }
    }
</style>