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
const secret = speakeasy.generateSecretASCII(2048, false);
const { v4: uuidv4 } = require("uuid");
const saltRound = 15;
const mailOption = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "godspeednoreply@gmail.com",
    pass: "jepyfmcpixcbqnel",
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

function checkObject(object) {
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === undefined || object[prop] === "") {
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
  let totp = speakeasy.totp({
    secret: secret,
    time: Date.now(),
    step: 900,
    counter: Math.floor(Date.now() / 900 / 1000),
    digits: 6,
    encoding: "base32",
    algorithm: "sha512",
  });
  console.log(totp);
  const transporter = nodemailer.createTransport(mailOption);
  transporter.sendMail(emailMessage(totp, userEmail), (err) => {
    if (err) throw err;
    console.log("Mail sent successfully");
    response.end();
  });
});

app.post("/register", (request, response) => {
  let user = request.body.user;
  if (checkObject(user)) {
    let verify = speakeasy.totp.verify({
      secret: secret,
      token: user.otp,
      time: Date.now(),
      counter: Math.floor(Date.now() / 900 / 1000),
      step: 900,
      digits: 6,
      encoding: "base32",
      algorithm: "sha512",
    });
    database.query(
      `SELECT * FROM user.data WHERE user = '${user.username}' OR email = '${user.email}' limit 1`,
      (err, result) => {
        console.log(result);
        result = JSON.parse(JSON.stringify(result));
        if (Object.keys(result).length > 0) {
          response.status(200).json({ errorCode: 4 });
        } else {
          if (user.password !== user.verifyPassword) {
            response.status(200).json({ errorCode: 1 });
          } else if (!verify) {
            console.error("Hello");
            response.status(200).json({ errorCode: 2 });
          } else {
            bcrypt.hash(user.password, saltRound, (err, hash) => {
              database.query(
                `INSERT INTO user.data(ID,user,pass,email,phone) VALUES('${uuidv4()}', '${
                  user.username
                }', '${hash}', '${user.email}', '${user.phone}')`,
                (err, result) => {
                  if (err) throw err;
                  response.status(200).json({ errorCode: 0 });
                }
              );
            });
          }
        }
      }
    );
  } else {
    response.status(200).json({ errorCode: 3 });
  }
});

app.post("/login", (request, response) => {
  let user = request.body.user;
  if (checkObject(user)) {
    database.query(
      `SELECT pass FROM user.data WHERE user = '${user.username}'`,
      (err, result) => {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        if (Object.keys(result).length === 0) {
          response.json({ errorCode: 1 });
        } else {
          bcrypt.compare(user.password, result[0].pass, (err, result) => {
            if (err) throw err;
            if(result){
              response.json({ errorCode: 0, user: user.username });
            }
            else{
              response.json({ errorCode: 1 });
            }
          });
        }
      }
    );
  } else {
    response.json({ errorCode: 2 });
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
