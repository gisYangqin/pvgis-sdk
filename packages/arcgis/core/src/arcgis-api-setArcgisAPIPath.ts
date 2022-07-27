/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-29 21:19:36
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-02 17:19:07
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\arcgis-api-setArcgisAPIPath.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */
import { setDefaultOptions } from 'esri-loader'

// configure esri-loader to use version from a locally hosted build of the API
// NOTE: make sure this is called once before any calls to loadModules()
function setArcgisAPIPath(params: string) {
  setDefaultOptions({ url: params })
}

export { setArcgisAPIPath }
