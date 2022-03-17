/*
 * @Author: your name
 * @Date: 2022-02-14 15:14:09
 * @LastEditTime: 2022-03-15 11:36:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\main.ts
 */
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import VueAxios from 'vue-axios'
import 'ant-design-vue/dist/antd.css'
import 'element-plus/dist/index.css'
createApp(App).use(router,VueAxios).mount('#app')

