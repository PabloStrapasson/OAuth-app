require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require("../models/user")

exports.showIndex = (req, res, next) => {
    res.render('index')
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne(email, password)
    console.log(user)
    try {
        if(user) {
            req.session.user = user
            res.redirect('/members')
        } else {
            res.render('index')
        }
    } catch(err) {
        console.log(err)
        res.render('index')
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err)
        }
        res.redirect('/')
    })
}

exports.showPageSignUp = (req, res, next) => {
    res.render('signup')
}

exports.signUp = async (req, res, next) => {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, process.env.HASH_SALT || 10)
    const user = new User(username, email, hashedPassword)
    try {
        await user.save()
        res.redirect('/')
    } catch(err) {
        console.log(err)
        res.redirect('signuop')
    }
}

exports.showMembersPage = (req, res) => {
    res.render('members')
}

exports.get404Page = (req, res, next) => {
    res.status(404).render('404')
}

exports.checkAuth = (req, res, next) => {
    if(req.session && req.session.user || req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}