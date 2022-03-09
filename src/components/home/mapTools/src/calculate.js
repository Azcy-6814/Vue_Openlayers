/*
 * @Author: your name
 * @Date: 2022-03-03 13:57:30
 * @LastEditTime: 2022-03-03 18:03:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\home\mapTools\src\calculate.js
 */
import {getArea,getLength} from 'ol/sphere.js';
/**
* @description: 计算面积
* @param {*} :(map:地图对象,geom:传入面Geometry数据)
* @return {*} :计算结果
*/
export const formatArea=(map, geom)=>{
    //获取坐标系
    let sourceProj=map.getView().getProjection()
    let res
    //测量面积，默认的投影坐标系是EPSG:3857, 其中有个options的参数，可以设置投影坐标系
    let area=getArea(geom,{projection:sourceProj})
    if (area > 10000) {
        res = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'k㎡'
      } else {
        res = (Math.round(area * 100) / 100) +
        ' ' + '㎡'
      }
      return res
}

/**
* @description: 计算长度
* @param {*} :(map:地图对象,geom:传入点Geometry数据)
* @return {*} :计算结果
*/
export const formatLength=(map, geom)=>{
    //获取坐标系
    let sourceProj=map.getView().getProjection()
    let res
    //测量距离，默认的投影坐标系是EPSG:3857, 其中有个options的参数，可以设置投影坐标系
    let length=getLength(geom,{projection:sourceProj})
    if (length > 100) {
        res = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km'
      } else {
        res = (Math.round(length * 100) / 100) +
          ' ' + 'm'
      }
      return res
}

export const setToolStyle = (measureTooltipElement) => {
    // 这里可以根据你需要的测量提示框的样式做修改
    measureTooltipElement.style.color = '#fff'
    measureTooltipElement.style.padding = '0 10px'
    measureTooltipElement.style.height = '25px'
    measureTooltipElement.style.lineHeight = '20px'
    measureTooltipElement.style.background = '#95c5f8'
    measureTooltipElement.style.fontSize = '15px'
    measureTooltipElement.style.fontWeight = '400'
}