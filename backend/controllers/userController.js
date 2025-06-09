import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// === Token Generator ===
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days
  });
};

// === Login User ===
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === Register User (Express) ===
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.status(200).json({ user, token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === Get User Info ===
const getUser = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await userModel.findById(id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

// === Register New User (Reusable Logic for OAuth) ===
const registerNewUser = async ({ name, email, password }) => {
    console.log("Hello")
    try{

        if (!name || !email || !password) {
            throw new Error("Please enter all fields");
        }
        
        if (!validator.isEmail(email)) {
            throw new Error("Please enter a valid email");
        }
        
        if (!validator.isStrongPassword(password)) {
            throw new Error("Please enter a strong password");
        }
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            throw new Error("User already exists");
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        
        res.status(200).json({ user ,token});
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  getUser,
  registerNewUser,
  createToken,
};
