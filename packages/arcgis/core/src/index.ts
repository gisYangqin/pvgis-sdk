/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-29 17:17:04
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-03 21:35:09
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\index.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import arcgisApiPaths from './arcgis-api-paths'
import { arcgisApiRequests } from './arcgis-api-request'
import { getIExtentEx } from './geometry/ExtentEx'
import { setArcgisAPIPath } from './arcgis-api-setArcgisAPIPath'
import { getIGeometryEngineEx } from './geometry/geometryEngineEx'
import { GeometryType, getRandomGeometryType } from './geometry/geometryType'
import { getRandomByRange, getRandomEnumKey } from './math/random'
export {
  arcgisApiRequests,
  arcgisApiPaths,
  setArcgisAPIPath,
  getIExtentEx,
  getIGeometryEngineEx,
  GeometryType,
  getRandomGeometryType,
  getRandomByRange,
  getRandomEnumKey,
}
