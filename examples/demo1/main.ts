import { loadModules, loadCss } from 'esri-loader'
import { createGraphic } from '@pvgis/core'
import { LayerQuery } from '@pvgis/services'

type MapModules = [
  typeof __esri.Map,
  typeof __esri.MapView,
  typeof __esri.FeatureLayer
]
loadCss()
async function queryLayer() {
  const [Map, MapView, FeatureLayer] = await (loadModules([
    'esri/Map',
    'esri/views/MapView',
    'esri/layers/FeatureLayer',
  ]).catch((err) => {
    console.error(err)
  }) as Promise<MapModules>)
  const layer = new FeatureLayer({
    // autocasts as new PortalItem()
    portalItem: {
      id: '234d2e3f6f554e0e84757662469c26d3',
    },
    outFields: ['*'],
  })
  const map = new Map({
    basemap: 'gray-vector',
    layers: [layer],
  })

  const view = new MapView({
    container: 'viewDiv',
    map: map,
    popup: {
      autoOpenEnabled: false,
      dockEnabled: true,
      dockOptions: {
        // dock popup at bottom-right side of view
        buttonEnabled: false,
        breakpoint: false,
        position: 'bottom-right',
      },
    },
  })

  const pointGraphic = await createGraphic()

  layer.load().then(() => {
    // Set the view extent to the data extent
    view.extent = layer.fullExtent
    layer.popupTemplate = layer.createPopupTemplate()
  })

  view.on('click', async (event) => {
    view.graphics.remove(pointGraphic)
    await queryFeatures(event)
  })

  async function queryFeatures(screenPoint) {
    const point = view.toMap(screenPoint)
    const featureSet = await LayerQuery(layer, point)
    pointGraphic.geometry = point
    view.graphics.add(pointGraphic)
    // open popup of query result
    view.popup.open({
      location: point,
      features: featureSet.features,
      featureMenuOpen: true,
    })
  }
}

queryLayer()
