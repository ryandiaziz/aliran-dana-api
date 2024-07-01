import express from 'express'
// import barangRoute from './barangRoutes.js'
// import penjualanRoute from './penjualanRoutes.js'
import accountRoutes from './accountRoutes.js'
const route = express.Router()

route.get('/', (req, res) => {
    res.json({
        info: 'Welcome'
    })
})

route.use('/accounts', accountRoutes)
// route.use('/barang', barangRoute)
// route.use('/penjualan', penjualanRoute)



export default route