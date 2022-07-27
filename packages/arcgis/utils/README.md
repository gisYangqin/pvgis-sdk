<!--
 * @Author: liyb liyanbin05@cnpc.com.cn
 * @Date: 2022-05-05 10:42:36
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-05 01:52:02
 * @FilePath: \sod_com_gisc:\develop\work\sod\SOD_GIS_Products\pv-gis-libs\packages\utils\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# `@pv-aarcgis/utils`

> TODO: description
> GIS 公用的一些方法，主要针对数据处理相关

## 用法

```
//getZoomToObject用法示例

import { getZoomToObject, QueryLayer } from '@pv-arcgis/utils/src'

featLayers:FeatureLayer[]
getZoomToObject(mapView.view, featLayers)
    .then((zoomToObject) => { mapView.goTo(zoomToObject) })

graphics:Graphic[]
getZoomToObject(mapView, [], [], graphics)
    .then((zoomToObject) => {mapView.goTo(zoomToObject) })

## API 介绍
暂无