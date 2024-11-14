const { hashPassword, conformPassword } = require('../helper/authHelper');
const User = require('../models/userSchema');
const JWT = require('jsonwebtoken')

exports.UserController = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        // Check if user already exists
        const preuser = await User.findOne({ email });

        if (preuser) {
            return res.status(200).json({
                success: false,
                message: 'User already exists',
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword, 
            address,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message,
        });
    }
};


// for Login 

exports.loginController = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
           return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const comparePassword = await conformPassword(password, user.password)

        if(!comparePassword) {
           return res.status(409).json({
                success: false,
                message: 'Password not matched !'
            })
        }

        // for token

            const token = JWT.sign({_id:user._id}, process.env.JWT_SCRETS, {expiresIn: "1d"})

            res.status(201).json({
                success: true,
                message: 'Login successfull',
                user: {
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    role: user.role
                },
                token
            })

    } catch (error) {
       return res.status(400).json({
            success: false,
            message: 'Login failed !'
        })
    }
}

// for check user is exit or not 

exports.checkUser = async (req, res) => {
    const {email} = req.body;

    try {
        const isuser = await User.findOne({email});

        if(isuser) {
           return res.status(200).json({success: true, message: 'user is already exits'})
        }
        else{
           return res.status(201).json({success: false})
        }
    } catch (error) {
        console.log(error);
        
    }
}