const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const mysqlSession = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const multer = require("multer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const port = 3000;
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const secret = speakeasy.generateSecretASCII();
const { v4: uuidv4 } = require("uuid");
const saltRound = 15;
const mailOption = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "godspeednoreply@gmail.com",
    pass: "angmuyflioxvscdj",
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
};

const emailMessage = (OTP, userEmail) => {
  const message = {
    from: "godspeednoreply@gmail.com",
    to: userEmail,
    subject: "OTP verification.",
    text:
      "Greeting,This is the OTP verification code: " +
      OTP +
      "." +
      "Please note that this OTP code will expire in 15 minutes. Sincerely, Hai Do.",
    html: `<div><div>Greeting,<br>This is the OTP verification code:<span><strong>${OTP}<strong></span></div>
      <br>
      <div>Please note that this OTP code will expire in 15 minutes</div>. <br>Sincerely, Hai Do.</div>`,
    headers: {
      priority: "high",
    },
  };
  return message;
};

function checkObject(object){
  for(let prop of object){
    if(object.hasOwnProperty(prop)){
      if(object[prop] === undefined || object[prop] === ""){ 
        return false;
      }
    }
  }
  return true;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port " + port);
});

app.post("/OTP", (request, response) => {
  let userEmail = request.body.email;
  console.log(userEmail);
  let hotp = speakeasy.hotp({
    secret: secret,
    counter: Date.now() % 900000,
    digits: 8,
    encoding: "ascii",
    algorithm: "sha512",
  });
  const transporter = nodemailer.createTransport(mailOption);
  transporter.sendMail(emailMessage(hotp, userEmail), (err) => {
    if (err) throw err;
    console.log("Mail sent successfully");
    response.end();
  });
});

app.post("/register", (request, response) => {
  let user = request.body.user;
  if(checkObject(user)){
    let verify = speakeasy.hotp.verify({
      secret: secret,
      token: user.otp,
      counter: Date.now() % 900000,
      digit: 8,
      encoding: "ascii",
      algorithm: "sha512",
    });
    if (user.password !== user.verifyPassword) {
      response.status(400).json({ errorCode: 1 });
    } else if (!verify) {
      response.status(400).json({ errorCode: 2 });
    }
    bcrypt.hash(user.password, saltRound, (err, hash) => {
      database.query(
        `INSERT INTO user.data(ID,user,password,email,phone) VALUES(${uuidv4()}, ${
          user.username
        }, ${hash}, ${user.email}, ${user.phone})`,
        (err, result) => {
          if(err) throw err;
          response.status(200).send();
        }
      );
    });
  }
  else{
    response.status(400).json({ errorCode: 3});
  }
});

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haido29904@",
  port: 3306,
});

database.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected on port 3306");
});
