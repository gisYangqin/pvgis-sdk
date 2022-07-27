/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-30 06:06:43
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-02 17:18:13
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\geometry\geometryType.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

/**
 * @description: ArcGIS API中所有的几何形状的类型
 */

import { getRandomEnumKey } from '../math/random'
enum GeometryType {
  Point = 'point',
  Multipoint = 'multipoint',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Extent = 'extent',
  Mesh = 'mesh',
}

/**
 * @description: 随机返回一个几何类型
 */
function getRandomGeometryType(type?: GeometryType[]): GeometryType {
  if (type) {
    return getRandomEnumKey(type) as GeometryType
  } else {
    return getRandomEnumKey(GeometryType)
  }
}

export { GeometryType, getRandomGeometryType }
