/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-15 06:59:14
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-03 21:36:04
 * @FilePath: \pv-gis-libs\packages\utils\examples\zoomto\widget\GISViewTest\testUtily.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved. 
 */

import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Extent from '@arcgis/core/geometry/Extent'
import { getRandomByRange } from '@pv-arcgis/core/src'
import { getILayerMeta, LayerType } from '@pv-arcgis/services/src'
const mapServicesURL = [
  'http://localhost:6080/arcgis/rest/services/Arzew_Enviroment/MapServer',
  'http://localhost:6080/arcgis/rest/services/ArzewData/MapServer',
  'http://localhost:6080/arcgis/rest/services/EPdata/MapServer'
]

async function getLayerCount (url:string):Promise<number> {
  let n = 0
  await fetch(url + '?f=pjson')
    .then((res) => res.json())
    .then(data => {
      // console.log('getLayerCount', data.layers.length)
      n = data.layers.length
    })
  return n
}

function getExtentByFeatureLayer (featureLayer:FeatureLayer):Extent {
  return featureLayer.fullExtent
}

async function getRandomFeatureLayer ():Promise<FeatureLayer> {
  const url = mapServicesURL[Math.floor(getRandomByRange(0, mapServicesURL.length))]
  const layerCount = await getLayerCount(url)

  let type:string
  let layerid:number
  do {
    layerid = Math.floor(getRandomByRange(0, layerCount))
    const layerMeta = await getILayerMeta()
    type = await layerMeta.getLayerType(url + '/' + layerid)
  }
  while (type !== LayerType.FeatureLayer)

  return new FeatureLayer({
    // URL to the service
    url: url + '/' + layerid
  })
}
async function getRandomFeatureLayerWithfilter ():Promise<FeatureLayer> {
  const featureLayer = await getRandomFeatureLayer()
  const ids = await featureLayer.queryObjectIds()
  const count = Math.ceil(Math.random() * 9)
  console.log('featureLayer url', featureLayer.url + '/' + featureLayer.layerId)
  console.log('ids', ids)

  if (ids !== null && ids.length !== 0 && count !== 0) {
    let index = Math.floor(Math.random() * ids.length)
    console.log('index', index)
    let expression = 'OBJECTID = ' + ids[index].toString()

    for (let i = 0; i < count && i < ids.length; ++i) {
      index = Math.floor(Math.random() * ids.length)
      console.log('index', index)
      expression += ' OR OBJECTID = ' + ids[index].toString()
    }
    featureLayer.definitionExpression = expression
  } else {
    featureLayer.definitionExpression = '1 = 1'
  }

  return featureLayer
}

export { getRandomFeatureLayer, getExtentByFeatureLayer, getRandomFeatureLayerWithfilter }
