/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-07-07 18:12:06
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-07-17 18:28:50
 * @FilePath: \pv-gis-libs\packages\arcgis\services\src\ServiceOperation\FindOperation.ts
 * @Description:
 *
 * Copyright (c) 2022 by yangqin03@cnpc.com.cn, All Rights Reserved.
 */

import { ServiceResquest } from './base'

class FindOperation extends ServiceResquest {
  //搜索文本 用户指定的用于通过图层和字段搜索的字符串
  private _searchText: string

  //是否包含 如果为flase,完全匹配搜索文本，区分大小写。否则搜索包含提供搜索文本的值，不区分大小写。默认为True
  private _contains = true

  //搜索字段 字段名称列表，如果不指定，则搜索全部字段
  private _searchFields: string[]

  constructor(url: string) {
    super(url)
    this._declaredClass = 'pv-arcgis.service.ServiceOperation'
  }

  get SearchText(): string {
    return this._searchText
  }
  set SearchText(newValue: string) {
    this._searchText = newValue
  }
  private SearchTextEscap(): string {
    if (this._searchText && this._searchText.length > 0) {
      return 'searchText=' + this._searchText + '&'
    } else {
      return ''
    }
  }

  get Contains(): boolean {
    return this._contains
  }
  set Contains(newVlaue: boolean) {
    this._contains = newVlaue
  }
  private ContainsEscap(): string {
    if (this._contains) {
      return ''
    } else {
      return 'contains=false&'
    }
  }

  get SearchFields(): string[] {
    return this._searchFields
  }
  set SearchFields(newValue: string[]) {
    this._searchFields = newValue
  }
  private SearchFieldsEscap(): string {
    if (this._searchFields.length === 0) {
      return ''
    }
    let ss = 'searchFields='
    this._searchFields.forEach((field) => {
      ss += field + ','
    })
    return ss.substring(0, ss.length - 1) + '&'
  }

  async excute(): Promise<unknown> {
    const url = this.getResquestUrl()
    const respone = await fetch(url)
    return respone.json()
  }

  getParameterObject(): unknown {
    throw new Error('Method not implemented.')
  }

  protected getResquestUrl(): string {
    let resquestUrl = this.url + '/find?'

    try {
      resquestUrl +=
        this.SearchTextEscap() + this.ContainsEscap() + this.SearchFieldsEscap()
      resquestUrl += super.getResquestUrl()
    } catch (error) {
      throw error
    }
    return resquestUrl
  }

  sr() {
    return `${this.Fromat}`
  }
}

export { FindOperation }
