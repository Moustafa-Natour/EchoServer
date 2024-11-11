const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Save User (Register)
module.exports.saveUser = async (req, res) => {
    const { email, password } = req.body; // Ensure you have these fields in your request body
    if (email && password) {
        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ email, password: hashedPassword });
            const savedUser = await newUser.save();
            console.log("Saved Successfully ", savedUser);
            res.status(201).send(savedUser);
        } catch (err) {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong!" });
        }
    } else {
        res.status(400).send({ msg: "email and password are required." });
    }
};

// Login User
module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (user) {
            // Check if the password matches
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

            // Send the token to the client (store in localStorage)
            return res.json({ token });
        } else {
            return res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get Users
module.exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Something went wrong!" });
    }
};

// Update User
module.exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { User } = req.body;
    UserModel.findByIdAndUpdate(id, { User })
        .then(() => {
            res.send("Updated successfully");
        })
        .catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong!" });
        });
};

// Delete User
module.exports.deleteUser = (req, res) => {
    const { id } = req.params;
    UserModel.findByIdAndDelete(id)
        .then(() => {
            res.send("Deleted successfully");
        })
        .catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong!" });
        });
};
