<!--
 * @Author: your name
 * @Date: 2022-03-15 11:35:56
 * @LastEditTime: 2022-03-18 10:24:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\components\button.vue
-->
<template>
    <div class="DialogBox">
        <el-dialog v-model="dialogFormVisible" :title="popTitle" :width="popWidth">
            <el-form :model="popInput">
                <!-- input模块 -->
                <div v-if='showInput==true'>
                    <el-form-item v-for='(v,i) in popInput' :key="i" :label="v.label" :label-width="formLabelWidth">
                        <el-input v-model="v.model" autocomplete="off" :placeholder="v.placeholder" :clearable='v.clearable' :disabled='v.disabled'/>
                    </el-form-item>
                </div>
                <!-- select模块 -->
                <div v-if='showSelect==true'>
                    <el-form-item v-for='(v,i) in popOption' :key="i" :label="v.label" :label-width="formLabelWidth">
                        <el-select v-model="v.popSelect" :placeholder="v.placeholder">
                            <el-option v-for="k in v.option" :key="k" :label="k" :value="k"/>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- radio模块 -->
                <div v-if="showRadio==true">
                    <el-form-item v-for='(v,i) in popRadio' :key="i" :label="v.label" :label-width="formLabelWidth">
                        <el-radio-group v-model="v.value">
                            <el-radio v-for='(t,k) in v.option' :key="k" :label="t.title" :disabled='t.disabled' />
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="change">确定</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {ref,reactive,toRefs,defineComponent} from 'vue' // vue相关方法
    import {ElButton,ElDialog,ElForm,ElFormItem,ElInput,ElSelect,ElOption,ElRadioGroup,ElRadio} from 'element-plus'
    interface AnyObject {[key: string]: any}
    interface resObject{[key: string]: string | boolean | void}
    
    export default defineComponent({
        components:{
            ElButton,
            ElDialog,
            ElForm,
            ElFormItem,
            ElInput,
            ElSelect,
            ElOption,
            ElRadioGroup,
            ElRadio
        },
        setup(prop,context){
            let dialogFormVisible= ref(false);//弹框显隐
            const formLabelWidth:string= '';//label的宽度
            const popWidth:string=''//弹窗的宽度
            //form表单内容
            let state:AnyObject=reactive({
                popTitle:'',//弹框标题
                /* input模块 */
                showInput:false,//显隐input模块
                popInput:[//盒子
                    {
                        label:'',//标题
                        model:'',//内容
                        placeholder:'',//提示
                        clearable:false,//清空按钮
                        disabled:false,//禁用
                    }
                ],
                /* select模块 */
                showSelect:false,//显隐select模块
                popOption:[//盒子
                    {
                        label:'',//标题
                        popSelect:'',//结果
                        option:[],//选项
                        placeholder:'',//提示
                    }
                ],
                /* radio模块 */
                showRadio:false,//显隐radio模块
                popRadio:[//盒子
                    {
                        label:'',//标题
                        value:'',//结果
                        option:[//选项
                            {
                                disabled:false,//是否禁用
                                title:'',//内容
                            }
                        ],

                    },
                ],
            })
            /**
            * @description: 表单提交
            * @param {*} :
            * @return {*} :
            */
            const change=():resObject=>{
                let obj={}
                if(state.showInput===true){
                    for(let i=0;i<state.popInput.length;i++){
                        obj['input'+i]=state.popInput[i].model
                    }
                }
                if(state.showSelect===true){
                    for(let i=0;i<state.popOption.length;i++){
                        obj['select'+i]=state.popOption[i].popSelect
                    }
                }
                if(state.showRadio===true){
                    for(let i=0;i<state.popRadio.length;i++){
                        obj['radio'+i]=state.popRadio[i].value
                    }
                }
                dialogFormVisible.value=false
                context.emit('change',obj)
                return obj
            }
            return{
                ...toRefs(state),
                dialogFormVisible,
                formLabelWidth,
                popWidth,
                change
            }
        },
    })
    
</script>
