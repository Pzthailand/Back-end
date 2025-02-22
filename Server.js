const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser') //All Read In Server
//const morgan = require('morgan')
const { readdirSync } = require('fs')

// *1
//import Product from ('./Routes/Product')
// *2
//const ProductRouter = require('./Routes/Product')


//app.use(morgan('dev'))
//app.use(bodyParser.json({limit: '10mb'}))
const app = express();
//app.use(cors())
app.use(cors({
    /*origin: 'http://localhost:5173',*/
    origin: 'https://moonlit-otter-39c110.netlify.app',// Specify the allowed origin
    credentials: true
}));


app.use(express.json());  //Debug Postman (req,res)

const  connectDB = require ('./Config/db.js')
connectDB()

/* *1
app.get('/Product',(req,res) => {
    res.send('hi')
})*/

// *2   
//app.use('/api',ProductRouter)
app.use('/api/UserImages', express.static('./UserImages'));
app.use('/api/ProductImages', express.static('./ProductImages'));
app.use('/api/ProblemImages', express.static('./ProblemImages'));

// *3
//readdirSync('./Routes').map((r)=> console.log(r))
readdirSync('./Routes').map((r) => app.use('/api', require('./Routes/' +r)))
app.listen(8081,()=> console.log('Server Is Running...'))