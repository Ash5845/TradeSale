const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to TradeSale!");
            res.redirect("/cars")
        })
        } catch(e){
            req.flash("error", e.message);
            res.redirect("/register");
        }
    }

module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!")
    const redirectUrl = req.session.returnTo || "/cars";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    console.log(req.user)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/cars")
}