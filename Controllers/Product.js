require('dotenv').config() //npm install dotenv --save
const Product = require('../Models/Product')
//const fs = require('fs')
const fs = require('fs').promises; // Use fs.promises for better async handling
const cloudinary = require('cloudinary').v2;

//Product Detail
exports.Read = async (req,res) => {
    try{
        const id = req.params.id
        const producted = await Product.findOne({_id: id}).exec();
        res.send(producted)
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.List = async (req,res) => {
    try{
        /*const producted = await Product.find({}).exec();*/ /* old to new */
        const producted = await Product.find({}).sort({ _id: -1 }); /* new to old */
        res.send(producted)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.Create = async (req, res) => {
    try {
        console.log(req.body); // Log the body of the request
        console.log(req.files); // Log the uploaded files

        var data = req.body; // Access form data


        const uploadedFiles = ['file1', 'file2', 'file3' , 'file4' , 'file5'];
        uploadedFiles.forEach(fileKey => {
            if (req.files[fileKey] && req.files[fileKey].length > 0) {
                data[fileKey] = req.files[fileKey][0].filename;
            }
        });
        
        // Assuming you have a Product model to save the data
         const producted = await Product(data).save();
         res.send('Create Success');
        //console.log(data); // Log the final data object
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
}


//multiple file
/*exports.Create = async (req, res) => {
    try {
        console.log(req.body); // Log the body of the request
        console.log(req.files); // Log the uploaded files

        var data = req.body; // Access form data
        
        // Check for uploaded files
        if (req.files.file1 && req.files.file1.length > 0) {
            data.file1 = req.files.file1[0].filename; // Access the filename of the first file
        }
        
        if (req.files.file2 && req.files.file2.length > 0) {
            data.file2 = req.files.file2[0].filename; // Access the filename of the second file
        }

        if (req.files.file3 && req.files.file3.length > 0) {
            data.file3 = req.files.file3[0].filename; // Access the filename of the second file
        }

        if (req.files.file4 && req.files.file4.length > 0) {
            data.file4 = req.files.file4[0].filename; // Access the filename of the second file
        }

        if (req.files.file5 && req.files.file5.length > 0) {
            data.file5 = req.files.file5[0].filename; // Access the filename of the second file
        }

        // Assuming you have a Product model to save the data
         const producted = await Product(data).save();
         res.send('Create Success');
        //console.log(data); // Log the final data object
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
}*/


//single file
/*exports.Create = async (req,res) => {
    try {
        console.log(req.body);
        console.log(req.file);
    
        var data = req.body;
    
        if (req.file) {
            data.file = req.file.filename;
        }
        
        const producted = await Product(data).save();
        res.send('Create Success');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
}*/


exports.Update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body; // Other form data
        const files = req.files; // All uploaded files

        console.log('New data to update product:', data);
        console.log('Uploaded files:', files);

        // Check if the product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }


        if (files && files.file1 && files.file1.length > 0) {
            data.file1 = files.file1[0].filename; // Assign the new file name to the data object
        
            if (data.currentimg1 === 'no_image.jpg') {
                console.log(data.currentimg1);
            } else {
                if (data.currentimg1) {
                    try {
                        await cloudinary.uploader.destroy(data.currentimg1); // ลบไฟล์จาก Cloudinary
                        console.log('Remove Product image 1 success updated.');
                    } catch (err) {
                        res.status(400).send('Update Product image 1 failed.');
                    }
                }
            }
        }
        
        if (files && files.file2 && files.file2.length > 0) {
            data.file2 = files.file2[0].filename; // Assign the new file name to the data object
        
            if (data.currentimg2 === 'no_image.jpg') {
                console.log(data.currentimg2);
            } else {
                if (data.currentimg2) {
                    try {
                        await cloudinary.uploader.destroy(data.currentimg2); // ลบไฟล์จาก Cloudinary
                        console.log('Remove Product image 2 success updated.');
                    } catch (err) {
                        res.status(400).send('Update Product image 2 failed.');
                    }
                }
            }
        }
        
        if (files && files.file3 && files.file3.length > 0) {
            data.file3 = files.file3[0].filename; // Assign the new file name to the data object
        
            if (data.currentimg3 === 'no_image.jpg') {
                console.log(data.currentimg3);
            } else {
                if (data.currentimg3) {
                    try {
                        await cloudinary.uploader.destroy(data.currentimg3); // ลบไฟล์จาก Cloudinary
                        console.log('Remove Product image 3 success updated.');
                    } catch (err) {
                        res.status(400).send('Update Product image 3 failed.');
                    }
                }
            }
        }
        
        if (files && files.file4 && files.file4.length > 0) {
            data.file4 = files.file4[0].filename; // Assign the new file name to the data object
        
            if (data.currentimg4 === 'no_image.jpg') {
                console.log(data.currentimg4);
            } else {
                if (data.currentimg4) {
                    try {
                        await cloudinary.uploader.destroy(data.currentimg4); // ลบไฟล์จาก Cloudinary
                        console.log('Remove Product image 4 success updated.');
                    } catch (err) {
                        res.status(400).send('Update Product image 4 failed.');
                    }
                }
            }
        }
        
        if (files && files.file5 && files.file5.length > 0) {
            data.file5 = files.file5[0].filename; // Assign the new file name to the data object
        
            if (data.currentimg5 === 'no_image.jpg') {
                console.log(data.currentimg5);
            } else {
                if (data.currentimg5) {
                    try {
                        await cloudinary.uploader.destroy(data.currentimg5); // ลบไฟล์จาก Cloudinary
                        console.log('Remove Product image 5 success updated.');
                    } catch (err) {
                        res.status(400).send('Update Product image 5 failed.');
                    }
                }
            }
        }
       
        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true }).exec();
        res.status(200).json(updatedProduct);

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};







/*const path = require('path');

exports.Update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body; // Other form data
        const files = req.files; // All uploaded files

        console.log('New data to update product:', data);
        console.log('Uploaded files:', files);

        // Check if the product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Handle file deletion if there's an existing image
        const currentImagePath = `./ProductImages/${product.currentimg1}`;
        if (product.currentimg1) {
            try {
                await fs.access(currentImagePath); // Check if file exists
                await fs.unlink(currentImagePath);
                console.log('Previous image deleted successfully');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log('File does not exist, no need to delete:', currentImagePath);
                } else {
                    console.error('Error deleting previous image:', err);
                }
            }
        }

        // Handle new file upload
        if (files && files.file1 && files.file1.length > 0) {
            data.file1 = files.file1[0].filename; // Assign the new file name to the data object

                    if(data.currentimg1 === 'no_image.jpg'){
                        console.log(data.currentimg1)
                    }  else {

                    await fs.unlink('./ProductImages/' + data.currentimg1,(err)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Upload file1 success')
                        }
                    })
                }
        }

        if (files && files.file2 && files.file2.length > 0) {
            data.file2 = files.file2[0].filename; // Assign the new file name to the data object

                    if(data.currentimg2 === 'no_image.jpg'){
                        console.log(data.currentimg2)
                    }  else {

                    await fs.unlink('./ProductImages/' + data.currentimg2,(err)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Upload file2 success')
                        }
                    })
                }

        }
        if (files && files.file3 && files.file3.length > 0) {
            data.file3 = files.file3[0].filename; // Assign the new file name to the data object

                    if(data.currentimg3 === 'no_image.jpg'){
                        console.log(data.currentimg3)
                    }  else {

                    await fs.unlink('./ProductImages/' + data.currentimg3,(err)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Upload file3 success')
                        }
                    })
                }

        }
        if (files && files.file4 && files.file4.length > 0) {
            data.file4 = files.file4[0].filename; // Assign the new file name to the data objects

                    if(data.currentimg4 === 'no_image.jpg'){
                        console.log(data.currentimg3)
                    }  else {

                    await fs.unlink('./ProductImages/' + data.currentimg4,(err)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Upload file4 success')
                        }
                    })
                }

            
        }
        if (files && files.file5 && files.file5.length > 0) {
            data.file5 = files.file5[0].filename; // Assign the new file name to the data object

                    if(data.currentimg5 === 'no_image.jpg'){
                        console.log(data.currentimg5)
                    }  else {

                    await fs.unlink('./ProductImages/' + data.currentimg5,(err)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Upload file5 success')
                        }
                    })
                }

        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true }).exec();
        res.status(200).json(updatedProduct);

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};*/


//update single
/*exports.Update = async (req,res) => {
    try{
        const id = req.params.id
        var NewData = req.body
        
        console.log(NewData)

        if(typeof req.file !== 'undefined'){
            NewData.file = req.file.filename
            await fs.unlink('./ProductImages/' + NewData.fileold,(err)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log('Update Success')
                }
            })
        }

        const updated = await Product.findOneAndUpdate({_id: id},NewData,{new: true}).exec();
        res.send(updated)
        //const updated = await Product.findOneAndUpdate({_id: id},req.body,{new: true}).exec();
        //res.send(id)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}*/


exports.Remove = async (req, res) => {
    try {
        const id = req.params.id;
        const removed = await Product.findOneAndDelete({ _id: id }).exec();

        if (removed) {
            // Array of file fields to check
            const fileFields = ['file1', 'file2', 'file3', 'file4', 'file5'];

            for (const field of fileFields) {
                if (removed[field] && removed[field] !== 'No_image.jpg') {
                    try {
                        await cloudinary.uploader.destroy(removed[field]);
                        console.log(`Removed Product images : ${removed[field]}`);
                    } catch (err) {
                        console.log(`Error removing file ${removed[field]}:`, err);
                    }
                }
            }
            res.json({
                message: 'Product removed successfully',
                product: removed,
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};



/*exports.Remove = async (req, res) => {
    try {
        const id = req.params.id;
        const removed = await Product.findOneAndDelete({ _id: id }).exec();

        if (removed) {
            // Array of file fields to check
            const fileFields = ['file1', 'file2', 'file3', 'file4', 'file5'];

            for (const field of fileFields) {
                if (removed[field] && removed[field] !== 'No_image.jpg') {
                    try {
                        await fs.unlink(`./ProductImages/${removed[field]}`);
                        console.log(`Removed file: ${removed[field]}`);
                    } catch (err) {
                        console.log(`Error removing file ${removed[field]}:`, err);
                    }
                }
            }
            res.json({
                message: 'Product removed successfully',
                product: removed,
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};*/


//single remove
/*exports.Remove = async (req,res) => {
    try{
        const id = req.params.id
        const removed = await Product.findOneAndDelete({_id: id}).exec();

        if(removed?.file){
            await fs.unlink('./ProductImages/' + removed.file,(err)=>{
                if(err){
                    console.log('Product',err)
                } else {
                    console.log('Product Remove Success')
                }
            })
        }
        res.send(removed)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}*/

//Search Product By Name
exports.ProductsName = async (req,res) => {
    try{
        const productname  = req.params.name;
        const producted = await Product.findOne({productname: productname}).exec();
        res.send(producted)
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

//Search Product By Type
exports.ProductsType = async (req,res) => {
    try {
        const { type } = req.body;
    
        // Build query based on provided filters
        let query = {};
        
        if (type) query.type=type;

            // Find products based on the query, sorted by ID
            const products = await Product.find(query).sort({ _id: -1 }); // Sort by _id in descending order
            // Check if products were found and respond accordingly
            if (products.length > 0) {
                res.send(products);
            } else {
                res.status(404).send('No products found');
            }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

//Search Product By Type
/*exports.ProductsType = async (req,res) => {
    try {
        const { type } = req.body;

        // Build query based on provided filters
        let query = {};
        
        if (type) query.type = type;

        // Find products based on the query
        const products = await Product.find(query);

        // Check if products were found and respond accordingly
        if (products.length > 0) {
            res.send(products);
        } else {
            res.status(404).send('No products found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}*/



//Administator

//Byname
exports.ProductReadByName = async (req,res) => {
    try{
        const productname = req.params.name;
        const producted = await Product.findOne({productname : productname}).exec();
        res.send(producted)
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}











