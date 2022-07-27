/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-11 18:39:42
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-07-12 22:17:01
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\type.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

// 地图服务请求的格式枚举
enum ResquestFormatType {
  html = 'html',
  json = 'json',
  geojson = 'geojson',
  kmz = 'kmz',
  zmf = 'amf',
}

enum EsriGeometryType {
  esriGeometryPoint = 'esriGeometryPoint',
  esriGeometryMultipoint = 'esriGeometryMultipoint',
  esriGeometryPolyline = 'esriGeometryPolyline',
  esriGeometryPolygon = 'esriGeometryPolygon',
  esriGeometryEnvelope = 'esriGeometryEnvelope',
}
interface LayerDefine {
  layerID: number
  filterSQL: string
}

interface DataSource {
  type: string
  workspaceId: string
  dataSourceName: string
}

interface DynamicLayer {
  id: number
  source: DataSource
  definitionExpression: string
}
export {
  ResquestFormatType,
  EsriGeometryType,
  type LayerDefine,
  type DynamicLayer,
}
