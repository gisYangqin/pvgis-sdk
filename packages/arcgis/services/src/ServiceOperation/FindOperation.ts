/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-07 18:12:06
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 22:17:23
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\FindOperation.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

import { ObjectEscapString, ServiceResquest } from './base'

class FindOperation extends ServiceResquest {
  //搜索文本 用户指定的用于通过图层和字段搜索的字符串
  private _searchText: string

  //是否包含 如果为flase,完全匹配搜索文本，区分大小写。否则搜索包含提供搜索文本的值，不区分大小写。默认为True
  private _contains = true

  //搜索字段 字段名称列表，如果不指定，则搜索全部字段
  private _searchFields: string[]

  constructor(url: string, searchText: string, layers: number[]) {
    super(url, layers)
    this._searchText = searchText
    this._declaredClass = 'pv-arcgis.service.FindOperation'
  }

  get SearchText(): string {
    return this._searchText
  }
  set SearchText(newValue: string) {
    this._searchText = newValue
  }

  get Contains(): boolean {
    return this._contains
  }
  set Contains(newVlaue: boolean) {
    this._contains = newVlaue
  }

  get SearchFields(): string[] {
    return this._searchFields
  }
  set SearchFields(newValue: string[]) {
    this._searchFields = newValue
  }

  protected escap(): string {
    const object = {
      searchText: this._searchText,
      contains: this._contains,
      searchFields: this._searchFields,
    }
    return ObjectEscapString(object) + super.escap()
  }

  getParameterObject(): unknown {
    throw new Error('Method not implemented.')
  }

  protected getResquestUrl(): string {
    let resquestUrl = this.url + '/find?'
    try {
      resquestUrl += this.escap()
    } catch (error) {
      throw error
    }
    return resquestUrl
  }
}

export { FindOperation }
