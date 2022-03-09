/*
 * @Author: your name
 * @Date: 2022-02-14 15:14:09
 * @LastEditTime: 2022-03-03 10:01:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\router\index.ts
 */
/*
 * @Description:
 * @Author: tb
 * @Date: 2021-09-23 13:49:01
 * @LastEditTime: 2021-10-19 09:15:34
 * @LastEditors: lxf
 */
import routes from './routes.js';
import { createRouter,createWebHashHistory} from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router

