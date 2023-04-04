const express = require("express");
const fs = require("fs");
const mysql = require("mysql");
const session = require("express-session");
const MySQLSession = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const multer = require("multer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const port = 3000;
const app = express();
const cors = require("cors");
const http = require("http");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const Fuse = require("fuse.js");
const { Server } = require("socket.io");
const seedRandom = require("seedrandom");
const { type } = require("os");
const secret = speakeasy.generateSecretASCII(2048, false);
const saltRound = 15;

const database = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "Haido29904@",
  port: 3306,
});

const databaseOption = {
  host: "localhost",
  user: "admin",
  password: "Haido29904@",
  port: 3306,
  database: "user",
  clearExpired: true,
  checkExpirationInterval: 60 * 60 * 1000, //check for expired session every hour,
  expiration: 30 * 24 * 60 * 60 * 1000, //expire after 30 days, in milliseconds
  schema: {
    tableName: "session",
    columnNames: {
      session_id: "sessionID",
      expires: "expires",
      data: "data",
    },
  },
};

database.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected on port 3306");
});

const MySQLStore = new MySQLSession(databaseOption);

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

function generateRoom(length, seed1, seed2) {
  const rng = seedRandom((parseInt(seed1) + parseInt(seed2)).toString());
  const character =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += character.charAt(Math.floor(rng() * character.length));
  }
  return result;
}

app.use(
  session({
    name: "userSession",
    secret: speakeasy.generateSecretASCII(),
    resave: false,
    store: MySQLStore,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // save the session cookie for 30 days
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser(speakeasy.generateSecretASCII()));
app.use(morgan("combined"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost" },
});

io.on("connection", (socket) => {
  socket.on("join", (options) => {
    console.log(options.sender);
    socket.join(generateRoom(6, options.receiver, options.sender));
    database.query(
      `CREATE TABLE IF NOT EXISTS user.${generateRoom(
        6,
        options.receiver,
        options.sender
      )} (ID INT NOT NULL AUTO_INCREMENT, sender VARCHAR(255) NOT NULL, content VARCHAR(255) NOT NULL, timestamp VARCHAR(255), PRIMARY KEY (ID))`
    );
    socket.emit("roomID", generateRoom(6, options.receiver, options.sender));
    database.query(
      `SELECT * from user.${generateRoom(
        6,
        options.receiver,
        options.sender
      )} ORDER BY timestamp ASC LIMIT 20`,
      (err, result) => {
        if (err) throw err;
        result = JSON.stringify(result);
        socket.emit("loadMessage", result);
      }
    );
  });
  socket.on("message", (message) => {
    console.log(message.ID);
    database.query(
      `INSERT INTO user.${message.room} (sender, content, timestamp) VALUES ('${
        message.ID
      }', '${message.content}', ${Date.now()})`
    );
    io.to(message.room).emit("message", {
      content: message.content,
      sender: message.ID,
    });
  });
  socket.on("leave", (roomID) => {
    socket.leave(roomID);
  });
});

app.post("/OTP", (request, response) => {
  let userEmail = request.body.email;
  let totp = speakeasy.totp({
    secret: secret,
    time: Date.now(),
    step: 900,
    counter: Math.floor(Date.now() / 900 / 1000),
    digits: 6,
    encoding: "base32",
    algorithm: "sha512",
  });
  const transporter = nodemailer.createTransport(mailOption);
  transporter.sendMail(emailMessage(totp, userEmail), (err) => {
    if (err) throw err;
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
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        if (Object.keys(result).length > 0) {
          response.status(200).json({ errorCode: 4 });
        } else {
          if (user.password !== user.verifyPassword) {
            response.status(200).json({ errorCode: 1 });
          } else if (!verify) {
            response.status(200).json({ errorCode: 2 });
          } else {
            bcrypt.hash(user.password, saltRound, (err, hash) => {
              database.query(
                `INSERT INTO user.data(user,pass,email,phone) VALUES('${user.username}', '${hash}', '${user.email}', '${user.phone}')`,
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
      `SELECT * FROM user.data WHERE user = '${user.username}'`,
      (err, result) => {
        if (err) throw err;
        let data = JSON.parse(JSON.stringify(result));
        if (Object.keys(data).length === 0) {
          response.json({ errorCode: 1 });
        } else {
          bcrypt.compare(user.password, data[0].pass, (err, result) => {
            if (err) throw err;
            if (result) {
              request.session.user = {
                ID: data[0].ID,
                user: data[0].user,
                timeStamp: Date.now().toLocaleString(),
              };
              response.cookie("userSession", request.sessionID, {
                maxAge: 30 * 60 * 60 * 24 * 1000,
              });
              response.cookie("userID", data[0].ID, {
                maxAge: 30 * 60 * 60 * 24 * 1000,
                secure: true,
                sameSite: "strict",
              });
              response.json({
                errorCode: 0,
                user: user.username,
                ID: data[0].ID,
              });
            } else {
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

app.post("/checkSession", (request, response) => {
  let sessionID = request.body.userSession;
  database.query(
    `SELECT * from user.session where sessionID = '${sessionID}' limit 1`,
    (err, result) => {
      if (err) throw err;
      if (Object.keys(JSON.parse(JSON.stringify(result))).length === 0) {
        response.end();
      } else {
        let data = JSON.parse(
          JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))))[0].data
        ).user;
        if (Date.now() >= parseInt(data.expires)) {
          response.end();
        } else {
          response.json({ accept: true });
        }
      }
    }
  );
});

app.post("/search", (request, response) => {
  const search = request.body.search;
  database.query(
    `SELECT user, ID FROM user.data WHERE user LIKE '%${search}%' AND LENGTH('${search}') > 0`,
    (err, result) => {
      if (err) throw err;
      let data = JSON.parse(JSON.stringify(result));
      response.json(data);
    }
  );
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log("Server is running on port 3000");
});
