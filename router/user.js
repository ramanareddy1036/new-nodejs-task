const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const Balanced = require('../model/balanced');
const { ObjectID } = require('mongodb');

const authenticate = require('../middleware/auth')


router.get('/', (req, res) => {
    res.write("user data");
    res.end();
});

//route for registration for the user
router.post('/users/registration', async (req, res) => {
    console.log('users registration');

    const user = new User(req.body);
    try {
        // check the user already registerd or not
        const checkUser = await User.findOne({ 'email': user.email });
        if (!checkUser) {
            const token = await user.newAuthToken()
            console.log(token, user);
            res.status(200).send({ user, token })
        } else {
            res.status(400).send({
                message: 'user already registred with this email'
            });
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

// route for get all users which are prasents in users
router.get('/users/list', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({
            'message': 'succuessfully fetched usersList',
            'users': users
        });
    } catch (error) {
        res.status(400).send({
            'message': 'error while grtting usersList'
        })
    }
});

// route can be used to delete perticular user 
router.delete('/users/delete', authenticate, async (req, res) => {
    try {
        await User.remove({ _id: mongoose.Types.ObjectId(req.user._id) });
        res.status(200).send({
            status: 'sucess',
            message: 'deleted successfully'
        })
    } catch (error) {
        res.status(400).send({
            message: 'error while deleting user'
        })
    }
});


// route for user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.checkValidCredentials(req.body.email, req.body.password)
        // console.log(user);
        const token = await user.newAuthToken()
        res.status(200).send(
            {
                token: user.tokens[0].token,
                message: "success"
            }
        )
    } catch (error) {
        res.status(400).send({
            message: 'email or password mismatch'
        })
    }
});


// router for user logout
router.post('/users/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send({
            'message': 'LoggedOut SuccessFully'
        });
    } catch (error) {
        res.status(400).send({
            message: 'error while logout'
        })
    }
})


router.post('/users/logoutall', authenticate, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.status(200).send({
            'message': 'LoggedOut SuccessFully'
        });
    } catch (error) {
        res.status(400).send({
            message: 'error while loggedout all'
        });
    }
});

//route for balanced peranthisis 
router.post('/users/balanced', authenticate, async (req, res) => {
    try {
        const balanced = IsValid(req.body.paranthisis);
        if (balanced) {
            const balancedUser = await Balanced.find({ 'userId': mongoose.Types.ObjectId(req.user._id) });
            balancedUser.attempts = balancedUser.length > 0 ? balancedUser[0].attempts : 0;
            const balancedUpdate = await Balanced.findOneAndUpdate({ userId: req.user._id, username: req.user.name },
                                                        { $set: { attempts: balancedUser.attempts + 1 } }, 
                                                        { upsert: true, new: true });
            res.status(200).send({
                status: 'balanced',
                message : 'success',
                attempts : balancedUpdate.attempts

            })
        } else {
            res.status(400).send({
                status: 'unbalanced'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }

})

IsValid = text => {
    let leftBraces = [];
    let RightBrace = c => {
        switch (c) {
            case ')': case '}': case ']':
                return true;
            case '(': case '{': case '[':
                leftBraces.push(c);
            default:
                return false;
        }
    };

    for (let i = 0; i < text.length; i++) {
        let e = text[i];

        if (RightBrace(e) && !Match(leftBraces.pop() + e))
            return false;
    }

    return leftBraces.length === 0;
}

function Match(t) {
    switch (t) {
        case '()': case '{}': case '[]':
            return true;
        default:
            return false;
    }
}

module.exports = router