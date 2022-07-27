import { arcgisApiRequests, arcgisApiPaths } from '../src/index'
type modulesType = [typeof __esri.Map, typeof __esri.MapView]
type modulesType2 = [
  typeof __esri.Map,
  typeof __esri.MapView,
  typeof __esri.Graphic
]

async function loadArcgisModules() {
  const [Map, MapView] = await arcgisApiRequests<modulesType>([
    arcgisApiPaths.Map,
    arcgisApiPaths.MapView,
  ])
  debugger
  console.log('🌏🌏🌏🌏🌏', Map.prototype.declaredClass)
  console.log('🌙🌙🌙🌙🌙', MapView.prototype.declaredClass)

  setTimeout(async () => {
    const [Map, MapView, Graphic] = await arcgisApiRequests<modulesType2>([
      arcgisApiPaths.Map,
      arcgisApiPaths.MapView,
      arcgisApiPaths.Graphic,
    ])
    console.log('☀☀☀☀☀☀☀☀', Map.prototype.declaredClass)
    console.log('🌌🌌🌌🌌🌌', MapView.prototype.declaredClass)
    console.log('🌋🌋🌋🌋🌋', Graphic.prototype.declaredClass)
  }, 2000)
}

loadArcgisModules()
