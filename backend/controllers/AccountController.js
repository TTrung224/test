const Account = require("../model/Account");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AccountController {
    // [GET] account
    async getUser(req, res, next) {
        let user = req.user;
        try {
            let result = await Account.findOne({ email: user.email });
            let data = {}
            data._id = result._id
            data.fullName = result.fullName;
            data.email = result.email;
            data.type = result.type;
            data.sellerStatus = result?.sellerStatus

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    }

    // [POST] account/login
    async login(req, res, next) {
        try {
            const { emailOrPhone, pwd } = req.body;

            if (!(emailOrPhone && pwd)) {
                res.status(400).send("All input is required");
            }

            let user;
            user = await Account.findOne({ email: emailOrPhone });
            if (!user) {
                user = await Account.findOne({ phone: emailOrPhone });
            }

            if (user && bcrypt.compare(pwd, user.password)) {
                // Create token
                const token = jwt.sign(
                    { userId: user._id, email: user.email, type: user.type, sellerStatus: user.sellerStatus },
                    process.env.TOKEN_KEY, 
                    {expiresIn: "2h"}
                );
                let data = {};
                data._id = user._id
                data.fullName = user.fullName;
                data.email = user.email;
                data.type = user.type;
                data.token = token;
                data.sellerStatus = user?.sellerStatus;

                // save the token to cookie that send back in response
                res.cookie('token', token, { httpOnly: true, signed: true });

                // user
                return res.status(200).json(data);
                // return res.status(200).json({success: true, message: "login successfully"});
            }
            return res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    }

    // [POST] account/signup
    async register(req, res, next) {
        try {
            const { email, pwd, rePwd, fullName, type, phone, address} = req.body;


            // validate user input
            if(!type){
                return res.status(400).send("user type is required");
            }
            if(type == "customer"){
                if (!(email && pwd && rePwd && fullName && phone && address)) {
                    return res.status(400).send("All input is required");
                }
            }else if(type == "seller"){
                if (!(email && pwd && rePwd && fullName && phone)) {
                    return res.status(400).send("All input is required");
                }
            } else {
                return res.status(400).send("user type is incorrect");
            }
            if (!pwd === rePwd) {
                return res.status(400).send("re-password is not matched");
            }

            // check existence of user
            const dbUser = await Account.find({ email: email, phone: phone });
            console.log(dbUser)
            if (dbUser.length != 0) {
                return res.status(409).send("Email or Phone number has been used with another account");
            }

            //hash and salted password
            const encryptedPassword = await bcrypt.hash(pwd, 10);
            let tempUser = {
                fullName: fullName,
                phone: phone,
                email: email.toLowerCase(),
                password: encryptedPassword,
                type: type,
                address: address? address : null
            }

            if(tempUser.type == "seller"){
                tempUser.sellerStatus = "pending"
            }

            const user = await Account.create(tempUser);

            // if signup then not required login
            // // Token
            // const token = jwt.sign(
            //     { userId: user._id, email, type: user.type },
            //     process.env.TOKEN_KEY, 
            //     {expiresIn: "2h"}
            // );
            // user.token = token;

            // //save cookie token
            // res.cookie('token', token, { httpOnly: true });

            res.status(201).send("register user successfully");
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    }

    // [POST] account/logout
    async logout(req, res) {
        try {
            if (req.user != null) {
                res.clearCookie('token');
                return res.status(200).json({ success: true, message: "logout successfully" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "internal server error" })
        }
    }

    // [Get] getAllSellerRequest
    async getAllSellerRequest(req, res){
        try{
            const result = await Account.find({type: "seller"})
            res.status(200).json(result)
        } catch(error){
            console.log(error)
            res.status(500).send()
        }
    }

    // [PUT] seller-request/:sellerId
    async updateSellerRequestStatus(req, res){
        if(req.body.sellerStatus && (req.body.sellerStatus == "rejected" || req.body.sellerStatus == "accepted")){
            try{
                await Account.findByIdAndUpdate(req.params.sellerId, {sellerStatus: req.body.sellerStatus})
                res.status(200).send("udpate request status successfully")
            } catch(error){
                res.status(500).send()
            }
        }else{
            res.status(400).send("status is in wrong format")
        }
    }

    // Support functions:

    async getUserNameByEmail(email) {
        try {
            let result = await findOne({ email: email });
            const name = result.first_name + " " + result.last_name;
            return name
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new AccountController();