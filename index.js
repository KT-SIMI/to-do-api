const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const userRouter = require('./router/userRouter')

// const WebSocket = require('ws');
const { auth } = require("./middleware/auth")
const authorizedRouter = require('./router/authorizedRouter')
require("dotenv").config();


(async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected`);
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
})();


const app = express();

const isProduction = process.env.NODE_ENV === "prod"; 

const sessOption = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax", 
    maxAge: 720 * 60 * 60 * 1000, 
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_STORE,
    ttl: 400 * 60 * 60, // 400 hours
    autoRemove: "native",
  }),
};

const corsOptions = {
  origin: ["https://to-do-api-drab.vercel.app", "https://obscure-couscous-gv4gxx79wpwhwppx-3000.app.github.dev", "http://localhost:3000", "http://localhost:5008"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session(sessOption));
app.use(cors(corsOptions));

// const server = new WebSocket.Server({ port: 3000 });

// server.on('connection', (ws, req) => {
//   console.log('Client connected with protocol:', req.headers['origin']);
// });



app.use('/api', userRouter)
app.use('/api/authorized', auth, authorizedRouter)


const port = 5008
app.listen(5008, () => {
    console.log(`Server started on port ${port}`);
  });