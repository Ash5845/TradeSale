const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
  });
  
  ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
  });
  
const opts = { toJSON: { virtuals: true } };

const CarSchema = new Schema(
    {
        title: String,
        make: String,
        model: String,
        date: String,
        images: [ImageSchema],
        geometry: {
          type: {
            type: String,
            enum: ["Point"],
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
        year: Number,
        price: Number,
        description: String,
        location: String,
        mileage: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
    },
    opts
);

CarSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

module.exports = mongoose.model("Car", CarSchema);