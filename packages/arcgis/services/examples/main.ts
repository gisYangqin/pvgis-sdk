/*
 * @Author: YangQin 948077188@qq.com
 * @Date: 2022-07-02 16:49:00
 * @LastEditors: YangQin yangqin03@cnpc.com.cn
 * @LastEditTime: 2022-08-10 23:52:23
 * @FilePath: \pv-gis-libs\packages\arcgis\services\examples\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { getILayerMeta, LayerType } from '../src/layerMeta/layerMeta'

import { arcgisApiPaths, arcgisApiRequests } from '@pv-arcgis/core/src'
import type from 'esri/smartMapping/renderers/type'

import {
    ObjectEscapString, FindOperation,
    IdentifyOperation,
    QueryOperation,
    EsriGeometryType,
} from '../src/index'

async function main() {

    // ObjectEscapStringTest()
    // FindOperationTest()
    // IdentifyOperationTest()
    QueryOperationTest()
}

function ObjectEscapStringTest() {

    console.log('test ObjectEscapString function')
    let a = 'aaa'
    let b = true
    let c = 123

    let d = [1, 2, 3, 4]
    let e = {
        a: 1,
        b: 'b',
        c: true,
        d: {
            d1: '111',
            d2: 21
        }
    }
    console.log('a:', ObjectEscapString(a))
    console.log('b:', ObjectEscapString(b))
    console.log('c:', ObjectEscapString(c))
    console.log('d:', ObjectEscapString(d))
    console.log('e:', ObjectEscapString(e))
}

async function FindOperationTest() {
    console.log('Test Find Operation')
    const find = new FindOperation(
        'http://localhost:6080/arcgis/rest/services/ArzewData/MapServer',
        'PT4', [3, 4, 5]
    )

    const json = await find.excute()
    console.log('json from find operation:', json)
}

async function IdentifyOperationTest() {
    console.log('Test identify Operation')
    type modulesType = [typeof __esri.Point, typeof __esri.Extent]
    const [Point] = await arcgisApiRequests<modulesType>([arcgisApiPaths.Point])

    const point = new Point({
        longitude: -0.32,
        latitude: 35.83,
    })

    const e={
        xmin:-0.3336345239999332,
        ymin:35.82040493100004,
        xmax:-0.31817514599993046,
        ymax:35.83728705600004,
    }
    const identify = new IdentifyOperation(
        'http://localhost:6080/arcgis/rest/services/ArzewData/MapServer',
        '-0.32,35.83', 
        // point.toJSON(), esri 点类型的toJson函数有问题，不兼容
        EsriGeometryType.Point, 5,
        [e.xmin,e.ymin,e.xmax,e.ymax], [1920,1024,96]
    )
    const json = await identify.excute()
    console.log('json from identify operation:', json)

}

async function QueryOperationTest(){
    console.log('Test Query Operation')
    const query=new QueryOperation('http://localhost:6080/arcgis/rest/services/ArzewData/MapServer/3')

    query.WHERE='MOD(OBJECTID, 3)=2'
    query.OutFields='*'
    const json = await query.excute()
    console.log('json from query operation:', json)
}

main()
