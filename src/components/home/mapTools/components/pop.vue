<!--
 * @Author: your name
 * @Date: 2022-03-10 17:55:46
 * @LastEditTime: 2022-03-10 18:00:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Vue_Openlayers\src\components\home\mapTools\components\pop.vue
-->
<template>
    <div class="PopBox">
        <a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        </a-modal>
    </div>
</template>
<script lang='ts'>
export interface AnyObject { [key: string]: any }
import {searchPoi} from '@/api'
import { ref, onMounted ,reactive,toRefs,defineComponent } from 'vue'
import {Input,Button,Modal} from 'ant-design-vue'//安装2.1.3版本
let state:AnyObject = reactive({

})
export default defineComponent({
    components: {
        AButton:Button,
        AModal:Modal
    },
    setup(props,context) {
        const visible = ref<boolean>(false);

        const showModal = () => {
            visible.value = true;
        };

        const handleOk = (e: MouseEvent) => {
            console.log(e);
            visible.value = false;
        };

        return {
            ...toRefs(state),
            visible,
            showModal,
            handleOk,
        };
    },
})
</script>
<style lang='scss' scope>
    
    
</style>