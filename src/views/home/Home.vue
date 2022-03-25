<!--
 * @Author: your name
 * @Date: 2022-02-14 15:14:09
 * @LastEditTime: 2022-03-18 15:33:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\views\home\Home.vue
-->
<template>
  <div class="home" id="homeBox">
        <!-- 地图组件 -->
        <Map ref="mapFn" @change='getZoom'> </Map>
        <!-- 底图选择组件 -->
        <CheckMap @change='checkLayer'></CheckMap>
        <!-- 地图工具组件 -->
        <MapTools @change='Tools'></MapTools>
        <!-- 地图搜索组件 -->
        <SearchBox @change="addPoint"></SearchBox>
        <!-- 按钮组件 -->
        <Btn ref="btnFn" class="btn" @change="btnFunction"></Btn>
        <Pop ref="PopFn" @change="popFunction"></Pop>
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
    import MapTools from '@/components/home/mapTools/mapTools.vue';//引入地图工具组件
    import SearchBox from '@/components/home/search/search.vue';//引入搜索POI组件
    import Btn from '@/components/button.vue'
    import Pop from '@/components/Pop.vue'
    import { 
        BankOutlined,
    } from '@ant-design/icons-vue';
    const mapFn:any = ref('')
    const btnFn:any = ref('')
    const PopFn:any = ref('')
    let state:AnyObject = reactive({
        //获取public文件夹
        baseURL:process.env.BASE_URL,
        zoom:'11',
    })
    export default defineComponent({
        components: {
            Map,
            CheckMap,
            MapTools,
            SearchBox,
            BankOutlined,
            Btn,
            Pop
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
            * @param {*} :data(点位数据),msg(输入框内容)
            * @return {*} 地图组件添加撒点图层
            */
            const addPoint=(data:AnyObject,msg:String):void=>{
                if(data!=null){
                    return mapFn.value.addPoint(data,msg)
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
            const getZoom=(data:string):void=>{
                state.zoom=data
                return 
            }

            /**
            * @description: 按钮点击事件
            * @param {*} :点击按钮的名称
            * @return {*} :
            */
            const btnFunction=(data:string):void=>{
                switch(data){
                    case '地图定制':
                        PopFn.value.dialogFormVisible=true;//弹窗显隐
                        PopFn.value.popWidth='25%'//弹窗的宽度
                        PopFn.value.formLabelWidth='80px'//表单label的宽度
                        PopFn.value.popTitle='测试工具'//弹框标题
                        PopFn.value.showInput=true//input模块
                        PopFn.value.showSelect=true//select模块
                        PopFn.value.showRadio=true//radio模块
                        PopFn.value.popInput=[//盒子
                            {
                                label:'瓦片地址',//标题
                                model:'',//内容
                                placeholder:'http://123.456.789.12:8080/mapTile/Map/tile/{z}/{y}/{x}',//提示
                                clearable:true,//清空按钮
                                disabled:false,//禁用
                            },
                            {
                                label:'中心点',//标题
                                model:'',//内容
                                placeholder:'104.063873,30.670990',//提示
                                clearable:true,//清空按钮
                                disabled:false,//禁用
                            }
                        ]
                        PopFn.value.popOption=[//盒子
                            {
                                label:'投影坐标',//标题
                                popSelect:'',//结果
                                option:['EPSG:4326','EPSG:3857'],//选项
                                placeholder:'请选择',//提示
                            }
                        ]
                        PopFn.value.popRadio=[//盒子
                            {
                                label:'格式选择',//标题
                                value:'',//结果
                                option:[//选项
                                    {
                                        disabled:false,//是否禁用
                                        title:'无',//内容
                                    },
                                    {
                                        disabled:false,//是否禁用
                                        title:'JPG',//内容
                                    },
                                    {
                                        disabled:false,//是否禁用
                                        title:'PNG',//内容
                                    }
                                ]
                            },
                        ]
                        break;
                    case '清除定制':
                        mapFn.value.removeCustomizationFn()
                        break
                }
            }

            /**
            * @description: 地图定制弹框form表单确认
            * @param {*} :表单提交的内容
            * @return {*} :
            */
            const popFunction=(data)=>{
                mapFn.value.customizationFn(data)
            }
            
            onMounted(()=>{
                //按钮属性
                const buttonContent=[
                    {
                        title:'地图定制',//按钮内容
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
                    },
                    {
                        title:'清除定制',//按钮内容
                        size:'default',//尺寸:large / default /small
                        type:'danger',//按钮类型:primary / success / warning / danger / info / text
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
                    },
                ]
                /**
                * @description: 创建按钮
                * @param {*} :按钮属性
                * @return {*} :
                */
                btnFn.value.getButtonContent(buttonContent)
            })
            
            return{
                ...toRefs(state),
                mapFn,
                btnFn,
                PopFn,
                addPoint,
                checkLayer,
                Tools,
                initializeFly,
                getZoom,
                btnFunction,
                popFunction
            }
        }
    })
</script>

