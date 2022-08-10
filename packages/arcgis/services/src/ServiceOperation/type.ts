/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-11 18:39:42
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 02:12:33
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
  Point = 'esriGeometryPoint',
  Multipoint = 'esriGeometryMultipoint',
  Polyline = 'esriGeometryPolyline',
  Polygon = 'esriGeometryPolygon',
  Envelope = 'esriGeometryEnvelope',
}

enum EsriTimeUnits {
  Centuries = 'esriTimeUnitsCenturies',
  Days = 'esriTimeUnitsDays',
  Decades = 'esriTimeUnitsDecades',
  Hours = 'esriTimeUnitsHours',
  Milliseconds = 'esriTimeUnitsMilliseconds',
  Minutes = 'esriTimeUnitsMinutes',
  Months = 'esriTimeUnitsMonths',
  Seconds = 'esriTimeUnitsSeconds',
  Weeks = 'esriTimeUnitsWeeks',
  Years = 'esriTimeUnitsYears',
  Unknown = 'esriTimeUnitsUnknown',
}
enum EsriSpatialRelRelation {
  Intersects = 'esriSpatialRelIntersects',
  Contains = 'esriSpatialRelIntersects',
  Crosses = 'esriSpatialRelCrosses',
  EnvelopeIntersect = 'esriSpatialRelEnvelopeIntersects',
  IndexIntersects = 'esriSpatialRelIndexIntersects',
  Overlaps = 'esriSpatialRelOverlaps',
  Touches = 'esriSpatialRelTouches',
  Within = 'esriSpatialRelWithin',
  Relation = 'esriSpatialRelRelation',
}
enum EsriSRUnit {
  Meter = 'esriSRUnit_Meter', //米
  StatuteMile = 'esriSRUnit_StatuteMile', //英里
  Foot = 'esriSRUnit_Foot', //英尺
  Kilometer = 'esriSRUnit_Kilometer', //公里
  NauticalMile = 'esriSRUnit_NauticalMile', //海里
  USNauticalMile = 'esriSRUnit_USNauticalMile', //美国海里
}

interface LayerDefine {
  layerID: number
  filterSQL: string
}
interface LayerSource {
  type: string
  mapLayerId: number
  version?: string
  dataSource?: DataSource
}

interface DataSource {
  type: string
  workspaceId: string
  dataSourceName: string
}

interface DynamicLayer {
  id: number
  source: LayerSource
  definitionExpression: string
}

interface MapRangeValue {
  name: string
  value: number | number[]
}

interface LayerRangeValue {
  layerIDName: string
  mapRangeValues: MapRangeValue[]
}

interface LayerParameterValue {
  layerRangeValues: LayerRangeValue[]
}

interface TimeOption {
  useTime: boolean
  timeDataCumulative?: boolean
  timeOffsetOffset?: number
  timeOffsetUnits?: EsriTimeUnits
}

interface layerTimeOption {
  layerID: string
  timeoption: TimeOption
}
interface QueryOutStatistic {
  statisticType: 'count' | 'sum' | 'min' | 'max' | 'avg' | 'stddev' | 'var'
  onStatisticField: string
  outStatisticFieldName: string
}

export {
  ResquestFormatType,
  EsriGeometryType,
  EsriTimeUnits,
  EsriSpatialRelRelation,
  EsriSRUnit,
  type LayerSource,
  type LayerDefine,
  type DynamicLayer,
  type MapRangeValue,
  type LayerRangeValue,
  type LayerParameterValue,
  type layerTimeOption,
  type QueryOutStatistic,
}
