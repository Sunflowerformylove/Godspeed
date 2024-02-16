//Before learning React, my dumbass didn't even think of splitting this file into smaller functionality files
//Which something I learned in C++.
const express = require("express");
const fs = require("fs");
const mysql = require("mysql");
const session = require("express-session");
const MySQLSession = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const multer = require("multer");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const port = 3000;
const app = express();
const cors = require("cors");
const https = require("https");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const Fuse = require("fuse.js");
const events = require("events");
const eventEmitter = new events();
const { Server } = require("socket.io");
const seedRandom = require("seedrandom");
const path = require("path");
const secret = speakeasy.generateSecretASCII(2048, false);
const saltRound = 15;
const { v4: uuidv4 } = require("uuid");
const BadWords = require("./Functions/badword.js");
const Filter = new BadWords();
const { PeerServer } = require("peer");

const httpsOptions = {
	key: fs.readFileSync("../Certificate/key.pem"),
	cert: fs.readFileSync("../Certificate/cert.pem"),
};

const database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	port: 3306,
});

const databaseOption = {
	host: "localhost",
	user: "root",
	port: 3306,
	password: "",
	createDatabaseTable: true,
	clearExpired: true,
	checkExpirationInterval: 60 * 60 * 1000, //check for expired session every hour,
	expiration: 30 * 24 * 60 * 60 * 1000, //expire after 30 days, in milliseconds
	database: "user",
	schema: {
		tableName: "session",
		columnNames: {
			session_id: "sessionID",
			expires: "expires",
			data: "data",
		},
	},
};

const multerConfig = multer.diskStorage({
	destination: function (req, file, next) {
		next(null, "./Upload");
	},
	filename: function (req, file, next) {
		const extension = file.mimetype.split("/")[1];
		next(
			null,
			file.originalname.split(".")[0] + "-" + Date.now() + "." + extension
		);
	},
	fileFilter: function (req, file, cb) {
		if (
			file.mimetype ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			file.mimetype = file.name;
		}
		cb(null, true);
	},
});

const upload = multer({ storage: multerConfig });

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

function checkURL(url) {
	url.trim();
	if (url === undefined || url === "") {
		return false;
	}
	const URLRegex = new RegExp(
		"(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})"
	);
	if (URLRegex.test(url)) {
		return true;
	}
	return false;
}

function checkYoutubeURL(url) {
	const YoutubeRegex = new RegExp(
		"^(https?://)?((www.)?youtube.com|youtu.be)/.+$"
	);
	if (YoutubeRegex.test(url)) {
		return true;
	}
	return false;
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

function decodeSessionID(sessionID) {
	sessionID = sessionID.split(".")[0];
	sessionID = sessionID.split(":")[1];
	return sessionID;
}
const server = https.createServer(httpsOptions, app);
const peerServer = PeerServer({
	port: 9000,
	path: "/",
	ssl: {
		key: fs.readFileSync("../Certificate/key.pem"),
		cert: fs.readFileSync("../Certificate/cert.pem"),
	},
	corsOptions: {
		origin: "*",
		methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
	},
	secure: true,
	allow_discovery: true,
});
server.listen(port, (err) => {
	if (err) throw err;
	console.log("Server is running on port 3000");
});
peerServer.listen(() => {
	console.log("Peer server is running on port 9000");
});

peerServer.on("connection", (client) => {
	console.log("New client connected: " + client.getId());
});

const io = new Server(server, {
	cors: { origin: "*" },
	pingInterval: 1000,
	pingTimeout: 10000,
});
app.use(
	session({
		name: "userSession",
		secret: speakeasy.generateSecretASCII(),
		resave: false,
		store: MySQLStore,
		saveUninitialized: false,
		cookie: {
			httpOnly: false,
			maxAge: 30 * 24 * 60 * 60 * 1000, // save the session cookie for 30 days
			resave: false,
		},
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	cors({
		origin: "https://localhost:80",
		methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use(cookieParser(speakeasy.generateSecretASCII()));
app.use(morgan("combined"));

io.on("connection", (socket) => {
	socket.onAny((event, ...args) => {
		console.log(event, args); //logging and debugging
	});

	socket.pingTimeout = 5000;
	socket.pingInterval = 1000;

	socket.on("getUser", (data) => {
		socket.data.ID = data;
		socket.broadcast.emit("setStatus", {
			ID: socket.data.ID,
			status: true,
		});
	});

	socket.on("join", (options) => {
		socket.join(generateRoom(6, options.receiver, options.sender));
		database.query(
			`CREATE TABLE IF NOT EXISTS room.${options.sender} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255) NOT NULL,recipient INT, type VARCHAR(255), lastChatTime BIGINT, PRIMARY KEY (roomID))`
		);
		database.query(
			`CREATE TABLE IF NOT EXISTS room.${options.receiver} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255) NOT NULL,recipient INT, type VARCHAR(255), lastChatTime BIGINT, PRIMARY KEY (roomID))`
		);
		database.query(
			`CREATE TABLE IF NOT EXISTS message.${generateRoom(
				6,
				options.receiver,
				options.sender
			)} (ID INT NOT NULL AUTO_INCREMENT, sender VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, timestamp VARCHAR(255), recipientHide TINYINT DEFAULT 0, senderHide TINYINT DEFAULT 0, type VARCHAR(255), filename VARCHAR(255), originalname VARCHAR(255), extension VARCHAR(255), location VARCHAR(255), size INT, mimetype VARCHAR(255), uuid VARCHAR(255), replier INT, reply INT, replyType VARCHAR(255), replyMessage LONGTEXT, PRIMARY KEY (ID))`
		);
		database.query(
			`REPLACE INTO convos.${
				options.sender
			}(roomID, roomName) VALUES('${generateRoom(
				6,
				options.receiver,
				options.sender
			)}', (SELECT user FROM user.data WHERE ID = '${options.receiver}'))`
		);
		socket.emit("roomID", generateRoom(6, options.receiver, options.sender));
		database.query(
			`SELECT * from message.${generateRoom(
				6,
				options.receiver,
				options.sender
			)} ORDER BY timestamp ASC LIMIT 20`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				result.forEach((message) => {
					if (message.type === "file" && message.content !== "deleted") {
						let fileStream = fs.readFileSync(message.location);
						message.file = fileStream;
						message.extension = path.extname(message.originalname);
					}
				});
				socket.emit("loadMessage", result);
			}
		);
	});

	socket.on("joinExistingRoom", (data) => {
		socket.join(`${data}`);
		database.query(
			`SELECT * from message.${data} ORDER BY timestamp ASC`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				result.forEach((message) => {
					if (message.type === "file" && message.content !== "deleted") {
						let fileStream = fs.readFileSync(message.location);
						message.file = fileStream;
						message.extension = path.extname(message.originalname);
					}
				});
				socket.emit("loadMessage", result);
				socket.emit("roomID", data);
			}
		);
	});

	socket.on("message", (message) => {
		database.query(
			`INSERT INTO message.${
				message.room
			} (sender, content, timestamp, type, replier, reply, replyType, replyMessage) VALUES ('${
				message.senderID
			}', ${database.escape(message.content)}, ${Date.now()}, '${
				checkURL(message.content)
					? "url"
					: checkYoutubeURL(message.content)
					? "youtube"
					: "text"
			}', '${message.replier}' ,'${message.reply}', '${
				message.replyType === "" ? "NULL" : message.replyType
			}',"${
				message.replyMessage === ""
					? "NULL"
					: database.escape(message.replyMessage)
			}")`
		);
		database.query(
			`SELECT ID, recipientHide, senderHide FROM message.${message.room} WHERE sender = '${message.senderID}' ORDER BY timestamp DESC LIMIT 1`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				if (message.isFiltered) {
					message.content = Filter.Clean(message.content);
				}
				io.to(message.room).emit("message", {
					content: message.content,
					sender: message.senderID,
					ID: result[0].ID,
					hideRecipient: result[0].recipientHide,
					hideSender: result[0].senderHide,
					type: checkURL(message.content)
						? "url"
						: checkYoutubeURL(message.content)
						? "youtube"
						: "text",
					replier: message.replier,
					reply: message.reply,
					replyType: message.replyType,
					replyMessage: message.replyMessage,
				});
			}
		);
		database.query(
			`REPLACE INTO convos.${
				message.senderID
			} (roomID, roomName, lastMessage, timestamp, sender, senderName, type) VALUES ('${
				message.room
			}', (SELECT * FROM (SELECT user FROM user.data WHERE ID = '${
				message.receiverID
			}') AS T),${database.escape(message.content)}, ${Date.now()}, '${
				message.senderID
			}',(SELECT user FROM user.data WHERE ID = '${message.senderID}'),
      '${
				checkURL(message.content)
					? "url"
					: checkYoutubeURL(message.content)
					? "youtube"
					: "text"
			}')`
		);
		database.query(
			`CREATE TABLE IF NOT EXISTS convos.${message.receiverID} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255), lastMessage LONGTEXT, timestamp VARCHAR(255), sender VARCHAR(255), senderName VARCHAR(255), type VARCHAR(255), uuid VARCHAR(255), PRIMARY KEY (roomID))`
		);
		database.query(
			`REPLACE INTO convos.${
				message.receiverID
			} (roomID, roomName, lastMessage, timestamp, sender, senderName, type) VALUES ('${
				message.room
			}', (SELECT * FROM (SELECT user FROM user.data WHERE ID = '${
				message.receiverID
			}') AS T),${database.escape(message.content)}, ${Date.now()}, '${
				message.senderID
			}',(SELECT user FROM user.data WHERE ID = '${message.senderID}'),
      '${
				checkURL(message.content)
					? "url"
					: checkYoutubeURL(message.content)
					? "youtube"
					: "text"
			}')`
		);
		database.query(
			`REPLACE INTO room.${
				message.senderID
			} (roomID, roomName, recipient, lastChatTime) VALUES ('${
				message.room
			}', (SELECT user FROM user.data WHERE ID = '${message.receiverID}'), ${
				message.receiverID
			}, ${Date.now()})`
		);
		database.query(
			`REPLACE INTO room.${
				message.receiverID
			} (roomID, roomName, recipient, lastChatTime) VALUES ('${
				message.room
			}', (SELECT user FROM user.data WHERE ID = '${message.senderID}'), ${
				message.senderID
			}, ${Date.now()})`
		);
	});

	socket.on("setLatestMessage", (data) => {
		database.query(
			`SELECT user FROM user.data WHERE ID = '${data.sender}'`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				io.to(`${data.room}`).emit("getLatestMessage", {
					room: data.room,
					sender: result[0].user,
					content: data.content,
					timestamp: data.timestamp,
				});
			}
		);
	});

	socket.on("getRoom", (data) => {
		database.query(
			`SELECT room.${data}.*, convos.${data}.lastMessage, convos.${data}.timestamp, convos.${data}.senderName 
    FROM room.${data}
    INNER JOIN convos.${data} ON room.${data}.roomID = convos.${data}.roomID`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				socket.emit("loadRoom", result);
			}
		);
	});

	socket.on("leave", (roomID) => {
		socket.leave(roomID);
	});

	socket.on("deleteRMessage", (data) => {
		database.query(
			`UPDATE message.${data.room} SET recipientHide = '1' WHERE ID = ${data.ID}`,
			(err, result) => {
				if (err) throw err;
			}
		);
	});

	socket.on("deleteSMessage", (data) => {
		database.query(
			`UPDATE message.${data.room} SET senderHide = '1', content = '' WHERE ID = ${data.ID}`,
			(err, result) => {
				if (err) throw err;
			}
		);
	});

	socket.on("deleteSImage", (data) => {
		database.query(
			`UPDATE message.${data.room} SET content = 'deleted', senderHide = '1' WHERE uuid = '${data.uuid}' AND mimetype LIKE 'image%'`,
			(err, result) => {
				if (err) throw err;
			}
		);
		database.query(
			`SELECT filename FROM message.${data.room} WHERE uuid = '${data.uuid}' AND mimetype LIKE 'image%'`,
			(err, result) => {
				if (err) throw err;
				const data = JSON.parse(JSON.stringify(result));
				data.forEach((file) => {
					fs.unlinkSync(`./Upload/${file.filename}`);
				});
			}
		);
	});

	socket.on("deleteRImage", (data) => {
		database.query(
			`UPDATE message.${data.room} SET recipientHide = '1' WHERE uuid = '${data.uuid}' AND mimetype LIKE 'image%'`,
			(err, result) => {
				if (err) throw err;
			}
		);
	});

	socket.on("deleteSVideo", (data) => {
		database.query(
			`UPDATE message.${data.room} SET content = 'deleted', senderHide = '1' WHERE uuid = '${data.uuid}'`,
			(err, result) => {
				if (err) throw err;
			}
		);
		database.query(
			`SELECT filename from message.${data.room} WHERE uuid = '${data.uuid}'`,
			(err, result) => {
				if (err) throw err;
				result = JSON.parse(JSON.stringify(result));
				fs.unlinkSync(`./Upload/${result.filename}`);
			}
		);
	});

	socket.on("deleteRVideo", (data) => {
		database.query(
			`UPDATE message.${data.room} SET recipientHide = '1' WHERE uuid = '${data.uuid}'`,
			(err, result) => {
				if (err) throw err;
			}
		);
	});

	socket.on("deleteSAudio", (data) => {
		database.query(
			`UPDATE message.${data.room} SET content = 'deleted', senderHide = '1' WHERE uuid = '${data.uuid}'`,
			(err, result) => {
				if (err) throw err;
				fs.unlinkSync(`./Upload/${data.filename}`);
			}
		);
	});

	socket.on("deleteRAudio", (data) => {
		database.query(
			`UPDATE message.${data.room} SET recipientHide = '1' WHERE uuid = '${data.uuid}'`,
			(err, result) => {
				if (err) throw err;
			}
		);
	});

	socket.on("getStatus", async (data) => {
		const sockets = await io.fetchSockets();
		let flag = false;
		for (let i = 0; i < sockets.length; i++) {
			if (sockets[i].data.ID === data) {
				socket.emit("setStatus", {
					ID: data,
					status: true,
				});
				flag = true;
				break;
			}
		}
		if (!flag) {
			socket.emit("setStatus", {
				ID: data,
				status: false,
			});
		}
	});

	socket.on("handshake", (data) => {
		io.to(`${data.room}`).emit("handshake", data);
	});

	socket.on("disconnect", () => {
		socket.broadcast.emit("setStatus", {
			ID: socket.data.ID,
			status: false,
		});
	});

	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`);
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
								`INSERT INTO user.data(user,pass,email,phone) VALUES(${database.escape(
									user.username
								)}, ${database.escape(hash)}, ${database.escape(user.email)}, ${
									user.phone
								})`,
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
							database.query(
								`CREATE TABLE IF NOT EXISTS convos.${data[0].ID} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255), lastMessage LONGTEXT, timestamp VARCHAR(255), sender VARCHAR(255), senderName VARCHAR(255), type VARCHAR(255), uuid VARCHAR(255), PRIMARY KEY (roomID))`
							);
							database.query(
								`CREATE TABLE IF NOT EXISTS room.${data[0].ID} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255) NOT NULL,recipient INT, type VARCHAR(255), lastChatTime BIGINT, PRIMARY KEY (roomID))`
							);
							response.json({
								errorCode: 0,
								user: user.username,
								ID: data[0].ID,
							});
							database.query(`INSERT INTO setting.chat_config(ID, config, timestamp) VALUES(${
								data[0].ID
							}, 
                '{"Appearance": {"Theme": "Light", "Accent": "black", "Font": "Source Serif Pro", "FontSize": "Small", "FontColor": "Black", "BubbleColor": "Ebony", "BubbleOpacity": "100", "BubbleRadius": "10"}, "Notification": {"Sound": "Default", "Popup": "Banner + Sound"}, "ProfanityFilter": "Off", "AutoDelete": "Off"}', ${Date.now()})
                ON DUPLICATE KEY UPDATE ID = ${
									data[0].ID
								}, config = '{"Appearance": {"Theme": "Light", "Accent": "black", "Font": "Source Serif Pro", "FontSize": "Small", "FontColor": "Black", "BubbleColor": "Ebony", "BubbleOpacity": "100", "BubbleRadius": "10"}, "Notification": {"Sound": "Default", "Popup": "Banner + Sound"}, "ProfanityFilter": "Off", "AutoDelete": "Off"}', timestamp = ${Date.now()}`);
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
	sessionID = decodeSessionID(sessionID);
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
					database.query(
						`CREATE TABLE IF NOT EXISTS convos.${data.ID} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255), lastMessage LONGTEXT, timestamp VARCHAR(255), sender VARCHAR(255), senderName VARCHAR(255), type VARCHAR(255), uuid VARCHAR(255), PRIMARY KEY (roomID))`
					);
					database.query(
						`CREATE TABLE IF NOT EXISTS room.${data.ID} (roomID VARCHAR(255) NOT NULL, roomName VARCHAR(255) NOT NULL,recipient INT, type VARCHAR(255), lastChatTime BIGINT, PRIMARY KEY (roomID))`
					);
					database.query(
						`SELECT * FROM user.data WHERE ID = ${data.ID}`,
						(err, result) => {
							let userData = JSON.parse(JSON.stringify(result));
							response.json({
								accept: true,
								user: userData[0].user,
								ID: userData[0].ID,
							});
						}
					);
				}
			}
		}
	);
});

app.post("/search", (request, response) => {
	const search = request.body.search;
	database.query(
		`SELECT user, ID FROM user.data WHERE (user LIKE '%${search}%' or phone LIKE '%${search}%' OR email LIKE '%${search}%') AND LENGTH('${search}') > 0`,
		(err, result) => {
			if (err) throw err;
			let data = JSON.parse(JSON.stringify(result));
			response.json(data);
		}
	);
});

app.post("/api/user", (request, response) => {
	const ID = request.body.receiverID;
	database.query(
		`SELECT user FROM user.data WHERE ID = ${database.escape(ID)} LIMIT 1`,
		(err, result) => {
			if (err) throw err;
			let data = JSON.parse(JSON.stringify(result));
			response.json(data);
		}
	);
});

app.post("/api/upload", upload.array("file"), (request, response) => {
	let file = request.files;
	let data = request.body;
	let now = Date.now();
	const ID = uuidv4();
	console.log(data);
	file.forEach((file) => {
		database.query(
			`INSERT INTO message.${
				data.room
			} (sender, content, timestamp,type,filename,originalname,extension,location,mimetype,size, uuid, replier, reply, replyType, replyMessage) VALUES(${database.escape(
				data.sender
			)},${database.escape(file.destination)},${database.escape(
				now
			)},"file",${database.escape(file.filename)},'${
				file.originalname
			}','${path.extname(file.originalname)}',${database.escape(
				file.path
			)},${database.escape(file.mimetype)},${database.escape(
				file.size
			)},${database.escape(ID)}, ${data.replier}, ${data.reply}, ${
				data.replyType === "" ? "NULL" : database.escape(data.replyType)
			}, ${
				data.replyMessage === "" ? "NULL" : database.escape(data.replyMessage)
			})`,
			(err) => {
				if (err) {
					response.json({ status: 500 });
				}
			}
		);
	});
	database.query(
		`SELECT * FROM message.${data.room} WHERE timestamp = ${database.escape(
			now
		)} AND type = "file"`,
		(err, result) => {
			if (err) {
				throw err;
			}
			let dataDB = JSON.parse(JSON.stringify(result));
			dataDB.forEach((file) => {
				file.extension = path.extname(file.filename);
				file.room = data.room;
			});
			dataDB.forEach((file) => {
				const fileStream = fs.readFileSync(file.location);
				file.file = fileStream;
			});
			io.to(`${data.room}`).emit("file", dataDB);
		}
	);
});

app.post("/api/download", (request, response) => {
	let body = request.body;
	response.download("./Upload/" + body.filename, {
		maxAge: 5 * 60 * 1000,
		dotfiles: "allow",
	});
});

app.post("/api/setting", (request, response) => {
	const ID = request.body.ID;
	const config = JSON.stringify(request.body.Setting);
	database.query(
		`UPDATE setting.chat_config SET config = ${database.escape(
			config
		)}, timestamp = ${Date.now()} WHERE ID = ${ID}`,
		(err, result) => {},
		(err, result) => {
			if (err) response.json({ status: 500 });
		}
	);
	response.json({ status: 200 });
	response.end();
});

app.post("/api/getSetting", (request, response) => {
	const ID = request.body.ID;
	database.query(
		`SELECT config FROM setting.chat_config WHERE ID = ${ID}`,
		(err, result) => {
			if (err) response.json({ status: 500 });
			let setting = JSON.parse(JSON.stringify(result));
			const data = {
				Setting: JSON.parse(setting[0].config),
				status: 200,
			};
			response.json(data);
		}
	);
});
