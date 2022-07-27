import { arcgisApiRequests, arcgisApiPaths } from '../src/index'

describe('加载 arcgis api 测试用例', () => {
  test('arcgis 模块调用', () => {
    const modulePaths1 = [
      arcgisApiPaths.Map,
      arcgisApiPaths.MapView,
      arcgisApiPaths.Graphic,
      arcgisApiPaths.GraphicsLayer,
      arcgisApiPaths.Symbol,
      arcgisApiPaths.SimpleFillSymbol,
      arcgisApiPaths.Renderer,
      arcgisApiPaths.FeatureLayer,
      arcgisApiPaths.FeatureLayerView,
      arcgisApiPaths.esriFind,
      arcgisApiPaths.FieldElement,
      arcgisApiPaths.Expand,
    ]
    arcgisApiRequests(modulePaths1).then((loadedModules) => {
      expect(loadedModules[0].prototype.declaredClass).toContain('Map')
      expect(loadedModules[1].prototype.declaredClass).toContain('MapView')
      expect(loadedModules[2].prototype.declaredClass).toContain('Graphic')
      expect(loadedModules[3].prototype.declaredClass).toContain(
        'GraphicsLayer'
      )
      expect(loadedModules[4].prototype.declaredClass).toContain('Symbol')
      expect(loadedModules[5].prototype.declaredClass).toContain(
        'SimpleFillSymbol'
      )
      expect(loadedModules[6].prototype.declaredClass).toContain('Renderer')
      expect(loadedModules[7].prototype.declaredClass).toContain('FeatureLayer')
      expect(loadedModules[8].prototype.declaredClass).toContain(
        'FeatureLayerView'
      )
      expect(loadedModules[9].prototype.declaredClass).toContain('Find')
      expect(loadedModules[10].prototype.declaredClass).toContain(
        'FieldElement'
      )
      expect(loadedModules[11].prototype.declaredClass).toContain('Expand')
    })
    const modulePaths2 = [
      arcgisApiPaths.Map,
      arcgisApiPaths.MapView,
      arcgisApiPaths.Graphic,
      arcgisApiPaths.Extent,
    ]
    arcgisApiRequests(modulePaths2).then((loadedModules) => {
      expect(loadedModules[0].prototype.declaredClass).toContain('Map')
      expect(loadedModules[1].prototype.declaredClass).toContain('MapView')
      expect(loadedModules[2].prototype.declaredClass).toContain('Graphic')
      expect(loadedModules[3].prototype.declaredClass).toContain('Extent')
    })
  })
})
