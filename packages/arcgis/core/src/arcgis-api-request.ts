/*
 * @Author: liyb
 * @Email: liyanbin05@cnpc.com.cn
 * @Date: 2022-05-27 09:41:49
 * @LastEditTime: 2022-05-30 15:40:24
 * @LastEditors: your name
 * @Description: arcgis api 模块加载
 */
import { ILoadScriptOptions, loadModules } from 'esri-loader'

/**
 * @description: 获取arcgis api 模块
 * @param {string[]} modulePaths 模块路径
 * @param {ILoadScriptOptions} loadModuleOptions 模块加载选项
 * @return {Promise<T>} 返回模块
 */
async function arcgisApiRequests<T extends unknown[]>(
  modulePaths: string[],
  loadModuleOptions: ILoadScriptOptions = {}
): Promise<T> {
  const modules: unknown[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let moduleMap = (window as any).moduleMap
  const loadModulePaths: string[] = []
  const loadModuleIndex: number[] = []
  if (moduleMap) {
    modulePaths.forEach((modulePath, i) => {
      const module = moduleMap.get(modulePath)
      if (module) {
        modules[i] = module
      } else {
        loadModulePaths.push(modulePath)
        loadModuleIndex.push(i)
      }
    })
    if (loadModulePaths.length === 0) return modules as T
    const loadedModules = await loadModules(loadModulePaths, loadModuleOptions)
    loadModuleIndex.forEach((index, i) => {
      modules[index] = loadedModules[i]
      moduleMap.set(loadModulePaths[i], loadedModules[i])
    })
    return modules as T
  } else {
    moduleMap = new Map<string, unknown>()
    const modules = await loadModules(modulePaths, loadModuleOptions)
    modulePaths.forEach((modulePath, i) => {
      moduleMap.set(modulePath, modules[i])
    })
    window['moduleMap'] = moduleMap
    return modules as T
  }
}

export { arcgisApiRequests }
