const mongoose = require("mongoose");
const cities = require("./cities");
const cars = require("./seedHelpers");
const Car = require("../models/car");
const {today} = require("../utils/date")

mongoose.connect("mongodb://localhost:27017/tradesale", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Car.deleteMany({});
    for(let i=0; i<300; i++){
        const author = "601a8a2ef7e3b34ae8671432";
        const random50 = Math.floor(Math.random() * 50);
        const random1000 = Math.floor(Math.random() * 1000);
        const year = Math.floor(Math.random() * 10) + 2010;
        const price = Math.floor(Math.random() * 40000) + 1000;
        const mileage = Math.floor(Math.random() * 100000) + 1000;
        const date = today;
        const car = new Car({
            author,
            location: `${cities[random50].city}, ${cities[random50].country}`,
            title: `${year} ${cars[random1000].Make} ${cars[random1000].Model}`,
            make: cars[random1000].Make,
            model: cars[random1000].Model,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas rem perspiciatis corporis, impedit itaque quaerat nostrum blanditiis nihil, ipsam obcaecati praesentium aliquid explicabo. Necessitatibus, corrupti! Deserunt veritatis sunt minus atque Vel ipsam suscipit, accusamus consequatur voluptatum totam officiis excepturi, error hic eveniet dolore impedit nostrum voluptatibus natus autem sunt harum, amet similique iusto voluptates quae facere! Repellendus quam eligendi enim Nostrum odit, voluptatum ratione velit unde est dolores dolorem ab sequi ea, eaque nihil saepe beatae magnam reprehenderit, possimus temporibus ipsum sed accusantium quaerat expedita laudantium.",
            price,
            year,
            mileage,
            date,
            geometry:{
              type: 'Point',
              coordinates: [
                cities[random50].lng,
                cities[random50].lat,
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dwu1xeqb1/image/upload/v1612205194/TradeSale/hdMSxGizchk-unsplash_xwxss9.jpg',
                  filename: 'TradeSale/hdMSxGizchk-unsplash_xwxss9'
                },
              ]
        })
        await car.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close()
});