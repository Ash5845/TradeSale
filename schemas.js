const Joi = require("joi");

module.exports.carSchema = Joi.object({
    car: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        date: Joi.string(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        mileage: Joi.number().required().min(0),
        year: Joi.number().required().min(0)
    }).required(),
    deleteImages: Joi.array()
});