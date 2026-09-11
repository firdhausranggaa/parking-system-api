const Parking = require('../models/Parking');

exports.kendaraanMasuk = async (req, res) => {
    try {
        const { platNomor } = req.body;
        const parkirBaru = new Parking({
            userId: req.userId,
            platNomor
        });

        await parkirBaru.save();

        res.status(201).json({
            message: 'Kendaraan berhasil masuk',
            data: parkirBaru
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.kendaraanKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        const parkir = await Parking.findById(id);

        if (!parkir || parkir.status === 'OUT') {
            return res.status(404).json({ message: 'Data parkir tidak ditemukan atau kendaraan sudah keluar' });
        }

        parkir.waktuKeluar = Date.now();
        parkir.status = 'OUT';

        const durasiMs = new Date(parkir.waktuKeluar).getTime() - new Date(parkir.waktuMasuk).getTime();
        const durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60));

        const tarifPerJam = 5000;
        parkir.biaya = durasiJam * tarifPerJam || tarifPerJam;

        await parkir.save();

        res.status(200).json({
            message: 'Kendaraan berhasil keluar',
            data: parkir
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.lihatSemuaParkir = async (req, res) => {
    try {
        const { status, sortBy = 'waktuMasuk', order = 'desc', page = 1, limit = 10 } = req.query;

        const filter = { userId: req.userId };
        if (status) filter.status = status.trim().toUpperCase();

        const limitNum = parseInt(limit, 10);
        const skip = (parseInt(page, 10) - 1) * limitNum;

        const dataParkir = await Parking.find(filter)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(limitNum)
            .populate('userId', 'name email -_id');

        const totalData = await Parking.countDocuments(filter);

        res.json({
            totalData,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalData / limitNum),
            data: dataParkir
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.hapusDataParkir = async (req, res) => {
    try {
        const parkir = await Parking.findById(req.params.id);
        if (!parkir) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        await parkir.deleteOne();
        res.json({ message: 'Data parkir berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};