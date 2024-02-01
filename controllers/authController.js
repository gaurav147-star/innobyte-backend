const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();


const userEmail = process.env.EMAIL;
const userpassword = process.env.PASS;
const jwtSecret = process.env.JWT_SECRET;
// Function to send confirmation email

console.log(userEmail,userpassword);
const sendConfirmationEmail = (req, res, user) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: userEmail,
      pass: userpassword,
    },
  });

  const mailOptions = {
    from: '"Verify your email" <userEmail>',
    to: user.email,
    subject: "Account Confirmation",
    text: "Thank you for registering. Please click on the following link to confirm your email.",
    html: `<a href="http://${req.headers.host}/api/verify-email?token=${user.emailToken}">Click here to confirm your email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending confirmation email:", error);
    } else {
      console.log("Confirmation email sent:", info.response);
    }
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validate input (you might want to add more validations)
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(20).toString("hex"),
      isVerified: false,
    });

    sendConfirmationEmail(req, res, user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Find user in the database
    const user = await User.findOne({ email });

    // Check if the user exists and validate password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.emailVerification = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by email token
    const user = await User.findOne({ emailToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid token or user not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
