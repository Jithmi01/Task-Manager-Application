const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register User
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, nameWithInitials, email, password, phoneNumber, gender, experience, skills, portfolioURL, linkedinURL } = req.body;
        const profilePicture = req.files?.profilePicture;

        if (!firstName || !lastName || !nameWithInitials || !email || !password || !phoneNumber || !gender || !experience || !skills) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const skillsArray = skills.split(',').map(skill => skill.trim());

        let profilePictureData;
        if (profilePicture) {
            profilePictureData = {
                data: profilePicture.data,
                contentType: profilePicture.mimetype
            };
        }

        const newUser = new User({
            firstName,
            lastName,
            nameWithInitials,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            experience,
            skills: skillsArray,
            portfolioURL,
            linkedinURL,
            profilePicture: profilePictureData
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Remove password before sending response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json({ 
            token,
            user: userWithoutPassword
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};