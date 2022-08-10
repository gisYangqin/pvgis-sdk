/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-07 21:41:58
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 23:54:25
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\base.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import {
  type LayerDefine,
  ResquestFormatType,
  type DynamicLayer,
  EsriGeometryType,
  type LayerRangeValue,
  type LayerParameterValue,
  MapRangeValue,
} from './type'

abstract class ServiceResquestBase {
  // 服务的地址
  readonly url: string

  // 是否返回几何 如果为true, 返回的结果包含相关的几何图形，默认为true
  private _returnGeometry = true

  // 最大允许偏移 用于指定用于操作返回的几何图形的最大允许偏移量
  // 以sr为单位(对于Query操作,是outSR)。如果未指定sr，则假定以地图的空间参考为单位
  private _maxAllowableOffset: number

  // 几何精度 用于指定查找操作返回的响应几何中的小数位数。这仅适用于X和Y值（不适用于m或z值）
  private _geometryPrecision: number

  // 是否返回Z值 如果为true, 返回的要素中将会包含Z值，否则Z值将不会返回，默认为true
  // 该参数仅在returnGeometry=true时有效
  private _returnZ = true

  // 是否返回M值 如果为true, 返回的要素中将会包含M值，否则M值将不会返回，默认为false
  // 该参数仅在returnGeometry=true时有效
  private _returnM = false

  //数据库版本 切换地图图层到指定的备用地理数据库版本
  private _gdbVersion: string

  //基准转换 当sr和地图服务坐标系不同时，使用此参数将一个或者多个基准面转换应用于地图
  //此处指定的转换用于把地图服务的要素投影到SR指定的坐标系
  //在指定转换时，您需要考虑哪种基准转换最适合将图层（不是地图服务）投影到sr。图层资源中的sourceSpatialReference属性报告哪些空间参考要素存储在源数据集中。
  //有关有效基准面转换 ID 值和众所周知的文本字符串的列表，请参阅地理转换http://<domain-name>/arcgis/sdk/rest/index.html#/Datum_transformations/02ss00000033000000/。
  private _datumTransformations: number[]

  // 响应格式 默认为json
  private _f: ResquestFormatType = ResquestFormatType.json

  // 类名
  protected _declaredClass = 'pv-arcgis.service.ServiceBase'

  constructor(url: string) {
    this.url = url
  }

  get declareClass(): string {
    return this._declaredClass
  }

  get ReturnGeometry(): boolean {
    return this._returnGeometry
  }
  set ReturnGeometry(newValue: boolean) {
    this._returnGeometry = newValue
  }

  get MaxAllowableOffset(): number {
    return this._maxAllowableOffset
  }
  set MaxAllowableOffset(newValue: number) {
    if (newValue >= 0) {
      this._maxAllowableOffset = newValue
    } else {
      throw new Error('MaxAllowableOffset smaller than 0')
    }
  }

  get GeometryPrecision(): number {
    return this._geometryPrecision
  }
  set GeometryPrecision(newValue: number) {
    if (newValue >= 0) {
      //四舍五入取整
      this._maxAllowableOffset = Math.round(newValue)
    } else {
      throw new Error('MaxAllowableOffset smaller than 0')
    }
  }

  get ReturnZ(): boolean {
    return this._returnZ
  }
  set ReturnZ(newValue: boolean) {
    this._returnZ = newValue
  }

  get ReturnM(): boolean {
    return this._returnM
  }
  set ReturnM(newValue: boolean) {
    this._returnM = newValue
  }

  get GdbVersion(): string {
    return this._gdbVersion
  }
  set GdbVersion(newValue: string) {
    this.GdbVersion = newValue
  }

  get DatumTransformations(): number[] {
    return this._datumTransformations
  }
  set DatumTransformations(newValue: number[]) {
    if (newValue.length === 2) {
      this._datumTransformations = newValue
    } else {
      throw new Error('parameter must be an array with lenght is 2')
    }
  }

  get Fromat(): ResquestFormatType {
    return this._f
  }
  set Fromat(newValue: ResquestFormatType) {
    if (newValue in ResquestFormatType) {
      this._f = newValue
    } else {
      throw new Error('Invalid parameter passed in.')
    }
  }

  async excute(): Promise<unknown> {
    const url = this.getResquestUrl()
    const respone = await fetch(url)
    return respone.json()
  }

  abstract getParameterObject(): unknown
  protected abstract getResquestUrl(): string
  protected escap(): string {
    const object1 = {
      returnGeometry: this._returnGeometry,
      maxAllowableOffset: this._maxAllowableOffset,
      datumTransformations: this._datumTransformations,
      geometryPrecision: this._geometryPrecision,
      returnZ: this._returnZ,
      returnM: this._returnM,
      gdbVersion: this._gdbVersion,
      f: this._f,
    }
    return '&' + ObjectEscapString(object1)
  }
}

abstract class ServiceResquest extends ServiceResquestBase {
  // 坐标系 输出几何的坐标系的well-know ID.
  private _sr: number

  // 图层 操作时执行的图层列表，这些层被指定为层id
  private _layers: number[]

  // 图层定义 允许通过为图层指定定义表达式来过滤导出地图中各个图层的要素。与服务一起发布的图层的定义表达式将始终被接受。
  private _layerDefs: LayerDefine[]

  // 动态图层 使用 dynamicLayers 属性可以修改当前地图服务中现有图层的数据源或添加新图层。新图层的源应指向在创建地图服务时定义的已注册工作空间之一。定义动态层时，源是必需的。
  private _dynamicLayers: DynamicLayer[]

  // 是否返回未格式化的值 如果为true, 则结果中的值不会被格式化，即数字将按原样返回，日期将作为纪元值返回。
  // 默认为 false
  private _returnUnformattedValues = false

  // 是否返回字段名 如果为true,将返回字段名称而不是字段别名
  // 默认为false 如果图层具有连接，则将返回完全限定的字段名称
  private _returnFieldName = false

  // 地图区间值 通过指定的区间范围或者单值，在导出地图时从所有图层过滤要素数据
  private _mapRangeValues: MapRangeValue[]

  // 图层区间值 通过指定的区间范围或单值，在单独的每个图层筛选要素
  private _layerRangeValues: LayerRangeValue[]

  // 图层参数 通过图层的预先编写的参数化过滤器数组来过滤导出地图中各个图层的要素。如果没有为请求中的任何参数指定值，则会使用在创作期间分配的默认值。
  // 当parameterInfo允许多个值时，您必须将它们传递到数组中。
  // 注意：检查图层资源中的 parameterInfos 以获取可用的参数化过滤器、它们的默认值和预期的数据类型。
  private _layerParameterValues: LayerParameterValue[]
  constructor(url: string, layers?: number[]) {
    super(url)
    if (layers) {
      this._layers = layers
    }
    this._declaredClass = 'pv-arcgis.service.ServiceResquest'
  }

  get declareClass(): string {
    return this._declaredClass
  }

  get SpatialReference(): number {
    return this._sr
  }
  set SpatialReference(wkid: number) {
    this._sr = wkid
  }

  get Layers(): number[] {
    return this._layers
  }

  get LayerDefs(): LayerDefine[] {
    return this._layerDefs
  }

  get DynamicLayers(): DynamicLayer[] {
    return this._dynamicLayers
  }

  get ReturnUnformattedValues(): boolean {
    return this._returnUnformattedValues
  }

  get ReturnFieldName(): boolean {
    return this._returnFieldName
  }

  get LayerParametreValues(): unknown {
    return this._layerParameterValues
  }

  get MapRangeValues(): unknown {
    return this._mapRangeValues
  }

  get LayerRangeValues(): unknown {
    return this._layerRangeValues
  }

  getParameterObject(): unknown {
    throw new Error('Method not implemented.')
  }

  protected getResquestUrl(): string {
    throw new Error('Method not implemented.')
  }

  protected escap(): string {
    const object = {
      sr: this._sr,
      layerDefs: LayerDefsEscapString(this._layerDefs),
      layers: ObjectEscapString(this._layers),
      dynamicLayers: this._dynamicLayers,
      returnUnformattedValues: this._returnUnformattedValues,
      returnFieldName: this._returnFieldName,
      mapRangeValues: this._mapRangeValues,
      layerRangeValues: layerRangeValuesString(this._layerRangeValues),
      layerParameterValues: layerParameterEscapString(
        this._layerParameterValues
      ),
    }
    return '&' + ObjectEscapString(object) + super.escap()
  }
}

abstract class LayerResquest extends ServiceResquestBase {
  // 几何图形 作为空间过滤器应用的几何图形
  private _geometry: string
  // 几何类型 几何图形指定的几何类型，可以是信封区，点，线，多边形。默认是信封区
  private _geometryType = EsriGeometryType.Envelope
  // 时间 要查询的时刻或时间范围。
  private _time: number | number[]

  constructor(url: string) {
    super(url)
    this._declaredClass = 'pv-arcgis.service.LayerResquest'
  }

  get Geometry(): string {
    return this._geometry
  }
  set Geometry(newValue: string) {
    this._geometry = newValue
  }

  get GeometryType(): EsriGeometryType {
    return this._geometryType
  }
  set GeometryType(newValue: EsriGeometryType) {
    this._geometryType = newValue
  }

  get Time(): number | number[] {
    return this._time
  }
  set Time(newValue: number | number[]) {
    this._time = newValue
  }

  getParameterObject(): unknown {
    throw new Error('Method not implemented.')
  }

  protected getResquestUrl(): string {
    throw new Error('Method not implemented.')
  }

  protected escap(): string {
    const object = {
      geometry: this._geometry,
      geometryType: this._geometryType,
      time: this._time,
    }
    return '&' + ObjectEscapString(object) + super.escap()
  }
}

// 转义一个对象为字符串，支持输入基本类型和object对象
// 用法：
// let a='aaa'
// let b=true
// let c=123
// let d=[1,2,3,4]
// let e={
//     a:1,
//     b:'b',
//     c:true,
//     d:{
//         d1:'111',
//         d2:21
//     }
// }
// console.log('a:', ObjectEscapString(a))
// //a: aaa
// console.log('b:', ObjectEscapString(b))
// //b: true
// console.log('c:', ObjectEscapString(c))
// //c: 123
// console.log('d:', ObjectEscapString(d))
// //d: [1,2,3,4]
// console.log('e:', ObjectEscapString(e))
// //e: {a=1&b=b&c=true&d={d1=111&d2=21}}
function ObjectEscapString<T>(valueObject: T, isTop?: boolean): string {
  if (isTop === undefined) {
    isTop = true
  }
  let connector = [':', ',', '"']
  if (isTop) {
    connector = ['=', '&', '']
  }

  if (typeof valueObject === 'boolean') {
    return encodeURIComponent(valueObject)
  }
  if (typeof valueObject === 'number') {
    return encodeURIComponent(valueObject)
  }
  if (typeof valueObject === 'string') {
    return encodeURIComponent(valueObject)
  }

  if (typeof valueObject === 'object') {
    if (Array.isArray(valueObject)) {
      const values = Object.values(valueObject)
      if (isTop) {
        return values.join(',')
      } else {
        return '[' + values.join(',') + ']'
      }
    }
    const keys = Object.keys(valueObject)
    let objectString = ''
    keys.forEach((k) => {
      objectString += connector[2] + k.toString() + connector[2] + connector[0]
      let escapstring = ObjectEscapString(valueObject[k], false)
      if (typeof valueObject[k] === 'string') {
        escapstring = connector[2] + escapstring + connector[2]
      }
      objectString += escapstring + connector[1]
    })

    if (isTop) {
      return objectString.substring(0, objectString.length - 1)
    } else {
      return '{' + objectString.substring(0, objectString.length - 1) + '}'
    }
  }
  return ''
}

// 转义LayerDefine类型为字符串
function LayerDefsEscapString(layerDefs: LayerDefine[]): string {
  const layerdefString: string[] = []
  if (!layerDefs) {
    return ''
  }
  layerDefs.forEach((layerDef) => {
    layerdefString.push(`"${layerDef.layerID}":"${layerDef.filterSQL}"`)
  })
  return '{' + layerdefString.join(',') + '}'
}

// 转义LayerRangeValue类型为字符串
function layerRangeValuesString(layerRangeValues: LayerRangeValue[]): string {
  const layerRangeValueString: string[] = []
  if (!layerRangeValues) {
    return ''
  }
  layerRangeValues.forEach((layerRangeValue) => {
    layerRangeValueString.push(
      `"${layerRangeValue.layerIDName}":` +
        ObjectEscapString(layerRangeValue.mapRangeValues, false)
    )
  })
  return '{' + layerRangeValueString.join(',') + '}'
}

// 转义LayerParameterValue类型为字符串
function layerParameterEscapString(
  layerParameterValues: LayerParameterValue[]
): string {
  const layerParameterValueString: string[] = []
  if (!layerParameterValues) {
    return ''
  }
  layerParameterValues.forEach((layerParameterValue) => {
    const layerRangeValueString: string[] = []
    if (layerParameterValue.layerRangeValues) {
      layerParameterValue.layerRangeValues.forEach((layerRangeValue) => {
        const mapRangeValueString: string[] = []
        if (layerRangeValue.mapRangeValues) {
          layerRangeValue.mapRangeValues.forEach((mapRangeValue) => {
            mapRangeValueString.push(
              `"${mapRangeValue.name}":` +
                ObjectEscapString(mapRangeValue.value, false)
            )
          })
          layerRangeValueString.push(
            `"${layerRangeValue.layerIDName}":{` +
              mapRangeValueString.join(',') +
              '}'
          )
        }
      })
    }
    layerParameterValueString.push(layerRangeValueString.join(','))
  })
  return '[' + layerParameterValueString.join(',') + ']'
}

export {
  ServiceResquestBase,
  ServiceResquest,
  LayerResquest,
  ObjectEscapString,
}
