/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-29 18:28:50
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-02 17:26:53
 * @FilePath: \pv-gis-libs\packages\arcgis\core\src\geometry\ExtentExExample.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

import { arcgisApiRequests } from '../index'
import { arcgisApiPaths } from '../index'

type modulesType = [__esri.ExtentConstructor]
interface ExtentEx extends __esri.Extent {
  fn(): void
  // fm():void
}

type ExtentProperties = __esri.ExtentProperties

interface IExtentEx {
  new (properties?: ExtentProperties): ExtentEx
  fm(): void
}

export async function getExtentEx(): Promise<IExtentEx> {
  const modules = [arcgisApiPaths.Extent]
  const [Extent] = await arcgisApiRequests<modulesType>(modules)

  class ExtentEx extends Extent {
    constructor() {
      super()
      console.log('🌏🌏🌏', this)
    }
    fn() {
      console.log('fnnnnnnnnnnnnnnnn')
    }
    static fm() {
      console.log('fmmmmmmmmm')
    }
  }

  return ExtentEx
}
