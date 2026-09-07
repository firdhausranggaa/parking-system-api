const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platNomor: { type: String, required: true },
    waktuMasuk: { type: Date, default: Date.now },
    waktuKeluar: { type: Date },
    biaya: { type: Number, default: 0 },
    status: { type: String, enum: ['IN', 'OUT'], default: 'IN' }
});

module.exports = mongoose.model('Parking', parkingSchema);