/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-11 00:57:52
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-03 22:22:55
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\layerMeta\layerMeta.ts
 * @Description:与GIS Server中地图服务图层相关的元数据的获取相关方法
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import { arcgisApiRequests, arcgisApiPaths } from '@pv-arcgis/core/src'

type modulesType = [typeof __esri.Extent]

/**
 * @name: LayerType
 * @description: 地图服务图层类型枚举
 */
enum LayerType {
  FeatureLayer = 'Feature Layer',
  GroupLayer = 'Group Layer',
}

interface ILayerMeta {
  getLayerType(layerURL: string): Promise<LayerType>
  getLayerExtent(layerURL: string): Promise<__esri.Extent>
  getLayerJsonURL(layerURL: string): string
}

async function getILayerMeta(): Promise<ILayerMeta> {
  const modules = [arcgisApiPaths.Extent]
  const [Extent] = await arcgisApiRequests<modulesType>(modules)
  /**
   * @name: layerMeta
   * @description: 地图服务图层元数据类
   * ```调用示例
   * 略
   * ```
   */
  class layerMeta {
    /**
     * @description: 私有静态方法，通过图层url获取对应的元数据json
     * @param {string} layerURL 图层的url
     * @return {*} json结构的元数据
     */
    private static async _getJson(layerURL: string) {
      const respone = await fetch(this.getLayerJsonURL(layerURL))
      const json = await respone.json()
      return json
    }

    /**
     * @description: 静态方法，获取图层的类型
     * @param {string} layerURL 图层的url
     * @return {*} LayerType枚举的其中一个类型
     */
    static async getLayerType(layerURL: string): Promise<LayerType> {
      const json = await this._getJson(layerURL)
      return json.type
    }

    /**
     * @description: 静态方法，获取图层的四至范围
     * @param {string} layerURL 图层的url
     * @return {*} 图层四至范围的Extent对象
     */
    static async getLayerExtent(layerURL: string): Promise<__esri.Extent> {
      const json = await this._getJson(layerURL)
      return new Extent(json.extent)
    }

    /**
     * @description: 获取请求json数据的url地址
     * @param {string} layerURL 图层的url
     * @return {*} 请求json的url地址
     */
    static getLayerJsonURL(layerURL: string): string {
      return layerURL + '?f=pjson'
    }

    /**
     * @description: 通过 {FeatureLayer} 对象获取完整的图层地址
     * @param {FeatureLayer} featureLayer
     * @return {*}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getLayerURL(featureLayer: __esri.FeatureLayer): string {
      return featureLayer.url + '/' + featureLayer.layerId.toString()
    }
  }

  return layerMeta
}
export { getILayerMeta, LayerType }
