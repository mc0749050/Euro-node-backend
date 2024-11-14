const User = require('../models/userSchema');

exports.changeNameApi = async (req, res) => {
    const {name, email} = req.body;
    
    try {
        const user = await User.findOneAndUpdate({email}, { $set: {name: name}}, {new: true})
    
        if(user) {
           return res.status(202).json({success: true, message: 'Name change successfully !'})
        }
        else{
           return res.status(404).json({success:false, message: 'Something went wrong !'})
        }
        
    } catch (error) {
        return res.status(400).json({success:false, message:'Try after some time !'})
    }
}


exports.changePhoneApi = async (req, res) => {
    const {phone, email} = req.body;
    
    try {
        const user = await User.findOneAndUpdate({email}, { $set: {'address.phone': phone}}, {new: true})
    
        if(user) {
           return res.status(202).json({success: true, message: 'Phone change successfully !'})
        }
        else{
           return res.status(404).json({success:false, message: 'Something went wrong !'})
        }
        
    } catch (error) {
        return res.status(400).json({success:false, message:'Try after some time !'})
    }
}

exports.changeAddressApi = async (req, res) => {
    const {street, city, state, country, zipcode, email} = req.body;
    
    try {
        const user = await User.findOneAndUpdate({email}, 
            { $set: {'address.street': street,
                     'address.city': city,
                     'address.state': state,
                     'address.country': country,
                     'address.zipcode': zipcode
        }}, {new: true})
    
        if(user) {
           return res.status(202).json({success: true, message: 'Address change successfully !'})
        }
        else{
           return res.status(400).json({success:false, message: 'Something went wrong !'})
        }
        
    } catch (error) {
        return res.status(400).json({success:false, message:'Try after some time !'})
    }
}

// get user data get Api end-point

exports.getUserData = async (req, res) => {
    const {email} = req.query;

    try {
        const userdata = await User.findOne({email});

        if(userdata) {
           return res.status(200).json({success: true, message: 'User data get successfull !', userdata})
        }
    
        return res.status(404).json({success: false, message: 'not get user data'})   
    } catch (error) {
        return res.status(400).json({success:false, message:'Try after some time !'})   
    }
}