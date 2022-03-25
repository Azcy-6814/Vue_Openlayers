<!--
 * @Author: your name
 * @Date: 2022-03-15 11:35:56
 * @LastEditTime: 2022-03-17 17:43:00
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\components\button.vue
-->
<template>
    <div class="buttonBox">
        <el-button
        class="Button"
        :type='v.type'
        :size='v.size' 
        :disabled='v.disabled' 
        :plain='v.plain'
        :round='v.round'
        :circle='v.circle'
        :loading='v.loading'
        :autofocus='v.autofocus'
        :auto-insert-space='v.autoInsertSpace'
        v-for="(v,i) in btnMsg" :key="i"
        @click="change(v.title)"
        >{{v.title}}</el-button>
    </div>
</template>
<script lang="ts">
    import { ref, onMounted ,reactive,toRefs,defineComponent} from 'vue' // vue相关方法
    import {ElButton} from 'element-plus'
    interface AnyObject {[key: string]: any}
    interface BtnObject {[key: string]:string|boolean|void}
    type msg=Array<BtnObject>
    let state:AnyObject=reactive({
        btnMsg:[{
            title:'测试',//按钮内容
            size:'default',//尺寸:large / default /small
            type:'primary',//按钮类型:primary / success / warning / danger / info / text
            disabled:false,//是否为禁用状态
            icon:null,//icon小图标
            plain:true,//是否为朴素按钮
            round:false,//是否为圆角按钮
            circle:false,//是否为圆形按钮
            loading:false,//是否为加载中状态
            loadingIcon:null,//自定义加载中图标
            autofocus:false,//原生 autofocus 属性
            nativeType:null,//原生 type 属性
            autoInsertSpace:false,//自动在两个中文字符之间插入空格	
        }],
    })
    export default defineComponent({
        components:{
            ElButton
        },
        setup(prop,context){
            /**
            * @description: 获取按钮定制信息
            * @param {*} : 按钮定制信息
            * @return {*} :
            */
            const getButtonContent=(data:msg):void=>{
                state.btnMsg=data
                return
            }
            /**
            * @description: 按钮点击事件
            * @param {*} : 按钮的名称
            * @return {*} :
            */
            const change=(data:string)=>{
                context.emit('change',data)
            }
            return{
                ...toRefs(state),
                getButtonContent,
                change,
            }
        },
    })
    
</script>

<style lang='scss' scope>
    .Button{
        .Button{
            float: left;
        }
    }
</style>