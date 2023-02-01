const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ProductRoutes = require('./api/routes/products');
const OrderRoutes = require('./api/routes/orders');
const UserRouters = require('./api/routes/users');
const ServiceRouters = require('./api/routes/services');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//to prevent from cors errors (should include before other routing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();  // finally continue to the relevant request
})


// mongoose.connect(
//     'mongodb+srv://admin:' +
//     process.env.MONGO_ATLAS_PW +
//     '@hire-now-cluster.ushzmvw.mongodb.net/?retryWrites=true&w=majority',
//     {
//         useMongoClient: true
//     }
// )


// do this again
mongoose.connect(
    'mongodb+srv://admin:' +
    process.env.MONGO_ATLAS_PW +
    '@hire-now-cluster.ushzmvw.mongodb.net/?retryWrites=true&w=majority'
)

mongoose.Promise = global.Promise;


app.use('/api/products', ProductRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/users', UserRouters);
app.use('/api/services', ServiceRouters);

//default url
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); // parser error to below function
})

//error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;