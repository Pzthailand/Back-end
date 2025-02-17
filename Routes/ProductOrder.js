const express = require('express')
const router = express.Router()

const { ProductOrder,
        ProductOrders,
        ProductOrderRemove,
        ChangeProductOrderStatus,
        Product_Purchase_Order } = require('../Controllers/ProductOrder')

const { ProductOrderPaymentByWallet,
        ProductOrdersPaymentByWallet
        } = require('../Controllers/ProductOrder')


const { ProductOrderList,
        ProductOrderLists,
        CancelProductOrder
        } = require('../Controllers/ProductOrder')


//Administrator
router.get('/ProductOrder', ProductOrderList)   
router.delete('/ProductOrder/:id', ProductOrderRemove)
router.put('/ProductOrder', ChangeProductOrderStatus)
router.get('/ProductPurchaseOrder/:id', Product_Purchase_Order) 

//User Check Product Order
router.post('/ProductOrder', ProductOrder)
router.post('/ProductOrders', ProductOrders)
router.post('/ProductOrderLists', ProductOrderLists)
router.post('/CancelProductOrder/:id', CancelProductOrder)
//Pay By wallet
router.post('/ProductOrderPaymentByWallet', ProductOrderPaymentByWallet) //1 Order
router.post('/ProductOrdersPaymentByWallet', ProductOrdersPaymentByWallet) // Orders

module.exports = router