import { createGraphic } from '../src/index'

import { loadModules } from 'esri-loader'
import { stubRequire, removeRequire } from './helpers'

async function loadModulesTest() {
  const [Graphic] = await loadModules(['esri/Graphic'])
  return Graphic
}

describe('创建一个图形', () => {
  test('应该返回一个图形', async () => {
    const Graphic = await loadModulesTest()
    beforeEach(() => {
      // stub window require
      stubRequire()
    })
    expect(Graphic).toBeTruthy()
    // const graphic = await createGraphic()
    // expect(graphic).toBeTruthy()
    // expect(graphic['Symbol']).toBeInstanceOf(Object)
    afterEach(() => {
      // clean up
      removeRequire()
    })
  }, 100000)
})
