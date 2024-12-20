const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
// const argon = require('argon2')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

exports.signup = catchAsync( async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body

    console.log(firstname)
    
   
    const hashedPassword = await bcrypt.hash(
        password, 
        parseInt(process.env.PWD_HASH_LENGTH)
    )
    
    

    const user = new User({
        firstname,
        lastname,
        password: hashedPassword,
        email
    })

    await user.save()

    const q = await User.findOne({ _id: user._id }, { password: 0 })

    res.status(200).json({ status: 'success', msg: 'Signed Up Successfully', data: q })
})

exports.login = catchAsync (async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(401).json({ status: "error", msg: "Email and/or password is invalid" })

    const user = await User.findOne({ email })

    if (!user) return res.status(401).json({ status: "error", msg: "Email and/or password is invalid" })

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ status: 'error', msg: "Email and/or passsword is invalid" })
 
    const payload = { userId: user._id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })

    req.session.token = token;

    const q = await User.findOne({ _id: user._id }, { password: 0 });

    res.status(200).json({ status: 'success', msg: "Logged in successully", data: q })
})

exports.index = catchAsync( async (req, res) => {

    res.status(200).json({ status: 'success', msg: 'Index' })
})
