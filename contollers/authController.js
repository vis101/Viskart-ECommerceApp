import { comparePass, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"


//register contoller
const regController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body

        if (!name) {
            return res.send({ message: 'Name is Req' })
        }
        if (!email) {
            return res.send({ message: 'email is Req' })
        }
        if (!password) {
            return res.send({ message: 'password is Req' })
        }
        if (!phone) {
            return res.send({ message: 'phone is Req' })
        }
        if (!address) {
            return res.send({ message: 'address is Req' })
        }

        //check user
        const existinguser = await userModel.findOne({ email })

        if (existinguser) {
            return res.status(200).send({ success: true, message: "Already register please login" });
        }

        //register new user
        const hashedPassword = await hashPassword(password);

        //save user details
        const user = await new userModel({ name, email, phone, address, password: hashedPassword }).save();

        res.status(201).send({ success: true, message: "Registered Successfully", "user": user });


    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in Registration" });
    }
}


//Post login

export const loginControlller = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Invalid username or password' });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const match = await comparePass(password, user.password)
        if (!match) {
            return res.status(404).send({ success: false, message: 'Invalid Password' });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })


        res.status(200).send({ success: true, message: "Login Successfully", user: { name: user.name, email: user.email, phone: user.phone, role: user.role, address: user.address }, token: token });


    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in LOGIN" });
    }
}

//check auth token
export const testController = async (req, res) => {
    try {

        res.send("Auth token valid")

        //res.status(200).send({ success:true ,message: "User Login Successfully", user:{name:user.name,email:user.email,phone:user.phone}, token:token });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Auth token Invalid" });
    }
}

//update profile controller

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body
        const user = await userModel.findById(req.user._id);

        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });


    } catch (error) {
        console.log(error);
    }
};

//get orders for current users
export const getOrdersController = async(req,res)=>{
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({success:false,message:"Error in getting orders",error})
    }
}

//all orders for all users for admin
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };


export default regController