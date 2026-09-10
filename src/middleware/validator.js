const Joi = require('joi');

const validateParkingIn = (req, res, next) => {
    const schema = Joi.object({
        platNomor: Joi.string().trim().min(3).max(11)
            .pattern(/^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/)
            .required()
            .messages({
                'string.pattern.base': 'Format plat nomor tidak valid (Contoh: B 1234 CD)',
                'any.required': 'Plat nomor wajib diisi'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateParkingIn };