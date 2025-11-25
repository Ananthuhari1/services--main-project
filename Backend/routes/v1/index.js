const adminRouter = require('./adminRoutes');
const userRouter = require('./userRoutes');


const v1Router = require('express').Router();

v1Router.use("/user", userRouter);
v1Router.use("/admin", adminRouter);


module.exports = v1Router;