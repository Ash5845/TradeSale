const Car = require("../models/car");
const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary}  = require("../cloudinary");
const {today} = require("../utils/date")

module.exports.index = async (req, res) => {
    const cars = await Car.find({}).sort('-date').find().limit(20);
    res.render("cars/index", {cars});
}

module.exports.searchIndex = async (req, res) => {
    const {searchQuery} = req.body;
    const cars = await Car.find({ "title": {$regex: searchQuery, $options: "i"}}).sort('-date').find();
    res.render("cars/searchIndex", {cars, searchQuery});
}

module.exports.myAds = async (req, res) => {
    const user = req.user._id;
    const cars = await Car.find({"author": user});
    res.render("cars/myAds", {cars});
}

module.exports.createCar = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.car.location,
        limit: 1
    }).send()
    const car = new Car(req.body.car);
    car.geometry = geoData.body.features[0].geometry;
    car.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.author = req.user._id;
    car.title = `${car.year} ${car.make} ${car.model}`;
    car.date = today;
    await car.save();
    req.flash('success', 'Successfully posted a new advert!');
    res.redirect(`cars/${car._id}`);
}

module.exports.renderNewForm = (req, res) => {
    res.render("cars/new")
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const car = await Car.findById(id);
    res.render("cars/edit", {car});
}

module.exports.updateCar = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.car.location,
        limit: 1
    }).send()
    const {id} = req.params;
    const car = await Car.findByIdAndUpdate(id, {...req.body.car});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    car.images.push(...imgs);
    car.geometry = geoData.body.features[0].geometry;
    car.title = `${req.body.car.year} ${req.body.car.make} ${req.body.car.model}`;
    await car.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await car.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/cars/${id}`)
}

module.exports.showCar = async (req, res) => {
    const car = await Car.findById(req.params.id);
    const author = car.author;
    const user = await User.findById(author);
    res.render("cars/show", {car, user});
}

module.exports.deleteCar = async(req, res) => {
    const {id} = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (car.images.length) {
        for (let img of car.images){
            const filename = img.filename;
            await cloudinary.uploader.destroy(filename);
        }
    }
    res.redirect("/cars");
}