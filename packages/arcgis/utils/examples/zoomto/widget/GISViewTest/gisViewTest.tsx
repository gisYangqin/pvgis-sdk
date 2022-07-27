/* eslint-disable */
import './style.css'
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators"
// import { init } from "@arcgis/core/core/watchUtils"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils"
import Widget from "@arcgis/core/widgets/Widget"
import { tsx } from "@arcgis/core/widgets/support/widget"
import Graphic from "@arcgis/core/Graphic"
import MapView from "@arcgis/core/views/MapView"
import Extent from "@arcgis/core/geometry/Extent"

import { GeometryType, getRandomGeometryType, getIGeometryEngineEx } from '@pv-arcgis/core/src'
// import geometryEngineEx from '@pvgis/core/dist/index'
import { getZoomToObject, QueryLayer } from '../../../../src/index'

import * as projection from "@arcgis/core/geometry/projection"
import Point from '@arcgis/core/geometry/Point'
import { getRandomFeatureLayer, getRandomFeatureLayerWithfilter } from './testUtily'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

const CSS = {
    base: 'widget-gisViweUtilityTest'
}

interface gisViewTestParameters extends __esri.WidgetProperties {
    view: MapView
}


@subclass('esri.widgets.gisViewTest')
class gisViewtest extends Widget {
    constructor(params?: gisViewTestParameters) {
        super(params)
    }

    postInitialize() {
        this.own(reactiveUtils.watch(() => this.view.center, () =>
            this._onViewChange()
        ))
    }

    @property()
    gacphic: Graphic

    @property()
    info: string

    @property()
    view!: MapView

    //当前缩放对象的序号
    @property()
    index: number = 0

    render() {

        // JSX
        return (
            <div class={CSS.base}>
                <div>测试1:随机几何图形<br></br>
                    随机添加一个：<button bind={this} onclick={this._addRandomeGraphic} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    随机添加多个：<button bind={this} onclick={this._addRandomMutilGraphic} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    缩放至图形集：<button bind={this} onclick={this._zoomToGraphic} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    逐个缩放图形：<button bind={this} onclick={this._zoomToGraphicOnebyOne} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                </div>
                <br />

                <div>测试2:随机地图服务图层<br></br>
                    随机添加一个：<button bind={this} onclick={this._addRandomFeatureLayer} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    随机添加多个：<button bind={this} onclick={this._addRandomMutilFeatureLayer} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    缩放至图层集：<button bind={this} onclick={this._zoomToLayer} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                </div>
                <br />


                <div>测试3:随机地图图层加筛选条件<br></br>
                    随机添加某图层单个图形：<button bind={this} onclick={this._addRandomFeatureLayerWithFilter} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    随机添加某图层多个图形：<button bind={this} onclick={this._addRandomMutilFeatureLayerWithFilter} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                    缩放至图层集：<button bind={this} onclick={this._zoomToLayer} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                </div>
                <br />

                <div>测试4:自定义极限条件测试<br></br>
                    <button bind={this} onclick={this._coustomTest} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button><br />
                </div>
                <br />

                <div>清空图层<br></br>
                    <button bind={this} onclick={this._clearAllLayerandGraphic} class='ant-btn ant-btn-primary ant-btn-sm'>执行</button>
                </div>

                <br></br>

                <div>
                    信息:
                    <p>{this.info}</p>
                </div>
            </div>
        )
    }

    // 清空目前所有的图层和图形
    private _clearAllLayerandGraphic() {
        this.view.map.layers.removeAll()
        this.view.graphics.removeAll()
    }

    //创建一个随机的图形添加到地图上
    private async _addRandomeGraphic() {

        const extent_algeria = new Extent({
            xmin: -10,
            xmax: 11,
            ymin: 26,
            ymax: 38,
            spatialReference: { wkid: 4326 }
        })

        const geometryEngineEx = await getIGeometryEngineEx()
        let type = getRandomGeometryType([GeometryType.Polyline, GeometryType.Polygon, GeometryType.Point])

        if (type == GeometryType.Point) {
            const markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40],
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 2
                }
            }
            const pointGraphic = new Graphic({
                geometry: geometryEngineEx.createRandomPoint(extent_algeria),
                symbol: markerSymbol
            })

            this.view.graphics.add(pointGraphic)
        }
        else if (type == GeometryType.Polyline) {
            const lineSymbol = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [226, 119, 40],
                width: 2
            }
            const polylineGraphic = new Graphic({
                geometry: geometryEngineEx.expandGeometry(geometryEngineEx.createRandomPolyline(extent_algeria), Math.pow(Math.random() + 0.01, 3)),
                symbol: lineSymbol
            })
            this.view.graphics.add(polylineGraphic)
        } else if (type == GeometryType.Polygon) {
            const fillSymbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [255, 255, 255, 0.3],
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [227, 139, 79],
                    width: 2
                }
            }
            const p = geometryEngineEx.createRandomPolygon(extent_algeria)
            const polygonGraphic = new Graphic({
                geometry: geometryEngineEx.expandGeometry(p, Math.pow(Math.random() + 0.01, 3)),
                symbol: fillSymbol
            })
            this.view.graphics.add(polygonGraphic)
        }
    }

    //创建多个随机的图形添加到地图上
    private _addRandomMutilGraphic() {
        const count = Math.ceil(Math.random() * 10)
        for (let i = 0; i < count; ++i) {
            this._addRandomeGraphic()
        }
    }

    // 缩放至当前地图的图形
    private _zoomToGraphic() {
        getZoomToObject(this.view, [], [], this.view.graphics.toArray())
            .then((zoomToObject) => { this.view.goTo(zoomToObject) })
    }

    //逐个缩放当前的图形
    private _zoomToGraphicOnebyOne() {
        const graphics = this.view.graphics.toArray()
        if (this.index >= graphics.length) {
            this.index = 0
        }

        getZoomToObject(this.view, [], [], [graphics[this.index]])
            .then((zoomToObject) => {

                this.view.goTo(zoomToObject).catch(function (error) {
                    console.error(error)
                })
            })
        this.index += 1
    }

    // 随机获取一个要素图层，并缩放至
    private async _addRandomFeatureLayer() {
        const featLayer = await getRandomFeatureLayer()
        this.view.map.layers.add(featLayer)
    }

    // 随机获取一个带筛选条件的要素图层，并缩放至
    private async _addRandomFeatureLayerWithFilter() {
        const featLayer = await getRandomFeatureLayerWithfilter()
        this.view.map.layers.add(featLayer)
    }

    // 随机获取多个要素图层，并缩放至
    private _addRandomMutilFeatureLayer() {
        const count = Math.ceil(Math.random() * 5)
        for (let i = 0; i < count; ++i) {
            this._addRandomFeatureLayer()
        }
    }

    // 随机获取多个带筛选条件的要素图层，并缩放至
    private _addRandomMutilFeatureLayerWithFilter() {
        const count = Math.ceil(Math.random() * 5)
        for (let i = 0; i < count; ++i) {
            this._addRandomFeatureLayerWithFilter()
        }
    }

    // 缩放至当前地图服务图层
    private _zoomToLayer() {
        let featLayers: QueryLayer[] = []
        for (let i = 0; i < this.view.layerViews.length; ++i) {
            const layer = this.view.layerViews.at(i).layer as FeatureLayer
            const url = layer.url + '/' + layer.layerId
            const definitionExpression = layer.definitionExpression
            const fLayer = {
                mapLayerURL: url,
                definitionExpression: definitionExpression
            }
            featLayers.push(fLayer)
        }

        getZoomToObject(this.view, featLayers)
            .then((zoomToObject) => { this.view.goTo(zoomToObject) })
    }

    //地图中心坐标变化或者地图缩放时，更新提示信息
    private _onViewChange() {
        let { center, zoom } = this.view
        let point = projection.project(center, { wkid: 4326 }) as Point
        // let point = center
        // console.log('zoom:' + zoom + ', center:' + center.x + ', ' + center.y)
        this.info = 'zoom:' + zoom + ',  x: ' + point.x + ', y: ' + point.y
        this.info = this.info + 'longitude: ' + center.x + ', latitude: ' + center.y
    }

    private _coustomTest() {
        // const urls = [
        //     'http://localhost:6080/arcgis/rest/services/Arzew_Enviroment/MapServer/1',
        //     'http://localhost:6080/arcgis/rest/services/Arzew_Enviroment/MapServer/4'
        // ]
        // for (let i = 0; i < urls.length; ++i) {
        //     const featLayer = new FeatureLayer({
        //         url: urls[i]
        //     })
        //     this.view.map.layers.add(featLayer)
        // }
        let pt = new Point({
            latitude: 49,
            longitude: -126
        });
        this.view.goTo({
            target: pt,
            zoom: 7
        })

    }
}


export default gisViewtest
