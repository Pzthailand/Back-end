const ProductOrder = require('../Models/ProductOrder')
const Product = require('../Models/Product')
const Users = require('../Models/Users');

//User
//Product order 1 product - Cash on delivery
exports.ProductOrder = async (req,res) => {
    try {
        const { userid, shopname , productid, productname , price , orderqty, shippingcost,  payment , fname , lname , addres , zipcode , phone ,file1 } = req.body;

        console.log(userid, shopname , productid, productname , price , orderqty, shippingcost,  payment , fname , lname , addres , zipcode , phone ,file1)
    
        // Create the order
        const order = await ProductOrder({ userid, 
            productid,
            shopname, 
            productname , 
            price , 
            orderqty, 
            payment ,
            shippingcost,  
            fname , 
            lname , 
            addres , 
            zipcode , 
            phone ,
            file1 }).save();
    
        // Check if the product exists before updating
        const product = await Product.findById(productid);
        if (product) {
            // Assuming `productqty` is the current quantity of the product
            const newQty = product.productqty - orderqty; // Adjust as necessary
            await Product.findByIdAndUpdate(productid, { productqty: newQty }).exec();
        } else {
            return res.status(404).send('Product not found');
        }
        res.status(201).send('Product Order Success')
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

//Product order 1 product - wallet
exports.ProductOrderPaymentByWallet = async (req, res) => {
    try {
        const { username, amount } = req.body;

        // ค้นหาผู้ใช้และดึงข้อมูล wallet
        const user = await Users.findOne({ username: username }).select('wallet');
        
        if (user) {
            // เช็คว่าเงินใน wallet ไม่พอหรือไม่
            if (user.wallet < amount) {
                return res.status(400).send('Not enough money');
            } else {
                // หักเงินจาก wallet
                const newWalletAmount = user.wallet - amount;

                // อัปเดต wallet ของผู้ใช้
                await Users.findOneAndUpdate(
                    { username: username }, // ค้นหาผู้ใช้ตาม username
                    { wallet: newWalletAmount }, // อัปเดต wallet
                    { new: true } // คืนค่าผู้ใช้ที่อัปเดตแล้ว
                );
                
                const { userid, shopname , productid, productname , price , orderqty, shippingcost,  payment , fname , lname , addres , zipcode , phone ,file1 } = req.body;

                // Create the order
                const order = await ProductOrder({userid,productid,shopname,productname,price,orderqty,payment,shippingcost,fname,lname,addres,zipcode,phone,file1}).save();
            
                // Check if the product exists before updating
                const product = await Product.findById(productid);
                if (product) {
                    // Assuming `productqty` is the current quantity of the product
                    const newQty = product.productqty - orderqty; // Adjust as necessary
                    await Product.findByIdAndUpdate(productid, { productqty: newQty }).exec();
                } else {
                    return res.status(404).send('Product not found');
                }
                res.status(201).send('Product Order Success')
            }
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err); // ใช้เครื่องมือ log ใน production
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

//Product orders - Cash on delivery
exports.ProductOrders = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the entire request body

        const ordersData = req.body; // Expecting an array of orders
        const savedOrders = [];

        for (const data of ordersData) {
            // Create a new product order instance
            const newOrder = new ProductOrder(data);
            console.log('New order instance : ', newOrder);

            // Save the order to the database  
            const savedOrder = await newOrder.save();
            savedOrders.push(savedOrder); // Store the saved order

            // Check if the product exists before updating
            const product = await Product.findById(newOrder.productid);
            if (product) {
                // Assuming `productqty` is the current quantity of the product
                const newQty = product.productqty - newOrder.orderqty; // Adjust as necessary
                await Product.findByIdAndUpdate(newOrder.productid, { productqty: newQty }).exec();

                //Delete cart before order
                const userid = newOrder.userid;  
                const productid = newOrder.productid;

                const user = await Users.findById({_id : userid});
                const productIndex = user.cart.findIndex(item => item.productid === productid);
                // Remove the product from the cart
                user.cart.splice(productIndex, 1);
                // Optionally, save the updated cart to the database
                await user.save();
            } else {
                return res.status(404).send('Product not found');
            }    
        }
        res.status(201).send('Product Order Success')
    } catch (err) {
        console.error(err); // Use a logging library in production
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

//Product orders - wallet
exports.ProductOrdersPaymentByWallet = async (req, res) => {
    try {
        const { value, orderDetails } = req.body;
        const { username, amount } = value;
        console.log(username,amount);

        // ค้นหาผู้ใช้และดึงข้อมูล wallet
        const user = await Users.findOne({ username: username }).select('wallet');
        
        if (user) {
            // เช็คว่าเงินใน wallet ไม่พอหรือไม่
            if (user.wallet < amount) {
                return res.status(400).send('Not enough money');
            } else {
                // หักเงินจาก wallet
                const newWalletAmount = user.wallet - amount;

                // อัปเดต wallet ของผู้ใช้
                await Users.findOneAndUpdate(
                    { username: username }, // ค้นหาผู้ใช้ตาม username
                    { wallet: newWalletAmount }, // อัปเดต wallet
                    { new: true } // คืนค่าผู้ใช้ที่อัปเดตแล้ว
                );

                    console.log(orderDetails);
                    const ordersData = orderDetails;
                    const savedOrders = [];
                    for (const data of ordersData) {
                        // Create a new product order instance
                        const newOrder = new ProductOrder(data);
                        console.log('New order instance : ', newOrder);

                        // Save the order to the database  
                        const savedOrder = await newOrder.save();
                        savedOrders.push(savedOrder); // Store the saved order

                        // Check if the product exists before updating
                        const product = await Product.findById(newOrder.productid);
                        if (product) {
                            // Assuming `productqty` is the current quantity of the product
                            const newQty = product.productqty - newOrder.orderqty; // Adjust as necessary
                            await Product.findByIdAndUpdate(newOrder.productid, { productqty: newQty }).exec();

                            //Delete cart before order
                            const userid = newOrder.userid;  
                            const productid = newOrder.productid;

                            const user = await Users.findById({_id : userid});
                            const productIndex = user.cart.findIndex(item => item.productid === productid);
                            // Remove the product from the cart
                            user.cart.splice(productIndex, 1);
                            // Optionally, save the updated cart to the database
                            await user.save();
                        } else {
                            return res.status(404).send('Product not found');
                        }    
                    }
                    res.status(201).send('Product Order Success')          
            }
    }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

exports.ProductOrderLists = async (req, res) => {
    try {
        const { userid } = req.body;

        // Validate userid
        if (!userid) {
            return res.status(400).send('User ID is required')
        }
    
        const query = { userid }; // Create query directly
    
        // Find products based on the query, sorted by ID
        const products = await ProductOrder.find(query).sort({ _id: -1 }); // Sort by _id in descending order
        
        // Check if products were found and respond accordingly
        if (products.length > 0) {
            res.send(products); 
        } else {
            res.status(404).send('No products found')
        }
    } catch (err) {
        console.error('Error fetching products:', err); // Improved logging
        res.status(500).send('Server Error')
    }
};

exports.CancelProductOrder = async (req,res) => {
    try{
        const id = req.params.id //Product order id
        const { productid,price,orderqty,shippingcost,username } = req.body
        console.log('Cancel product id :',id , orderqty)  

         // Check if the product exists before updating
        const product = await Product.findById(productid);
        if (product) {
            // Assuming `productqty` is the current quantity of the product
            const newQty = product.productqty + orderqty; // Adjust as necessary
            await Product.findByIdAndUpdate(productid, { productqty: newQty }).exec();
            //Remove Product order
            await ProductOrder.findOneAndDelete({_id: id});
            res.status(200).send('Cancel order success')

            const user = await Users.findOne({ username: username }).select('wallet');
            if(user){
                const newWalletAmount =  ((user.wallet+(price+shippingcost)*orderqty));
                await Users.findOneAndUpdate(
                { username: username }, // ค้นหาผู้ใช้ตาม username
                { wallet: newWalletAmount }, // อัปเดต wallet
                { new: true } // คืนค่าผู้ใช้ที่อัปเดตแล้ว
                );
            }
            
        } else {
            return res.status(404).send('Product not found');
        }
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

//Administrator

exports.ProductOrderList = async (req,res) => {
    try{
        /*const producted = await ProductOrder.find({}).exec();*/ /* old to new */
        const producted = await ProductOrder.find({}).sort({ _id: -1 }); /* new to old */
        res.send(producted)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ProductOrderRemove = async (req,res) => {
    try{
        const id = req.params.id
        await ProductOrder.findOneAndDelete({_id:id});
        res.send('Delete Success')
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ChangeProductOrderStatus = async (req, res) => {
    try {
        const { id, productorderstatus } = req.body;

        // Update the product order status in the database
        const updatedOrder = await ProductOrder.findOneAndUpdate(
            { _id: id },
            { productorderstatus },
            { new: true } // This option returns the updated document
        );

        // Check if the order was found and updated
        if (!updatedOrder) {
            return res.status(404).send('Product order not found');
        }

        res.send('Change Status Success');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.Product_Purchase_Order = async (req, res) => {
    try {
        const id = req.params.id
        const purchase = await ProductOrder.findOne({_id : id}).exec();
        res.send(purchase)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
