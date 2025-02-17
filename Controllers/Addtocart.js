const Users = require('../Models/Users');
const Product = require('../Models/Product');

exports.Addtocart = async (req, res) => {
    const { userid, shopname, productid, quantity, productname, price, shippingcost, file1 } = req.body;


    if (!userid || !shopname || !productid || !quantity || !productname || !price || !shippingcost || !file1) {
        return res.status(400).send('Not ready to add to cart!')
    }

    console.log('Add to cart', 
                'user id:', userid,
                'shop name : ', shopname,
                'product id : ', productid, 
                'product qty : ', quantity, 
                'product name : ', productname, 
                'product price : ', price, 
                'shipping cost : ', shippingcost, 
                'product image : ', file1);

    try {
        const user = await Users.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const product = await Product.findById(productid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Calculate the total quantity of all products in the cart
        const totalQuantityInCart = user.cart.reduce((total, item) => total + item.quantity, 0);
        
        // Check if adding the new product would exceed 10 items in the cart
        if (totalQuantityInCart + quantity > 10) {
            return res.status(400).send('Cannot have more than 10 items in the cart in total')
            //return res.status(400).json({ error: 'Cannot have more than 10 items in the cart in total' });
        }

        // Check if the product is already in the cart
        const existingProductIndex = user.cart.findIndex(item => item.productid.toString() === productid);
        
        if (existingProductIndex === -1) {
            // Product not in cart, add it
            user.cart.push({ shopname, productid, quantity, productname, price, shippingcost, file1 });
            await user.save();
            console.log('Product added to cart');
        } else {
            // Product is already in the cart, update quantity
            user.cart[existingProductIndex].quantity += quantity; // Increment the quantity
            await user.save();
            console.log('Product quantity updated in cart');
        }

        return res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
 
/*exports.Addtocart = async (req, res) => {
    const { userid, shopname ,productid, quantity , productname , price , shippingcost ,file1 } = req.body;

    console.log('Add to cart', 
                'user id:', userid,
                'shop name : ',shopname,
                'product id : ', productid, 
                'product qty : ', quantity, 
                'product name : ',productname, 
                'product price : ',price, 
                'shipping cost : ',shippingcost, 
                'product image : ',file1);

    try {
        const user = await Users.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const product = await Product.findById(productid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product is already in the cart
        const existingProductIndex = user.cart.findIndex(item => item.productid.toString() === productid);
        
        if (existingProductIndex === -1) {
            // Product not in cart, add it
            user.cart.push({ shopname , productid, quantity , productname ,price , shippingcost , file1 });
            await user.save();
            console.log('Product added to cart');
        } else {
            // Product is already in the cart, update quantity
            user.cart[existingProductIndex].quantity += quantity; // Increment the quantity
            await user.save();
            console.log('Product quantity updated in cart');
        }

        return res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};*/


exports.UserAddtocartList = async (req, res) => {
    const { userid } = req.body;

    try {
        // Validate the userid
        if (!userid) {
            return res.status(400).send('User ID is required.');
        }

        // Fetch the user without the password field
        const user = await Users.findById(userid).select('-password');

        //*Check Stock Update in cart

       // ตรวจสอบและมั่นใจว่า user.cart เป็นอาเรย์
        const usercart = Array.isArray(user.cart) ? user.cart : []; // ตรวจสอบให้ user.cart เป็นอาเรย์

        // ดึง productId จากตะกร้าของผู้ใช้
        const productIds = usercart.map(item => item.productid);

        // เช็คว่า productIds ไม่มีค่าว่าง
        if (productIds.length === 0) {
        return []; // หากไม่มีสินค้าก็คืนค่าเป็นอาเรย์ว่าง
        }

        // ค้นหาผลิตภัณฑ์ในฐานข้อมูล
        const products = await Product.find({ _id: { $in: productIds } }).exec();

        // แม็ปผลิตภัณฑ์เพื่อรวม productqty
        const productsWithQty = products.map(product => ({
        productid: product._id,
        productqty: product.productqty, // รวมจำนวนสินค้า (productqty)
        }));

        // อัปเดตตะกร้าของผู้ใช้เพื่อรวม productqty จาก productsWithQty
        const updatedCart = usercart.map(item => {
        const product = productsWithQty.find(p => p.productid.toString() === item.productid.toString());
        if (product) {
            // หากพบสินค้าใน productsWithQty ให้รวม productqty
            return { ...item, productqty: product.productqty };
        }
        return item; // หากไม่พบก็คืนค่าตะกร้าปกติ
        });

        // บันทึกตะกร้าใหม่กลับไปที่ฐานข้อมูล (สมมติว่าใช้ user.save() หรืออัปเดตตามที่ต้องการ)
        user.cart = updatedCart;
        await user.save(); // บันทึกการเปลี่ยนแปลง
    
        //List Product cart
        if (!user) {
            return res.status(404).send('User Not Found!!!');
        } else {
            // Assuming user.cart is an array of products
            const cart = user.cart || []; // Use an empty array if cart is not defined
            const responseData = {
                userId: user._id,
                cart: cart.reverse() // Reverse the cart to show the last item first
            };
            return res.status(200).json(responseData);
        }
        //List Product cart
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
}

/*exports.UserAddtocartList = async (req, res) => {
    const { userid } = req.body;

    try {
        // Validate the userid
        if (!userid) {
            return res.status(400).send('User ID is required.');
        }

        // Fetch the user without the password field
        const user = await Users.findById(userid).select('-password');

        if (!user) {
            return res.status(404).send('User Not Found!!!');
        } else {
            // Assuming user.cart is an array of products
            const cart = user.cart || []; // Use an empty array if cart is not defined
            const responseData = {
                userId: user._id,
                cart: cart.reverse() // Reverse the cart to show the last item first
            };
            console.log(responseData)
            return res.status(200).json(responseData);
        } 
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
}*/



exports.UpdateCart = async (req, res) => {
    const { userid, productid, quantity } = req.body;

    console.log('Update cart item', 
                'user id : ', userid, 
                'product id : ', productid, 
                'new quantity : ', quantity);

    try {
        const user = await Users.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingProductIndex = user.cart.findIndex(item => item.productid.toString() === productid);

        if (existingProductIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Update the quantity
        if (quantity <= 0) {
            // If the quantity is zero or less, remove the item
            user.cart.splice(existingProductIndex, 1);
            console.log('Product removed from cart due to zero quantity');
        } else {
            // Update the quantity
            user.cart[existingProductIndex].quantity = quantity;
            console.log('Product quantity updated in cart');
        }
        await user.save();
        return res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.RemoveCart = async (req, res) => {
    const { userid, productid } = req.body;

    try {
        const user = await Users.findById({_id : userid});
        if (!user) return res.status(404).json({ error: 'User not found' });

        const productIndex = user.cart.findIndex(item => item.productid === productid);

        if (productIndex === -1) {
            console.log(`Product ID ${productid} not found in cart for user ${user.id}`);
            return res.status(400).json({ message: `Product with ID ${productid} not found in cart` });
        }
        
        // Remove the product from the cart
        user.cart.splice(productIndex, 1);
        
        // Optionally, save the updated cart to the database
        await user.save();
        
        return res.status(200).json({ message: 'Product removed from cart successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while removing from cart' });
    }
};



/*exports.UserAddtocartList = async (req, res) => {
    const { userid } = req.body;

    try {
        // Validate the userid
        if (!userid) {
            return res.status(400).send('User ID is required.');
        }

        // Fetch the user without the password field
        const user = await Users.findById(userid).select('-password');

        if (!user) {
            return res.status(404).send('User Not Found!!!');
        } else {
            // Assuming user.cart is an array of products
            const responseData = {
                userId: user._id,
                cart: user.cart || [] // Use an empty array if cart is not defined
            };
            return res.status(200).json(responseData);
        } 
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
}*/

    /*exports.ProductAddtocartList = async (req,res) => {
    const { productid } = req.body; // Expecting an array of IDs
    
    try {
        const products = await Product.find({ _id: { $in: productid } }); // Fetch products by IDs

        if (products.length === 0) {
            return res.status(400).send('No Products Found!!!');
        } else {
            res.status(200).send(products);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}*/


/*async function addToCart(userId, productId) {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');

        // Add product to cart if it's not already there
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
            console.log('Product added to cart');
        } else {
            console.log('Product is already in the cart');
        }
    } catch (error) {
        console.error(error);
    }
}*/


/*exports.Addtocart = async (req,res) => {
        const { userid , productid } = req.body
    try {
        const user = await Users.findById({_id : userid});
        if (!user) throw new Error('User not found');
        
        const product = await Product.findById(productid);
        if (!product) throw new Error('Product not found');

        // Add product to cart if it's not already there
        if (!user.cart.includes(productid)) {
            user.cart.push(productid);
            await user.save();
            console.log('Product added to cart');
        } else {
            console.log('Product is already in the cart');
        }
    } catch (err) {
        console.error(err);
    }
}*/



/*exports.ProductAddtocartRemove = async (req, res) => {
    const { userid, productid } = req.body;

    try {
        const user = await Users.findById({_id : userid});
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if the product is in the cart
        const productIndex = user.cart.indexOf(productid);
        if (productIndex === -1) {
            return res.status(400).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        user.cart.splice(productIndex, 1);
        await user.save();

        console.log('Product removed from cart');
        return res.status(200).json({ message: 'Product removed from cart' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while removing from cart' });
    }
};*/


