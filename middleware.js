const {carSchema} = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Car = require("./models/car");

module.exports.validateCar = (req, res, next) => {
    const {error} = carSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in to do that");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const car = await Car.findById(id);
    car.author = req.user._id;
    if(!car.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/cars/${id}`);
    }
    next();
}
