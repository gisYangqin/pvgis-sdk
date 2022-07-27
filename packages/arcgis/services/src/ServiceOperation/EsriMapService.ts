/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-06 21:23:56
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-07-28 07:07:17
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\EsriMapService.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
// 关键字查询
// 单点查询
// 几何图形查询

import Collection from 'esri/core/Collection'

// 图形
interface EsriMapService {
  getAllLayer(): Collection<__esri.Layer>
  map: __esri.Map
}

interface EsriMapServiceProperties {
  map: __esri.Map
}
interface IEsriMapService {
  new (properties?: EsriMapServiceProperties): EsriMapService
}

async function getIEsriMapService(
  params: EsriMapServiceProperties
): Promise<IEsriMapService> {
  class EsriMapService {
    map: __esri.Map

    constructor() {
      console.log('🌏🌏🌏', this)
      this.map = params.map
    }

    public getAllLayer(): Collection<__esri.Layer> {
      return this.map.layers
    }

    public addLayerToMap(): // mapserviceurl: string,
    // layerid: number,
    // filter?: string,
    // isZoomto?: boolean,
    // isflashing?: boolean,
    // hightLightfilter?: string
    void {
      console.log('addLayer')
      //定义查询结构
      //请求缩放对象并缩放地图
      //请求地图
      //高亮闪烁展示
      //高亮选择图形
      //显示字段，
      //多语言，显示字段
    }

    //layer url+id, wherer
    public removeLayerFromMap(): void {
      console.log('removeLayer')
    }
  }

  return EsriMapService
}

export { getIEsriMapService }
