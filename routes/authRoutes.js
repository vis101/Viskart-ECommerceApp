import express from "express"
import regController, { getAllOrdersController, getOrdersController, loginControlller, orderStatusController, testController, updateProfileController } from '../contollers/authController.js'
import { checktoken, isAdmin } from "../middleware/authMiddleware.js";

//router object
const router = express.Router();

//register route
router.post('/register', regController)

//login route
router.post('/login', loginControlller)

//test route if user is Admin or not
router.get('/test', checktoken, isAdmin, testController)

//User protected route if auth token is valid/user is loggedIn
router.get('/user-auth', checktoken, (req, res) => {
    res.status(200).send({ ok: true });
});

//Admin protected route if auth token is valid/user is loggedIn
router.get('/admin-auth', checktoken, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//update profile
router.put('/profile', checktoken, updateProfileController)

//orders
router.get("/orders", checktoken, getOrdersController);

//all orders
router.get("/all-orders", checktoken, isAdmin, getAllOrdersController);

// order status update
router.put("/order-status/:orderId", checktoken, isAdmin, orderStatusController);

export default router;
