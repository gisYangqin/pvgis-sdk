/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-15 05:53:23
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-04 16:30:33
 * @FilePath: \pv-gis-libs\packages\utils\examples\zoomto\main.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved. 
 */

import ArcGISMap from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GISToolBar from './widget/ToolBar/toolbar'
import { setArcgisAPIPath } from '@pv-arcgis/core/src'

setArcgisAPIPath('http://localhost/arcgis_js_api/4.23/init.js')

const map = new ArcGISMap({
    basemap: 'topo'
})

const view = new MapView({
    map,
    container: 'mapDiv',
    center: [2.244, 30.052],
    zoom: 5
})

view.when(() => { console.log("Map is loaded") })

const gisToolBar = new GISToolBar({
    view
})

view.ui.add(gisToolBar, {
    position: 'top-right'
})