/*
 * @Author: YangQin 948077188@qq.com
 * @Date: 2022-07-02 16:49:00
 * @LastEditors: YangQin 948077188@qq.com
 * @LastEditTime: 2022-07-03 17:03:25
 * @FilePath: \pv-gis-libs\packages\arcgis\services\examples\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getILayerMate, LayerType } from '../src/layerMeta/layerMeta'

// getILayerMate().then((LayerMate) => {
//     const extent = LayerMate.getLayerJsonURL('http://cache1.arcgisonline.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/0')
//     console.log('extent:', extent)
// }
// )
async function main() {
    const LayerMate = await getILayerMate()
    const extent = await LayerMate.getLayerExtent('http://localhost:6080/arcgis/rest/services/ArzewData/MapServer/3')
    console.log('extent:', extent)
}

main()
