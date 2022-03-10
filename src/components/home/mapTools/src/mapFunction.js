/*
 * @Author: your name
 * @Date: 2022-03-03 13:57:09
 * @LastEditTime: 2022-03-10 13:26:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\src\components\home\mapTools\src\mapFunction.js
 */
import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Feature } from 'ol'
import { formatLength, formatArea, setToolStyle } from './calculate.js'
import deletePoint from './deletePoint.png'
import deleteLineArea from './close.png'
 
import {
  unByKey
} from 'ol/Observable.js'
import Overlay from 'ol/Overlay'
// import View from 'ol/View'
import {
  LineString,
  Polygon,
  Point
} from 'ol/geom.js'
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style
  // Text
} from 'ol/style.js'
// import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
// 画板
var draw
var listener
// 绘制次数
var lengthMeasureCount = 0
// 地图
var mapView
// 绘制类型
var measureTypeAll
// 已绘制的坐标集合
var drawCoordinateArr = []
/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement
 
/**
 * Overlay to show the help messages.
 * @type {module:ol/Overlay}
 */
var helpTooltip
 
/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement
 
/**
 * Overlay to show the measurement.
 * @type {module:ol/Overlay}
 */
var measureTooltip
 
const style = new Style({
  fill: new Fill({
    color: 'rgba(27, 78, 150, 0.4)'
  }),
  stroke: new Stroke({
    color: '#1A90FF',
    // lineDash: [10, 10],
    width: 2
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: '#1A90FF'
    }),
    fill: new Fill({
      color: '#fff'
    })
  })
})
 
// 点击测距的删除
function deleteClick (e) {
  const target = e.target
  const eIndex = target.getAttribute('tempimgdata')
  if (target.className === 'deleteLine') {
    deleteLayers(eIndex)
    drawCoordinateArr[parseInt(eIndex) - 1] = []
  } else if (target.className === 'deletePoint') {
    deleteLayers(eIndex, target)
  }
}
 
// 删除某个点之后重新测量距离
function drawFresh (eIndex) {
  console.log(eIndex)
  const coordinates = drawCoordinateArr[parseInt(eIndex) - 1]
  const lineString = new LineString(coordinates)
  // 将该点要素添加到矢量数据源中
  const tempLayer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: lineString
        })
      ]
    }),
    style,
    tempdata: eIndex,
    updateWhileAnimating: true
  })
  mapView.addLayer(tempLayer)
  const tempArr = []
  for (let i = 0; i < coordinates.length; i++) {
    tempArr.push(coordinates[i])
    if (i === 0) {
      createDom(coordinates[i], '起点', i, coordinates, eIndex)
    } else {
      createDom(coordinates[i], formatLength(mapView, new LineString(tempArr)), i, coordinates, eIndex)
    }
  }
}
// 绘制之后放置测量内容
function createDom (point, inner, i, coordinates, lengthMeasureCount) {
  // 设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
  measureTooltip.setPosition(point)
  measureTooltipElement.innerHTML = inner +
  `<img class="deletePoint" id="deletePoint-${lengthMeasureCount}-${i}" tempimgdata="${lengthMeasureCount}" src="${deletePoint}" style="width: 0px;padding-left: 5px;" />` +
  (i === coordinates.length - 1 ? `<img class="deleteLine" id="deleteLine${lengthMeasureCount}" tempimgdata="${lengthMeasureCount}" src="${deleteLineArea}" style="width: 17px;height: 17px;padding: 2px 0 0 2px;margin: -4px 0 0 8px;" />` : '')
  measureTooltipElement.parentNode.style.zIndex = i
  measureTooltipElement.className = 'tooltip tooltip-static'
  // 创建测量提示框
  if (i === coordinates.length - 1) {
    createMeasureTooltip(lengthMeasureCount, true)
  } else {
    createMeasureTooltip('', true)
  }
  // 给所有测量提示框设置样式
  document.querySelectorAll('.tooltip.tooltip-static').forEach(n => {
    setToolStyle(n)
  })
  // setToolStyle(measureTooltipElement)
 
  // 根据鼠标点击位置生成一个点
  const pointLine = new Point(coordinates[i])
  // 将该点要素添加到矢量数据源中
  const tempLayer = new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: pointLine
        })
      ]
    }),
    style,
    tempdata: lengthMeasureCount,
    updateWhileAnimating: true
  })
  mapView.addLayer(tempLayer)
}
function createHelpTooltip () {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement)
  }
  helpTooltipElement = document.createElement('div')
  helpTooltipElement.className = 'ol-tooltip hidden'
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  })
  mapView.addOverlay(helpTooltip)
}
// 创建测量提示框
function createMeasureTooltip (id, refresh) {
  // 是否开启每两个点之间距离的显示
  if (measureTypeAll === 'Polygon' && measureTooltipElement && !refresh) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement)
  }
  measureTooltipElement = document.createElement('div')
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
  measureTooltipElement.tempdata = id || ''
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    id: id || '',
    offset: [0, -15],
    positioning: 'bottom-center'
  })
  mapView.addOverlay(measureTooltip)
}
// 删除当前点击的图层
function deleteLayers (eIndex, target) {
  const overlaysArr = mapView.getOverlays().getArray()
  const layersArr = mapView.getLayers().getArray()
  // 先把需要删除的Overlays存在一个数组中
  // 如果不储存直接去删除Overlays就会出现需要删除却识别不到的图层
  const deleteOverlayArr = []
  const deleteLayerArr = []
  for (let i = 0; i < overlaysArr.length; i++) {
    const lastChild = overlaysArr[i].values_.element.lastChild
    if(lastChild){
        if (lastChild.id && lastChild.getAttribute('tempimgdata') === eIndex) {
            deleteOverlayArr.push(overlaysArr[i])
        }
    }
  }
  mapView.getLayers().getArray().forEach((n, i) => {
    if (n.getSource() && n instanceof VectorLayer && n.getSource().getFeatures()[0] && n.getSource().getFeatures()[0].get('tempdata') && n.getSource().getFeatures()[0].get('tempdata').toString() === eIndex) {
      deleteLayerArr.push(n)
    }
  })
  for (let i = 0; i < layersArr.length; i++) {
    if (layersArr[i].values_.tempdata && layersArr[i].values_.tempdata.toString() === eIndex) {
      deleteLayerArr.push(layersArr[i])
    }
  }
  // 单独处理需要删除的Overlays和Layers
  deleteOverlayArr.forEach(n => mapView.removeOverlay(n))
  deleteLayerArr.forEach(n => mapView.removeLayer(n))
  // 删除之后重新画
  if (target) {
    const index = target.id.split('-')
    drawCoordinateArr[parseInt(index[1]) - 1].splice(parseInt(index[2]), 1)
    if (drawCoordinateArr[parseInt(index[1]) - 1].length > 1) drawFresh(index[1])
  }
}
 
export default {
  measure (map, measureType, fn) {
    measureTypeAll = measureType
    mapView = map
    // if (draw) draw.finishDrawing()
    var source = new VectorSource()
 
    var vector = new VectorLayer({
      id: 'lineAndArea',
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(27, 78, 150, 0.4)'
        }),
        stroke: new Stroke({
          color: measureType === 'LineString' ? '#1A90FF' : 'rgba(0,0,0,0)',
          // lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#1A90FF'
          }),
          fill: new Fill({
            color: '#fff'
          })
        })
      }),
      zIndex: 16
    })
    map.addLayer(vector)
    /**
     * Currently drawn feature.
     * @type {module:ol/Feature~Feature}
     */
    var sketch
 
    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    // var continuePolygonMsg = '继续点击绘制多边形'
    var continuePolygonMsg = ''
 
    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    // var continueLineMsg = '继续点击绘制线'
    var continueLineMsg = ''
 
    /**
     * Handle pointer move.
     * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
     */
    var pointerMoveHandler = function (evt) {
      if (evt.dragging) {
        return
      }
      /** @type {string} */
      var helpMsg = ''
 
      if (sketch) {
        var geom = sketch.getGeometry()
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg
        }
      }
 
      helpTooltipElement.innerHTML = helpMsg
      helpTooltipElement.style.color = '#1A90FF'
      helpTooltip.setPosition(evt.coordinate)
 
      helpTooltipElement.classList.remove('hidden')
    }
 
    map.on('pointermove', pointerMoveHandler)
 
    map.getViewport().addEventListener('mouseout', function () {
      helpTooltipElement.classList.add('hidden')
    })
 
    function addInteraction () {
      draw = new Draw({
        source: source,
        type: measureType,
        style: new Style({
          fill: new Fill({
            color: 'rgba(27, 78, 150, 0.4)'
          }),
          stroke: new Stroke({
            color: measureType === 'LineString' ? '#1A90FF' : 'rgba(0,0,0,0)',
            // lineDash: [10, 10],
            width: 2
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: '#1A90FF'
            }),
            fill: new Fill({
              color: '#fff'
            })
          })
        })
      })
      map.addInteraction(draw)
 
      createMeasureTooltip()
      createHelpTooltip()
 
      draw.on('drawstart',
        function (evt) {
          document.removeEventListener('click', deleteClick)
          lengthMeasureCount++
          // set sketch
          sketch = evt.feature
 
          /** @type {module:ol/coordinate~Coordinate|undefined} */
          var tooltipCoord = evt.coordinate
 
          listener = sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target
            // console.log(geom)
            var output
            if (geom instanceof Polygon) {
              output = formatArea(map, geom)
              tooltipCoord = geom.getInteriorPoint().getCoordinates()
              measureTooltipElement.innerHTML = output + `<img class="deleteLine" id="deleteLine${lengthMeasureCount}" tempimgdata="${lengthMeasureCount}" src="${deleteLineArea}" style="width: 17px;height: 17px;padding: 2px 0 0 2px;margin: -4px 0 0 8px;" />`
            } else if (geom instanceof LineString) {
              output = formatLength(map, geom)
              tooltipCoord = geom.getLastCoordinate()
              measureTooltipElement.innerHTML = output
            }
            measureTooltip.setPosition(tooltipCoord)
            setToolStyle(measureTooltipElement)
          })
        }, this)
 
      draw.on('drawend',
        function (endE) {
          fn()
          const coordinates = endE.feature.getGeometry().getCoordinates()
          endE.feature.set('tempdata', lengthMeasureCount)
          drawCoordinateArr.push(coordinates)
          drawPoint(coordinates)
          document.addEventListener('click', deleteClick)
          clearDraw()
        }, this)
    }
 
    function drawPoint (coordinates) {
      if (measureType === 'LineString') {
        const tempArr = []
        for (let i = 0; i < coordinates.length; i++) {
          tempArr.push(coordinates[i])
          if (i === 0) {
            createDom(coordinates[i], '起点', i, coordinates, lengthMeasureCount)
          } else {
            createDom(coordinates[i], formatLength(map, new LineString(tempArr)), i, coordinates, lengthMeasureCount)
          }
        }
        // if (index) drawCoordinateArr[index] = null
      } else {
        const polyCoors = coordinates[0]
        for (let i = 0; i < polyCoors.length; i++) {
          // 根据鼠标点击位置生成一个点
          const pointLine = new Point(polyCoors[i])
          // 将该点要素添加到矢量数据源中
          const tempLayer = new VectorLayer({
            source: new VectorSource({
              features: [
                new Feature({
                  geometry: pointLine
                })
              ]
            }),
            style,
            tempdata: lengthMeasureCount,
            updateWhileAnimating: true
          })
          map.addLayer(tempLayer)
        }
      }
    }
    function clearDraw () {
      measureTooltipElement.innerHTML = (measureType === 'Polygon' ? '' : '总长：') + measureTooltipElement.innerHTML
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static measureNum'
      setToolStyle(measureTooltipElement)
      measureTooltip.setOffset([0, -7])
      // unset sketch
      sketch = null
      // unset tooltip so that a new one can be created
      measureTooltipElement = null
      createMeasureTooltip()
      if (listener) unByKey(listener)
      map.un('pointermove', pointerMoveHandler)
      map.removeInteraction(draw)
      helpTooltipElement.classList.add('hidden')
    }
    // 量测调用
    addInteraction()
  },
  clearDraw (map) {
    map.removeInteraction(draw)
    map.removeEventListener('singleclick')
    map.removeEventListener('dblclick')
  },
  // 删除所有测量图层
  deleteAllLayers (mapView) {
    const overlaysArr = mapView.getOverlays().getArray()
    const layersArr = mapView.getLayers().getArray()
    // 先把需要删除的Overlays存在一个数组中
    // 如果不储存直接去删除Overlays就会出现需要删除却识别不到的图层
    const deleteOverlayArr = []
    const deleteLayerArr = []
    for (let i = 0; i < overlaysArr.length; i++) {
      if(overlaysArr[i].values_.element.lastChild){
        const lastChild = overlaysArr[i].values_.element.lastChild
        if (lastChild.id && lastChild.getAttribute('tempimgdata')) {
          deleteOverlayArr.push(overlaysArr[i])
        }
      }
    }
    mapView.getLayers().getArray().forEach((n, i) => {
      if (n.getSource() && n instanceof VectorLayer && n.getSource().getFeatures()[0] && n.getSource().getFeatures()[0].get('tempdata') && n.getSource().getFeatures()[0].get('tempdata').toString()) {
        deleteLayerArr.push(n)
      }
    })
    for (let i = 0; i < layersArr.length; i++) {
      if (layersArr[i].values_.tempdata && layersArr[i].values_.tempdata.toString()) {
        deleteLayerArr.push(layersArr[i])
      }
    }
    // 单独处理需要删除的Overlays和Layers
    deleteOverlayArr.forEach(n => mapView.removeOverlay(n))
    deleteLayerArr.forEach(n => mapView.removeLayer(n))
  }
}