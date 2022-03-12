const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await User.create({
            username,
            password: hashPassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.signIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (isCorrectPassword) {
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            });
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Incorrect username or password'
            });
        }
    } catch (e) {
        console.log('vik err', e);
        res.status(400).json({
            status: 'fail'
        })
    }
}