const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const userRouter = require('./router/userRouter')
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


const sessOption = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_STORE,
    ttl: 400 * 60 * 60,
    autoRemove: "native",
  }),
};

const corsOptions = {
  origin: ["http://localhost:5008"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json())
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessOption));

app.use('/api', userRouter)
app.use('/api/authorized', auth, authorizedRouter)

const port = 5008
app.listen(5008, () => {
    console.log(`Server started on port ${port}`);
  });