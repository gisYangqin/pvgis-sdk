/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-28 07:31:26
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-03 23:12:56
 * @FilePath: \pv-gis-libs\packages\arcgis\core\examples\main.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved. 
 */
import { arcgisApiRequests, arcgisApiPaths,setArcgisAPIPath } from '../src/index'
import { getIExtentEx } from '../src/index'

import { getIGeometryEngineEx } from '../src/geometry/geometryEngineEx'

type modulesType = [typeof __esri.Map, typeof __esri.MapView]
type modulesType2 = [
  typeof __esri.Map,
  typeof __esri.MapView,
  typeof __esri.Graphic,
  typeof __esri.Point,
]


async function loadArcgisModules() {
  // setArcgisAPIPath('http://localhost/arcgis_js_api/4.23/init.js')

  getIExtentEx().then((MyExtent)=>{
  })
  
  const [Map, MapView] = await arcgisApiRequests<modulesType>([
    arcgisApiPaths.Map,
    arcgisApiPaths.MapView,
  ])
  debugger
  console.log('🌏🌏🌏🌏🌏', Map.prototype.declaredClass)
  console.log('🌙🌙🌙🌙🌙', MapView.prototype.declaredClass)

  setTimeout(async () => {
    const [Map, MapView, Graphic,Point] = await arcgisApiRequests<modulesType2>([
      arcgisApiPaths.Map,
      arcgisApiPaths.MapView,
      arcgisApiPaths.Graphic,
      arcgisApiPaths.Point,
    ])
    console.log('☀☀☀☀☀☀☀☀', Map.prototype.declaredClass)
    console.log('🌌🌌🌌🌌🌌', MapView.prototype.declaredClass)
    console.log('🌋🌋🌋🌋🌋', Graphic.prototype.declaredClass)


    const geometryEngineEx =await getIGeometryEngineEx()
    const point=geometryEngineEx.createRandomPoint()
    console.log('point：', point)
    console.log('point：', point.declaredClass)
  }, 2000)
}

loadArcgisModules()
