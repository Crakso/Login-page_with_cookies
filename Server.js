const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');// it is type 3 security we combine #value and saltkey and make a encrypted code.
const saltRounds = 10;
const cookieparser = require("cookie-parser");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieparser());


main().catch(err => console.log(err));
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/UserLogin's", { useNewUrlParser: true });
    const Details = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minlength: 6,
            required: true,
        },
        Email: {
            type: String,
            unique: true,
            required: true
        },
    });

    const SignUp = mongoose.model("SignUp", Details);

    const user1 = new SignUp({
        username: "Neeraj",
        password: "12345",   //all passwords are same.
        Email: "neeraj@gmail.com"
    });
    // user1.save();
        

    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/websites sample/login page.html");
        // res.cookie("login_detail",user1);
    });
    app.post("/", async function (req, res) {
        const logUid = req.body.loginUid;
        const logpass = req.body.loginpass;
        const cookie_data = req.cookies.login_detail;
        const login = await SignUp.findOne({
            $or: [
                { username: logUid },
                { Email: logUid }]
        });
        const match = await bcrypt.compare(logpass, cookie_data.password);
        try {
            //     if (match) {
            //        return res.sendFile(__dirname + "/websites sample/login.html");
            //     }else{
            //       return console.log("This User id and password is invalid");

            // }} catch (error) {
            //     console.log(error);
            // }


            if (!cookie_data) {
                if (match || login.password === logpass) {
                    return res.sendFile(__dirname + "/websites sample/login.html");

                } else {
                    return console.log("This User id and password is invalid");
                }
            } else {
                if (cookie_data.username === logUid || cookie_data.Email === logUid && await bcrypt.compare(logpass, cookie_data.password)||cookie_data.password === logpass) {
                    return res.sendFile(__dirname + "/websites sample/login.html");
                }else{
                    if (match || login.password === logpass) {
                        return res.sendFile(__dirname + "/websites sample/login.html");
    
                    } else {
                        return console.log("This User id and password is invalid");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        // console.log(req.cookies.login_detail.username);

    });
    app.get("/SignUp", function (req, res) {

    });
    app.post("/SignUp", async function (req, res) {
        const UId = req.body.Uid;
        const email = req.body.Email;
        const Password = req.body.pass;
        const dup = SignUp.find({ name: UId });
        try {
            if (dup.username === UId) {
                console.log("Uid is already exist!");

            } else {
                bcrypt.hash(Password, saltRounds, function (err, hash) {
                    const Newinfo = new SignUp({
                        username: UId,
                        password: hash,
                        Email: email
                    });
                    Newinfo.save();
                    res.cookie("login_detail", Newinfo);
                    res.redirect("/");
                    console.log("SignUp Successfully");
                });
            }
        } catch (error) {
            console.log(error);
        }

    });

    app.listen(2000, function () {
        console.log("Server is live now on port:2000");
    })
}