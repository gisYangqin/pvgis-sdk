/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-01 20:29:19
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-04 07:36:55
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\geometry\ExtentEx.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

import { arcgisApiRequests } from '../arcgis-api-request'
import arcgisApiPaths from '../arcgis-api-paths'
import { GeometryType } from './geometryType'

type modulesType = [__esri.ExtentConstructor, __esri.projection]

type ExtentEx = __esri.Extent

type ExtentProperties = __esri.ExtentProperties

interface IExtentEx {
  new (properties?: ExtentProperties): ExtentEx
  createDefaultExtent(): __esri.Extent
  getExtent(geometry: __esri.Geometry): __esri.Extent
  unionExtent(extent1: __esri.Extent, extent2: __esri.Extent): __esri.Extent
  unionMutilExtent(extents: __esri.Extent[]): __esri.Extent | null
}

/**
 * @description:传入两个数，获取最大值，如果传入的数值为Undefined,则取另一个值。
 * 该函数在于解决点的Extent类四至undefine,在合并点和一个已有的Extent计算时调用。
 * @return {*}
 */
function max(
  n1: number | undefined,
  n2: number | undefined
): number | undefined {
  if (typeof n1 === 'undefined') {
    return n2
  }

  if (typeof n2 === 'undefined') {
    return n1
  }

  return Math.max(n1, n2)
}

/**
 * @description:传入两个数，获取最小值，如果传入的数值为Undefined,则取另一个值。
 * 该函数在于解决点的Extent类四至undefine,在合并点和一个已有的Extent计算时调用。
 * @return {*}
 */
function min(
  n1: number | undefined,
  n2: number | undefined
): number | undefined {
  if (typeof n1 === 'undefined') {
    return n2
  }

  if (typeof n2 === 'undefined') {
    return n1
  }

  return Math.min(n1, n2)
}

export async function getIExtentEx(): Promise<IExtentEx> {
  const modules = [arcgisApiPaths.Extent, arcgisApiPaths.projection]
  const [Extent, projection] = await arcgisApiRequests<modulesType>(modules)

  class ExtentEx extends Extent {
    constructor() {
      super()
    }

    /**
     * @description:静态方法，创建一个默认的空间四至范围
     * @return {*}
     */
    static createDefaultExtent() {
      return new Extent({
        xmin: -180,
        xmax: 180,
        ymin: -90,
        ymax: 90,
        spatialReference: { wkid: 4326 },
      })
    }

    /**
     * @description: 获取一个点的Extent.因为ArcGIS API中点对象的四至范围为空，无法和已有的Extent类合并，
     * 因此定义一个长，高都为0的Extent.
     * @return {*}
     */
    static getExtent(geometry: __esri.Geometry): __esri.Extent {
      if (geometry.type === GeometryType.Point) {
        const point = geometry as __esri.Point
        return new Extent({
          xmin: point.x,
          xmax: point.x,
          ymin: point.y,
          ymax: point.y,
          spatialReference: { wkid: point.spatialReference.wkid },
        })
      } else {
        return geometry.extent.clone()
      }
    }

    /**
     * @description:静态方法，合并两个Extent对象
     * @return {*}
     */
    static unionExtent(
      extent1: __esri.Extent,
      extent2: __esri.Extent
    ): __esri.Extent {
      // eslint-disable-next-line eqeqeq
      let extent = extent2.clone()
      if (extent1.spatialReference !== extent2.spatialReference) {
        extent = projection.project(extent2, {
          wkid: extent1.spatialReference.wkid,
        }) as __esri.Extent
      }

      return new Extent({
        xmin: min(extent1.xmin, extent.xmin),
        xmax: max(extent1.xmax, extent.xmax),
        ymin: min(extent1.ymin, extent.ymin),
        ymax: max(extent1.ymax, extent.ymax),
        spatialReference: { wkid: extent1.spatialReference.wkid },
      })
    }

    /**
     * @description:静态方法，合并多个Extent对象
     * @return {*}
     */
    static unionMutilExtent(extents: __esri.Extent[]): __esri.Extent | null {
      let extent: __esri.Extent

      if (extents.length === 0) {
        return null
      } else {
        extent = (<__esri.Extent>extents[0]).clone()
      }

      for (let i = 1; i < extents.length; ++i) {
        extent = this.unionExtent(extent, extents[i])
      }

      return extent
    }
  }
  return ExtentEx
}
