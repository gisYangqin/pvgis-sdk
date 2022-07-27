/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-30 06:05:50
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-04 20:11:59
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\geometry\geometryEngineEx.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import { arcgisApiRequests } from '../arcgis-api-request'
import arcgisApiPaths from '../arcgis-api-paths'
import { GeometryType } from './geometryType'
import { getRandomByRange } from '../math/random'
// import { Point } from 'esri/geometry'

type modulesType = [
  typeof __esri.Polygon,
  typeof __esri.Polyline,
  typeof __esri.projection,
  typeof __esri.Extent,
  typeof __esri.SpatialReference,
  typeof __esri.geometryEngine
]

interface IGeometryEngineEx {
  /**
   * @description: 以一个点为基准，缩放一个折线或者多边形
   * @param { Polygon | Polyline } geo 要缩放的折线或者多边形
   * @param { number } factor 缩放比例因子，大于1时是扩大，小于1时是缩小。负数为对称反转
   * @param { Point } point 可选参数，缩放的基准点，如果不传入则自动用缩放的图形的中心点作为基准点
   */
  expandGeometry(
    geo: __esri.Polygon | __esri.Polyline,
    factor: number,
    point?: __esri.Point
  ): __esri.Geometry

  //合并多个多边形
  unionPolygon(polygonList: __esri.Polygon[]): __esri.Polygon

  // 获取一个默认的四至范围
  unionPolygon(polygonList: __esri.Polygon[]): __esri.Polygon

  // 随机获取一个点
  createRandomPoint(extent?: __esri.Extent): __esri.Point

  // 随机获取一根折线
  createRandomPolyline(extent?: __esri.Extent): __esri.Polyline

  // 随机返回一个多边形
  createRandomPolygon(extent?: __esri.Extent): __esri.Polygon

  // 返回一个四至为全球范围的Extent
  // private _getDefaultExtent(): __esri.Extent
}

export async function getIGeometryEngineEx(): Promise<IGeometryEngineEx> {
  const modules = [
    arcgisApiPaths.Polygon,
    arcgisApiPaths.Polyline,
    arcgisApiPaths.projection,
    arcgisApiPaths.Extent,
    arcgisApiPaths.SpatialReference,
    arcgisApiPaths.geometryEngine,
  ]
  const [
    Polygon,
    Polyline,
    projection,
    Extent,
    SpatialReference,
    geometryEngine,
  ] = await arcgisApiRequests<modulesType>(modules)

  /**
   * @name:  geometryEngineEx
   * @description: 几何引擎扩展类型，增加了一些ArcGIS geometryEngine类没有的功能
   * ```调用示例
   * test
   * ```
   */
  class geometryEngineEx {
    /**
     * @description: 以一个点为基准，缩放一个折线或者多边形
     * @param { Polygon | Polyline } geo 要缩放的折线或者多边形
     * @param { number } factor 缩放比例因子，大于1时是扩大，小于1时是缩小。负数为对称反转
     * @param { Point } point 可选参数，缩放的基准点，如果不传入则自动用缩放的图形的中心点作为基准点
     */
    static expandGeometry(
      geo: __esri.Polygon | __esri.Polyline,
      factor: number,
      point?: __esri.Point
    ): __esri.Geometry {
      let coordinateLsit: number[][][]
      if (geo.type === GeometryType.Polyline) {
        coordinateLsit = geo.paths
      } else if (geo.type === GeometryType.Polygon) {
        coordinateLsit = geo.rings
      } else {
        // 如果传入的不是折线和多边形，返回图形自身
        return geo
      }
      // 当传入的图形为空几何时，直接返回
      if (coordinateLsit.length === 0) {
        console.warn('几何为空')
        return geo
      }
      // 当没有传入基准点时，计算图形的中心点作为基点
      if (!point) {
        try {
          point = geo.extent.center
        } catch (error) {
          console.error('error', error)
        }
      }
      if (point) {
        // 比较传入的点和几何形状坐标系是否一致，不一致时需要转换坐标系
        if (point.spatialReference !== geo.spatialReference) {
          point = projection.project(point, {
            wkid: geo.spatialReference.wkid,
          }) as __esri.Point
        }

        //循环图形内每个坐标点，计算缩放后的坐标点
        for (let i = 0; i < coordinateLsit.length; ++i) {
          for (let j = 0; j < coordinateLsit[i].length; ++j) {
            coordinateLsit[i][j][0] =
              ((coordinateLsit[i][j][0] as number) - point.x) * factor + point.x
            coordinateLsit[i][j][1] =
              ((coordinateLsit[i][j][1] as number) - point.y) * factor + point.y
          }
        }
      }

      if (geo.type === GeometryType.Polyline) {
        return {
          type: 'polyline',
          paths: coordinateLsit,
          spatialReference: { wkid: geo.spatialReference.wkid },
        } as __esri.Polyline
      } else {
        return {
          type: 'polygon',
          rings: coordinateLsit,
          spatialReference: { wkid: geo.spatialReference.wkid },
        } as __esri.Polygon
      }
    }

    // 随机获取一个点对象
    static createRandomPoint(extent?: __esri.Extent): __esri.Point {
      if (!extent) {
        extent = this._getDefaultExtent()
      }

      // return new Point({
      //   longitude: getRandomByRange(extent.xmax, extent.xmin),
      //   latitude: getRandomByRange(extent.ymax, extent.ymin),
      //   spatialReference: extent.spatialReference as __esri.SpatialReference,
      // })
      return {
        type: 'point',
        longitude: getRandomByRange(extent.xmax, extent.xmin),
        latitude: getRandomByRange(extent.ymax, extent.ymin),
        spatialReference: { wkid: extent.spatialReference.wkid },
      } as __esri.Point
    }

    // 随机生成一根折线对象
    static createRandomPolyline(extent?: __esri.Extent): __esri.Polyline {
      if (!extent) {
        extent = this._getDefaultExtent()
      }

      // 随机一个数为折线的顶点数
      let pointCount = 0
      do {
        pointCount += Math.floor(Math.random() * 10)
      } while (Math.random() > 0.9)

      if (pointCount < 3) {
        pointCount = 3
      }
      const paths: number[][][] = [[]]
      for (let i = 0; i < pointCount; i++) {
        const x = getRandomByRange(extent.xmax, extent.xmin)
        const y = getRandomByRange(extent.ymax, extent.ymin)
        paths[0].push([x, y])
      }
      return new Polyline({
        paths: paths,
        spatialReference: { wkid: extent.spatialReference.wkid },
      }) as __esri.Polyline
    }

    // 随机生成一个多边形对象
    static createRandomPolygon(extent?: __esri.Extent): __esri.Polygon {
      if (!extent) {
        extent = this._getDefaultExtent()
      }

      // 随机一个数为,作为三角形数量
      let triangleCount = 1
      do {
        triangleCount += Math.floor(Math.random() * 10)
      } while (Math.random() > 0.9)
      const triangleList: __esri.Polygon[] = []
      for (let i = 0; i < triangleCount; ++i) {
        const rings: number[][][] = [[]]
        for (let j = 0; j < 3; ++j) {
          const x = getRandomByRange(extent.xmax, extent.xmin)
          const y = getRandomByRange(extent.ymax, extent.ymin)
          rings[0].push([x, y])
        }
        rings[0].push(rings[0][0])
        const polygon = {
          type: 'polygon',
          rings: rings,
          spatialReference: { wkid: extent.spatialReference.wkid },
        } as __esri.Polygon
        triangleList.push(geometryEngine.simplify(polygon) as __esri.Polygon)
      }

      triangleList.forEach((geo) => {
        if (!geo.spatialReference) {
          console.log('geometry spatialReference undefine')
        }
      })

      return this.unionPolygon(triangleList)
    }

    /**
     * @description: 合并多个多边形
     * @return {*}
     */
    static unionPolygon(polygonList: __esri.Polygon[]): __esri.Polygon {
      let polygon: __esri.Polygon

      if (polygonList.length > 0) {
        polygon = polygonList[0].clone()
      } else {
        return new Polygon()
      }

      for (let i = 1; i < polygonList.length; ++i) {
        if (!polygonList[i].spatialReference) {
          console.log('read polygon error!')
          continue
        }
        let p: __esri.Polygon
        if (polygonList[i].spatialReference !== polygon.spatialReference) {
          p = projection.project(
            polygonList[i],
            polygon.spatialReference
          ) as __esri.Polygon
        } else {
          p = polygonList[i]
        }

        // p.rings.forEach((ring) => polygon.addRing(ring))
        polygon = geometryEngine.union([polygon, p]) as __esri.Polygon
        polygon = geometryEngine.simplify(polygon) as __esri.Polygon
      }

      return polygon
    }

    // 获取一个默认的四至范围
    private static _getDefaultExtent(): __esri.Extent {
      return new Extent({
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: SpatialReference.WGS84,
      })
    }
  }

  return geometryEngineEx
}
