/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-08-09 20:43:18
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 23:29:26
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\IdentifyOperation.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import { ObjectEscapString, ServiceResquest } from './base'
import { EsriGeometryType, layerTimeOption } from './type'

class IdentifyOperation extends ServiceResquest {
  // (必填参数) 要识别的几何体。几何体的类型由geometryType参数指定。
  // 几何体的结构与ArcGIS REST API返回的JSON几何体对象的结构相同。
  // 除了JSON结构外，对于点和信封区，你可以用更简单的逗号分隔的语法来指定几何体。
  private _geometry: string

  // 指定几何类型，可以是点，线，面，信封区。默认几何类型是点
  private _geometryType = EsriGeometryType.Point

  // (必填参数)以屏幕像素为单位的距离，在此范围内应进行识别的指定几何图形。容差的值是一个整数。
  private _tolerance: number

  // 要识别的要素的时间戳或时间戳范围
  private _time: number | number[]

  // 每层的时间选项。用户可以指出该层是否应该使用时间参数指定的时间范围，
  // 是否累积绘制该层要素以及该层的时间偏移。
  private _layerTimeOptions: layerTimeOption[]

  // （必填参数）当前正在查看的地图的范围或边界框。
  // 除非指定了sr参数，否则mapExtent被认为是在地图的空间参照中。
  // mapExtent和imageDisplay参数被服务器用来确定在当前范围内可见的层。
  // 它们还被用来计算地图上的距离，以便根据屏幕像素的公差进行搜索。
  //  mapExtent=-104,35.6,-94.32,41
  private _mapExtent: number[]

  // (必填参数)当前查看的地图的屏幕图像显示参数（宽度、高度和DPI）。
  // mapExtent和imageDisplay参数被服务器用来确定在当前范围内可见的层。
  // 它们还被用来计算地图上的距离，以便根据屏幕像素的公差进行搜索。
  // Example: imageDisplay=600,550,96
  private _imageDisplay: number[]

  constructor(
    url: string,
    geometryJson: string,
    geometryType: EsriGeometryType,
    tolerance: number,
    mapExtent: number[],
    imageDisplay: number[]
  ) {
    super(url)
    this._geometry = geometryJson
    this._geometryType = geometryType
    this._tolerance = tolerance
    if (mapExtent.length < 4) {
      throw new Error('parameter:mapExtent must be contain 4 numbers')
    }
    this._mapExtent = mapExtent.slice(0, 4)
    if (imageDisplay.length < 3) {
      throw new Error('parameter:imageDisplay must be contain 3 numbers')
    }
    this._imageDisplay = imageDisplay.slice(0, 3)

    this._declaredClass = 'pv-arcgis.service.IdentifyOperation'
  }

  protected getResquestUrl(): string {
    let resquestUrl = this.url + '/identify?'
    try {
      resquestUrl += this.escap()
    } catch (error) {
      throw error
    }
    return resquestUrl
  }

  protected escap(): string {
    const object = {
      geometry: this._geometry,
      geometryType: this._geometryType,
      tolerance: this._tolerance,
      mapExtent: ObjectEscapString(this._mapExtent),
      imageDisplay: ObjectEscapString(this._imageDisplay),
      time: ObjectEscapString(this._time),
      layerTimeOptions: layerTimeOptionEscapString(this._layerTimeOptions),
    }
    return ObjectEscapString(object) + super.escap()
  }

  get Geometry(): string {
    return this._geometry
  }
  get GeometryType(): EsriGeometryType {
    return this._geometryType
  }
  public setGeometry(geometryJson: string, geometryType: EsriGeometryType) {
    this._geometry = geometryJson
    this._geometryType = geometryType
  }

  get Tolerance(): number {
    return this._tolerance
  }
  set Tolerance(tolerance: number) {
    this._tolerance = tolerance
  }

  get Time(): number | number[] {
    return this._time
  }
  set Time(time: number | number[]) {
    this._time = time
  }

  get LayerTimeOptions(): layerTimeOption[] {
    return this._layerTimeOptions
  }
  set LayerTimeOptions(newValue: layerTimeOption[]) {
    this._layerTimeOptions = newValue
  }
  get MapExtent(): number[] {
    return this._mapExtent
  }
  set MapExtent(newExtent: number[]) {
    if (newExtent.length === 4) {
      this._mapExtent = newExtent
    } else {
      throw new Error('parameter:newExtent must be contain 4 numbers')
    }
  }

  get ImageDisplay(): number[] {
    return this._imageDisplay
  }
  set ImageDisplay(newImageDisplay: number[]) {
    if (newImageDisplay.length === 3) {
      this._imageDisplay = newImageDisplay
    } else {
      throw new Error('parameter:newImageDisplay must be contain 4 numbers')
    }
  }
}

function layerTimeOptionEscapString(
  layerTimeOptions: layerTimeOption[]
): string {
  const layerTimeOptionsString: string[] = []
  if (!layerTimeOptions) {
    return ''
  }
  layerTimeOptions.forEach((layerTimeOption) => {
    layerTimeOptionsString.push(
      `"${layerTimeOption.layerID}":` +
        ObjectEscapString(layerTimeOption.timeoption, false)
    )
  })

  return '{' + layerTimeOptionsString.join(',') + '}'
}
export { IdentifyOperation }
