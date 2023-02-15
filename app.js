const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserRouters = require('./api/routes/users');
const CategoryRouters = require('./api/routes/category');
const ServiceRouters = require('./api/routes/services');
const OrderRoutes = require('./api/routes/orders');
const MessageRoutes = require("./api/routes/message");
const FavouriteRoutes = require("./api/routes/favourite-routes");
const PackageRoutes = require("./api/routes/package-router");
const GalleryRoutes = require("./api/routes/gallery-routes");

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
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


app.use('/api/users', UserRouters);
app.use('/api/categories', CategoryRouters);
app.use('/api/services', ServiceRouters);
app.use('/api/orders', OrderRoutes);
app.use('/api/messages', MessageRoutes);
app.use('/api/favourites', FavouriteRoutes);
app.use('/api/packages', PackageRoutes);
app.use('/api/gallery', GalleryRoutes);

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