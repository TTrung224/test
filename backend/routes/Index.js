const AccountRouter = require('./Account');
const CategoryRouter = require('./Category');
const OrderRouter = require('./Order');
const ProductRouter = require('./Product');

function route(app) {
    
    app.use('/account', AccountRouter);
    app.use('/category', CategoryRouter);
    app.use('/order', OrderRouter);
    app.use('/product', ProductRouter);
}

module.exports = route;