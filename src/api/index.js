/*
 * @Author: your name
 * @Date: 2022-02-18 09:30:38
 * @LastEditTime: 2022-03-02 10:20:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\public\api\api.js
 */
// import instance from "axios";
let baseURL = "";
if (process.env.NODE_ENV === "development") {
    baseURL = process.env.VUE_APP_API_DEV;
} else {
    baseURL = process.env.VUE_APP_API_PRO;
}
