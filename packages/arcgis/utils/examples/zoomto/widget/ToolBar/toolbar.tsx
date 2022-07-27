/* eslint-disable */
import './style.css'
import MapView from '@arcgis/core/views/MapView'
import Widget from '@arcgis/core/widgets/Widget'
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators'
import { tsx } from '@arcgis/core/widgets/support/widget';

// import { init } from '@arcgis/core/core/watchUtils'
import BasemapGalleryEx from '../BasemapGallery/basemapGallery'
import GISViewTest from '../GISViewTest/gisViewTest'

interface gisToolBarParams extends __esri.WidgetProperties {
  view: MapView;
}

interface widgetToolParams {
  widgetId: string;
  visiable: Boolean;
  label: string;
  icon: string;
  event: any | null
}

@subclass('esri.widgets.GISToolBar')
class GISToolBar extends Widget {
  constructor(params?: gisToolBarParams) {
    super(params)
  }

  postInitialize() {
    this.widgetList = this._getWidgetList()
    this.view.ui.remove("attribution")
  }

  @property()
  view!: MapView

  @property()
  currentWidget?: string

  @property()
  widgetList?: widgetToolParams[]

  render() {
    const liNodes: tsx.JSX.Element[] = []
    if (this.widgetList) {
      this.widgetList.forEach(item => {
        const element = <li bind={this} title={item.label} class={item.icon} onclick={() => this._clickToolButton(item.widgetId)}></li>
        liNodes.push(element)
      })
    }

    return (
      <div id='gistoolbar' bind={this}>
        <ul>
          {liNodes}
        </ul>
      </div>
    )
  }

  private _clickToolButton = (widgetid: string) => {
    //如果微件还没创建，则创建微件加到地图上
    let widget = this.view.ui.find(widgetid) as Widget
    if (!widget) {
      switch (widgetid) {
        case 'BasemapGallery': {
          widget = new BasemapGalleryEx({
            view: this.view,
            id: widgetid
          })
          break
        }
        case 'GISViewUtilityTest': {
          widget = new GISViewTest({
            view: this.view,
            id: widgetid
          })
          break
        }

      }
      this._disvisibleCurrentWidget()
      this.view.ui.add(widget, 'top-right')
    }

    if (this.currentWidget == widgetid) {
      widget.visible = false
      this.currentWidget = 'null'
      console.log(widgetid + ' close widget')
    }
    else {
      this._disvisibleCurrentWidget()
      widget.visible = true
      this.currentWidget = widgetid
      console.log(widgetid + ' open widget')
    }

  }

  //使当前微件不可见
  private _disvisibleCurrentWidget() {
    if (this.currentWidget) {
      let widget = this.view.ui.find(this.currentWidget) as Widget
      if (widget) {
        widget.visible = false
      }
    }
  }
  /*
        后续此函数需要改造，结合权限控制，通过后台接口动态返回微件
        */
  private _getWidgetList() {
    return [
      {
        widgetId: 'BasemapGallery',
        visiable: false,
        label: '底图切换',
        icon: 'esri-icon-basemap',
        event: this._clickToolButton
      },
      {
        widgetId: 'GISViewUtilityTest',
        visiable: false,
        label: '缩放功能测试微件',
        icon: 'esri-icon-lasso',
        event: null
      },
      {
        widgetId: 'Setting',
        visiable: false,
        label: '设置',
        icon: 'esri-icon-settings2',
        event: null
      }
    ]
  }
}

export default GISToolBar
