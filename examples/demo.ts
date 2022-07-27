import { loadModules } from 'esri-loader'

type MapModules = [
  typeof __esri.Map,
  typeof __esri.MapView,
  typeof __esri.FeatureLayer,
  typeof __esri.Graphic
]
import SimpleMarkerSymbolProperties = __esri.SimpleMarkerSymbolProperties
async function LayerQuery() {
  const [Map, MapView, FeatureLayer, Graphic] = await (loadModules([
    'esri/Map',
    'esri/views/MapView',
    'esri/Graphic',
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

  const markerSymbol: SimpleMarkerSymbolProperties = {
    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    color: [0, 0, 139],
    outline: {
      color: [255, 255, 255],
      width: 1.5,
    },
  }

  const pointGraphic = new Graphic({
    symbol: markerSymbol,
  })

  layer.load().then(() => {
    // Set the view extent to the data extent
    view.extent = layer.fullExtent
    layer.popupTemplate = layer.createPopupTemplate()
  })

  view.on('click', (event) => {
    view.graphics.remove(pointGraphic)
    queryFeatures(event)
  })

  function queryFeatures(screenPoint) {
    const point = view.toMap(screenPoint)
    layer
      .queryFeatures({
        geometry: point,
        // distance and units will be null if basic query selected
        spatialRelationship: 'intersects',
        returnGeometry: false,
        returnQueryGeometry: true,
        outFields: ['*'],
      })
      .then((featureSet) => {
        // set graphic location to mouse pointer and add to mapview
        pointGraphic.geometry = point
        view.graphics.add(pointGraphic)
        // open popup of query result
        view.popup.open({
          location: point,
          features: featureSet.features,
          featureMenuOpen: true,
        })
      })
  }
}

export { LayerQuery }
