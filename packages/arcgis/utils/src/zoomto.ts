// import MapView from 'esri/views/MapView'
// import Geometry from 'esri/geometry/Geometry'
// import Graphic from 'esri/Graphic'
// import Extent from 'esri/geometry/Extent'
// import * as query from 'esri/rest/query'
// import Query from 'esri/rest/support/Query'
// import Point from 'esri/geometry/Point'
// import FeatureLayer from 'esri/layers/FeatureLayer'
// import * as projection from 'esri/geometry/projection'
// import { getExtentEx,arcgisApiRequests, arcgisApiPaths } from '@pv-arcgis/core/src'
import { getILayerMeta, LayerType } from '@pv-arcgis/services/src'
import {
  getIExtentEx,
  arcgisApiRequests,
  arcgisApiPaths,
} from '@pv-arcgis/core/src'
// 计算自定义的缩放返回的对象
// 当获取到该对象时，直接调用view.goTo(ZoomtoObject)即可

interface ZoomToObject {
  target: [number, number]
  zoom: number
}

interface QueryLayer {
  mapLayerURL: string
  definitionExpression?: string
}

interface ExtentListObject {
  extents: __esri.Extent[]
  count: number
}

enum ZoomToType {
  SINGLESHAPE = 1,
  MUTILSHAPE = 2,
  PANTO = 3,
}

type modulesType = [
  typeof __esri.query,
  typeof __esri.Query,
  typeof __esri.FeatureLayer
]

/**
 * @description: 计算传入的图层，几何，图形构成的所有的四至范围列表，以及几何图形的个数
 * @param { QueryLayer[] } 查询图层数组
 * @param { Geometry[] } 几何形状数组
 * @param { Graphic[] } 图形数组
 * @return { ExtentListObject } 返回一个对象，包含一个Extent数组和缩放图形的个数
 */
async function getExtentList(
  queryLayers?: QueryLayer[],
  geometries?: __esri.Geometry[],
  graphices?: __esri.Graphic[]
): Promise<ExtentListObject> {
  const layerMeta = await getILayerMeta()
  const ExtentEx = await getIExtentEx()
  const [query, Query, FeatureLayer] = await arcgisApiRequests<modulesType>([
    arcgisApiPaths.query,
    arcgisApiPaths.QueryParameters,
    arcgisApiPaths.FeatureLayer,
  ])
  const extents: __esri.Extent[] = []
  let count = 0

  if (queryLayers && queryLayers.length > 0) {
    for (let i = 0; i < queryLayers.length; ++i) {
      const queryLayer = queryLayers[i]
      const layerType = await layerMeta.getLayerType(queryLayer.mapLayerURL)

      if (
        layerType === LayerType.FeatureLayer &&
        queryLayer.definitionExpression !== null
      ) {
        const executeExtent = await query.executeForExtent(
          queryLayer.mapLayerURL,
          new Query({ where: queryLayer.definitionExpression })
        )
        // 当查询为空，或者查询结果为单点时需要额外测试
        extents.push(executeExtent.extent as __esri.Extent)
        count += executeExtent.count
      } else {
        const extent = await layerMeta.getLayerExtent(queryLayer.mapLayerURL)
        extents.push(extent)
        if (layerType === LayerType.FeatureLayer) {
          const layer = new FeatureLayer({ url: queryLayer.mapLayerURL })
          count += await layer.queryFeatureCount()
        } else {
          count += 2
        }
      }
    }
  }

  if (geometries && geometries.length > 0) {
    geometries.forEach((value) => {
      extents.push(ExtentEx.getExtent(value))
    })
    count += geometries.length
  }

  if (graphices && graphices.length > 0) {
    graphices.forEach((graphic) => {
      const graphicExtent = ExtentEx.getExtent(graphic.geometry)
      extents.push(graphicExtent)
    })
    count += graphices.length
  }

  return {
    extents,
    count,
  }
}

/**
 * @description: 获取地图缩放对象
 * @param { MapView }  MapView 地图视图对象
 * @param { QueryLayer[] } QueryLayer[] 查询图层数组
 * @param { Geometry[] } Geometry[] 几何形状数组
 * @param { Graphic[] } Graphic[] 图形数组
 * @return {*}
 */
async function getZoomToObject(
  mapView: __esri.MapView,
  queryLayers?: QueryLayer[],
  geometries?: __esri.Geometry[],
  graphices?: __esri.Graphic[],
  type: ZoomToType = ZoomToType.SINGLESHAPE
): Promise<ZoomToObject> {
  const ExtentEx = await getIExtentEx()

  // 地图有效区域要根据修正量修正，确保缩放后要素仅出现于有效区域内，不被地图边缘的其他要素遮挡干扰
  // 以下4个常量分别为地图视窗在左右上下的裁剪距离（像素）
  const MAP_PADDING_LEFT = 20
  const MAP_PADDING_RIGHT = 285
  const MAP_PADDING_TOP = 60
  const MAP_PADDING_BOTTOM = 55

  // 宽度和高度修正值
  const WIDTH_FIX = -(MAP_PADDING_LEFT + MAP_PADDING_RIGHT)
  const HEIGHT_FIX = -(MAP_PADDING_TOP + MAP_PADDING_BOTTOM)

  // 页面占比范围
  let PAGEEPRCENT_MIN = 0.1
  let PAGEEPRCENT_MAX = 0.6

  const mapWidthPiexl = mapView.width + WIDTH_FIX
  const mapHeightPiexl = mapView.height + HEIGHT_FIX

  // 图层查询如果是空或单点时需要测试
  let extents: __esri.Extent[] = []
  const extentListObject = await getExtentList(
    queryLayers,
    geometries,
    graphices
  )

  extents = extentListObject.extents
  // 当缩放的不是单个图形而是多个图形时，页面比例应该需要更加撑满页面
  if (extentListObject.count > 1 || type === ZoomToType.MUTILSHAPE) {
    PAGEEPRCENT_MIN = 0.48
    PAGEEPRCENT_MAX = 0.96
  }

  // 通过之前获取的四至范围列表，获取一个联合后的四至
  const [projection] = await arcgisApiRequests<[typeof __esri.projection]>([
    arcgisApiPaths.projection,
  ])
  let extent = null
  if (extents.length > 0) {
    const unionExtent = ExtentEx.unionMutilExtent(extents)
    if (unionExtent !== null) {
      extent = projection.project(unionExtent, {
        wkid: mapView.spatialReference.wkid,
      }) as __esri.Extent
    }
  }
  // 当没有几何形状时，四至对象为空，或仅为平移时
  if (extent === null || type === ZoomToType.PANTO) {
    console.log('extent is null')
    return {
      target: [mapView.center.longitude, mapView.center.latitude],
      zoom: mapView.zoom,
    }
  } else {
    // 当几何仅有一个点，四至对象的宽高都无限接近于0
    const LIMITMINVALUE = 0.00000001

    const mapWorkAreaWidth = mapWidthPiexl * mapView.resolution
    const mapWorkAreaHeight = mapHeightPiexl * mapView.resolution
    const scale = Math.max(
      extent.width / mapWorkAreaWidth,
      extent.height / mapWorkAreaHeight
    )

    let zoom = mapView.zoom
    if (extent.width > LIMITMINVALUE || extent.height > LIMITMINVALUE) {
      if (scale < PAGEEPRCENT_MIN) {
        zoom = zoom + Math.ceil(Math.log2(PAGEEPRCENT_MIN / scale))
      }
      if (scale > PAGEEPRCENT_MAX) {
        zoom = zoom - Math.ceil(Math.log2(scale / PAGEEPRCENT_MAX))
      }
    }

    // 根据屏幕计算最小的缩放等级
    const piexlPerTile = 256
    const minZoom = Math.ceil(
      Math.log2(Math.max(mapView.width, mapView.height) / piexlPerTile)
    )
    if (zoom < minZoom) {
      zoom = minZoom
    }
    // 比例尺最大为17级，再大可能会出现某些区域没有背景地图数据
    if (zoom > 17) {
      zoom = 17
    }

    // 地图中心点的偏移距离计算
    const offsetDx =
      ((MAP_PADDING_RIGHT - MAP_PADDING_LEFT) / 2) *
      mapView.resolution *
      Math.pow(2, mapView.zoom - zoom)
    const offsetDy =
      ((MAP_PADDING_TOP - MAP_PADDING_BOTTOM) / 2) *
      mapView.resolution *
      Math.pow(2, mapView.zoom - zoom)
    extent.offset(offsetDx, offsetDy, 0)
    const center = extent.center.clone()
    return {
      target: [center.longitude, center.latitude],
      zoom: zoom,
    }
  }
}

export { getZoomToObject, ZoomToType, QueryLayer }
