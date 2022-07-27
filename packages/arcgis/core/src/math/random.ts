/*
 * @Author: YangQin yangqin03@cnpc.com.cn
 * @Date: 2022-06-10 01:15:32
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-06-11 00:29:18
 * @FilePath: \pv-gis-libs\packages\core\src\math\random.ts
 * @Description:核心包中关于随机数相关的方法
 *
 * Copyright (c) 2022 by YangQin yangqin03@cnpc.com.cn, All Rights Reserved.
 */

/**
 * @description: 传入两个数，返回一个位于两个数之间的随机数
 * @return {number}getRandomByRange
 */
function getRandomByRange(min: number, max: number): number {
  const minValue = max > min ? min : max
  const randomNumber = Math.random() * Math.abs(max - min) + minValue
  return randomNumber
}

/**
 * @description: 传入一个枚举，随机返回其中一个枚举值
 * @param: T，一个枚举对象
 * @return {T[keyof T]}该枚举对象的其中一个枚举
 * ```调用示例
 * const enum = getRandomEnumKey();
 * ```
 */
function getRandomEnumKey<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum)
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  return enumValues[randomIndex]
}

export { getRandomByRange, getRandomEnumKey }
