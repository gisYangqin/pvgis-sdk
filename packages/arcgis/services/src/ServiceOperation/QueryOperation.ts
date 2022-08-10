/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-08-09 22:49:31
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 23:55:10
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\QueryOperation.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import { ObjectEscapString, LayerResquest } from './base'
import {
  EsriSpatialRelRelation,
  EsriSRUnit,
  MapRangeValue,
  QueryOutStatistic,
} from './type'

class QueryOperation extends LayerResquest {
  // 一个字面的搜索文本。如果该层有一个与之相关的显示字段，服务器会在这个字段中搜索这个文本。
  // 这个参数是WHERE子句的简写，如 where <displayField> like '%<text>%'。该文本是区分大小写的。
  // 如果指定了WHERE参数，这个参数会被忽略。
  private _text: string

  // 输入几何图形的空间坐标系ID
  private _inSR: number

  // 在执行查询时要应用在输入几何体上的空间关系。支持的空间关系包括相交、包含、包络相交、内部等。
  // 默认的空间关系是相交
  private _spatialRel = EsriSpatialRelRelation.Intersects

  // 在进行查询操作时可应用的空间关联函数
  private _relationParam: string

  // 用于查询筛选器的WHERE子句。允许对层中的字段进行任何合法的SQL WHERE子句操作。
  private _where: string

  // 待查询的层或表的对象id。
  private _objectIds: number[]

  // 输入几何图形的缓冲距离。距离单位由单位指定。
  // 例如，如果距离为100，查询几何图形是一个点，单位设置为esriSRUnit_Meter，并返回距离该点100米内的所有点。
  private _distance: number

  // 计算缓冲距离的单位
  // 该参数仅在supportsQueryWithDistance为true时有效
  private _units: EsriSRUnit

  // 要包含在返回结果集中的字段列表。如果在返回字段列表中指定形状字段，则会忽略该字段。要请求几何，将returnGeometry设置为true。
  // 也可以指定通配符“*”作为该参数的值。在这种情况下，查询结果包括所有字段值。
  private _outFields: string[] | '*'

  // 返回的几何图形的空间引用的ID。
  // 如果未指定outSR，则在映射的空间引用中返回几何图形。
  private _outSR: number

  // 如果为true，响应只包含对象id数组。否则响应就是一个要素集。默认为false。
  // 注意，虽然在要素集响应中包含的要素数量是有限制的，但是在ID数组响应中返回的对象ID数量是没有限制的。客户端可以通过指定returnIdsOnly=true并随后为对象id的子集请求要素集来获得所有符合对象id的查询。
  private _returnIdsOnly = false

  // 如果为true，响应只包括查询返回的计数(要素/记录的数量)。
  // 否则响应就是一个要素集。默认为false。该选项取代returnIdsOnly参数。
  private _returnCountOnly = false

  // 如果为true，则响应只包括查询将返回的要素的范围。如果returnCountOnly=true，响应将返回计数和范围。
  // 默认为false。该参数仅当层的supportsReturningQueryExtent属性为true时应用。
  private _returnExtentOnly = false

  // 一个或多个要素/记录需要排序的字段名或表达式。使用ASC或DESC分别升序或降序。
  // Syntax: orderByFields=expression1 <ORDER>, expression2 <ORDER>, expression3 <ORDER>
  // Example: orderByFields=STATE_NAME ASC, RACE DESC, GENDER
  // Example: orderByFields=POPULATION / SHAPE_AREA
  private _orderByFields: string[]

  // 要计算的一个或多个基于字段的统计信息的定义。
  private _outStatistics: QueryOutStatistic[]

  //一个或多个字段名，使用的值需要分组以计算统计信息。
  // Syntax: groupByFieldsForStatistics=expression1, expression2
  // Example: groupByFieldsForStatistics=STATE_NAME, GENDER
  // Example: groupByFieldsForStatistics=extract(month from incident_date) to group by month when StandardizedQueries is enabled.
  private _groupByFieldsForStatistics: string[]

  // 如果为true，则根据outFields中指定的字段返回不同的值。
  // 该参数仅当层的supportsAdvancedQueries属性为true时有效。
  private _returnDistinctValues: boolean

  // 如果为true，在输出几何图形中返回真曲线;否则，曲线会被转换成密集的折线或多边形。
  private _returnTrueCurves: boolean

  // 通过跳过指定数量的记录并从下一条记录(例如resultOffset + 1th)开始获取查询结果，可以使用该选项。默认值为0。
  // 该参数仅在supportsPagination为真时有效。
  // 可以使用此选项获取超过maxRecordCount的记录。
  // 例如，如果maxRecordCount是1000，您可以通过设置resultOffset=1000和resultRecordCount =100来获得下一个100条记录;查询结果的返回范围为1001 ~ 1100。
  private _resultOffset = 0

  // 此选项可用于获取指定的resultRecordCount之前的查询结果。
  // 当指定resultOffset但没有指定此参数时，映射服务默认为maxRecordCount。
  // 该参数的最大值是层的maxRecordCount属性的值。
  private _resultRecordCount: number

  // 地图区间值 通过指定的区间范围或者单值，在导出地图时从图层过滤要素数据
  private _rangeValues: MapRangeValue[]

  // 图层区间值 通过指定的区间范围或单值，在筛选图层要素
  private _parameterValues: MapRangeValue[]

  constructor(url: string) {
    super(url)
    this._declaredClass = 'pv-arcgis.service.QueryOperation'
  }

  protected getResquestUrl(): string {
    let resquestUrl = this.url + '/query?'
    try {
      resquestUrl += this.escap()
    } catch (error) {
      throw error
    }
    return resquestUrl
  }

  protected escap(): string {
    const object = {
      where: this._where,
      text: this._text,
      inSR: this._inSR,
      outSR: this._outSR,
      spatialRel: this._spatialRel,
      relationParam: this._relationParam,
      objectIds: ObjectEscapString(this._objectIds),
      distance: this._distance,
      units: this._units,
      outFields: ObjectEscapString(this._outFields),
      returnIdsOnly: this._returnIdsOnly,
      returnCountOnly: this._returnCountOnly,
      returnExtentOnly: this._returnExtentOnly,
      orderByFields: ObjectEscapString(this._orderByFields),
      outStatistics: this._outStatistics,
      groupByFieldsForStatistics: ObjectEscapString(
        this._groupByFieldsForStatistics
      ),
      returnDistinctValues: this._returnDistinctValues,
      returnTrueCurves: this._returnTrueCurves,
      resultOffset: this._resultOffset,
      resultRecordCount: this._resultRecordCount,
      rangeValues: ObjectEscapString(this._rangeValues, false),
      parameterValues: MapRangeValueEscapString(this._parameterValues),
    }
    return ObjectEscapString(object) + super.escap()
  }

  get Text(): string {
    return this._text
  }
  set Text(newText: string) {
    this._text = newText
  }

  get InSR(): number {
    return this._inSR
  }
  set InSR(newSRWKID) {
    this._inSR = newSRWKID
  }

  get SpatialRel(): EsriSpatialRelRelation {
    return this._spatialRel
  }
  set SpatialRel(newRel: EsriSpatialRelRelation) {
    this._spatialRel = newRel
  }

  get RelationParam(): string {
    return this._relationParam
  }
  set RelationParam(newParam: string) {
    this._relationParam = newParam
  }

  get WHERE(): string {
    return this._where
  }
  set WHERE(newSynatx: string) {
    this._where = newSynatx
  }
  get ObjectIds(): number[] {
    return this._objectIds
  }
  set ObjectIds(newVlaue: number[]) {
    this._objectIds = newVlaue
  }

  get Distance(): number {
    return this._distance
  }
  set Distance(newValue: number) {
    this._distance = newValue
  }

  get Units(): EsriSRUnit {
    return this._units
  }
  set Units(newValue: EsriSRUnit) {
    this._units = newValue
  }

  get OutFields(): string[] | '*' {
    return this._outFields
  }
  set OutFields(outFields: string[] | '*') {
    this._outFields = outFields
  }

  get OutSR(): number {
    return this._outSR
  }
  set OutSR(outSr: number) {
    this._outSR = outSr
  }

  get ReturnIdsOnly(): boolean {
    return this._returnIdsOnly
  }
  set ReturnIdsOnly(newValue: boolean) {
    this._returnIdsOnly = newValue
  }

  get ReturnCountOnly(): boolean {
    return this._returnCountOnly
  }
  set ReturnCountOnly(newValue: boolean) {
    this._returnCountOnly = newValue
  }

  get ReturnExtentOnly(): boolean {
    return this._returnExtentOnly
  }
  set ReturnExtentOnly(newValue: boolean) {
    this._returnExtentOnly = newValue
  }

  get OrderByFields(): string[] {
    return this._orderByFields
  }
  set OrderByFields(newValue: string[]) {
    this._orderByFields = newValue
  }

  get OutStatistics(): QueryOutStatistic[] {
    return this._outStatistics
  }
  set OutStatistics(outStatistics: QueryOutStatistic[]) {
    this._outStatistics = outStatistics
  }

  get GroupByFieldsForStatistics(): string[] {
    return this._groupByFieldsForStatistics
  }
  set GroupByFieldsForStatistics(newValue: string[]) {
    this._groupByFieldsForStatistics = newValue
  }

  get ReturnDistinctValues(): boolean {
    return this._returnDistinctValues
  }
  set ReturnDistinctValues(newValue: boolean) {
    this._returnDistinctValues = newValue
  }

  get ReturnTrueCurves(): boolean {
    return this._returnTrueCurves
  }
  set ReturnTrueCurves(newVlaue: boolean) {
    this._returnTrueCurves = newVlaue
  }

  get ResultOffset(): number {
    return this._resultOffset
  }
  set ResultOffset(newValue: number) {
    this._resultOffset = newValue
  }

  get RangeValues(): MapRangeValue[] {
    return this._rangeValues
  }
  set RangeValues(newValue: MapRangeValue[]) {
    this._rangeValues = newValue
  }

  get ParameterValues(): MapRangeValue[] {
    return this.ParameterValues
  }
  set ParameterValues(newVlaue: MapRangeValue[]) {
    this._parameterValues = newVlaue
  }
}

function MapRangeValueEscapString(parameterValues: MapRangeValue[]): string {
  const RangeValueString: string[] = []
  if (!parameterValues) {
    return ''
  }
  parameterValues.forEach((rangeValue) => {
    RangeValueString.push(
      `"${rangeValue.name}":` + ObjectEscapString(rangeValue.value, false)
    )
  })
  return '{' + RangeValueString.join(',') + '}'
}

export { QueryOperation }
