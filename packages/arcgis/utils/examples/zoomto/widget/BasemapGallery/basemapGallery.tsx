/* eslint-disable */
import './style.css'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'

import { subclass } from '@arcgis/core/core/accessorSupport/decorators'

@subclass('esri.widgets.BasemapGalleryEx')
class BasemapGalleryEx extends BasemapGallery {
    constructor(params?: any) {
        super(params)
    }

    // postInitialize() {}
        

}

export default BasemapGalleryEx