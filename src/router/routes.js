/*
 * @Author: your name
 * @Date: 2022-03-02 11:03:53
 * @LastEditTime: 2022-03-18 09:45:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\router\routes.js
 */
const Home = () => import('@/views/home/Home.vue');//首页
export default [
    {
      path:'/',
      redirect:'/Home',
      title:'首页'
    },
    {
      path:'/Home',
      name:'Home',
      title:'首页',
      components:{
        default:Home
      },
    },
];