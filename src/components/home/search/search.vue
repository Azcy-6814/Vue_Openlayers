<!--
 * @Author: your name
 * @Date: 2022-03-09 13:38:59
 * @LastEditTime: 2022-03-15 13:45:10
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\components\home\search\search.vue
-->
<template>
    <div class="searchBox">
        <a-input-search
        v-model:value="InputValue"
        placeholder="搜兴趣点、建筑物、门牌号、道路线"
        enter-button
        :allowClear=true
        @search="onSearch"/>
        <!-- 搜索组件 -->
        <Result ref="ResultBox" @change="onChange"></Result>

    </div>
</template>
<script lang='ts'>
export interface AnyObject { [key: string]: any }
import {searchPoi} from '@/api'
import { ref, onMounted ,reactive,toRefs,defineComponent } from 'vue'
import {Input} from 'ant-design-vue'//安装2.1.3版本
import Result from '@/components/home/search/component/resultBox.vue'
let state:AnyObject = reactive({
    baseURL:process.env.BASE_URL,//获取public文件夹
    page:1,//当前页
    GaoDeKey:'effe3c36fc3cb26fa21c53dea6e26c10',//高德搜索key(高德开放平台获取),
    haveResult:false,
})
const ResultBox:any=ref('')
export default defineComponent({
    components: {
        AInputSearch:Input.Search,
        Result
    },
    setup(props,context) {
        //输入框内容
        const InputValue = ref<string>('');

        /**
        * @description: 搜索
        * @param {*} 
        * @return {*} 调用搜索结果组件
        */
        const onSearch = ():void => {
            searchPoi({
                keywords:InputValue.value==''?'成都':InputValue.value,//搜索内容
                offset:10,//单页最大条数
                page:state.page,//当前页
                key:state.GaoDeKey,//高德key
            }).then((res:AnyObject)=>{
                 let data:AnyObject=res.data
                 let pointAll=[]
                 if(data.pois.length>0){
                    let msg:Array<AnyObject>=JSON.parse(JSON.stringify(data.pois))
                    ResultBox.value.getData(msg,data.count)
                    for(let i=0;i<msg.length;i++){
                        if(msg[i].location){
                            let arr=msg[i].location.split(',')
                            pointAll.push({name:msg[i].name,location:[Number(arr[0]),Number(arr[1])]})
                        }
                    }
                    return context.emit('change',pointAll,InputValue.value)
                }
            })
            return
        };

        /**
        * @description: 翻页
        * @param {*} :ant方法自带参数当前页
        * @return {*} 调用搜索方法
        */
        const onChange= (page):void=>{
            state.page=page
            onSearch()
            return
        }
        return {
            ...toRefs(state),
            ResultBox,
            InputValue,
            onSearch,
            onChange
        };
    },
})
</script>
<style lang='scss' scope>
    .searchBox{
        width: 300px;
        height: 50px;
        position: absolute;
        left: 12px;
        top: 12px;
    }
    
</style>
