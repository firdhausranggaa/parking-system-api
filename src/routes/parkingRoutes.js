const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { validateParkingIn } = require('../middleware/validator');

router.post('/in', validateParkingIn, parkingController.kendaraanMasuk);
router.put('/out/:id', parkingController.kendaraanKeluar);
router.get('/', parkingController.lihatSemuaParkir);
router.delete('/:id', parkingController.hapusDataParkir);

module.exports = router;