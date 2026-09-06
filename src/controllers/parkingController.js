const Parking = require('../models/Parking');

// Fungsi Kendaraan Masuk
exports.kendaraanMasuk = async (req, res) => {
    try {
        const { platNomor } = req.body;
        const parkirBaru = new Parking({ platNomor });
        await parkirBaru.save();

        res.status(201).json({
            message: 'Kendaraan berhasil masuk',
            data: parkirBaru
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Kendaraan Keluar
exports.kendaraanKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        const parkir = await Parking.findById(id);

        if (!parkir || parkir.status === 'OUT') {
            return res.status(404).json({ message: 'Data parkir tidak ditemukan atau kendaraan sudah keluar' });
        }

        parkir.waktuKeluar = Date.now();
        parkir.status = 'OUT';

        // Kalkulasi durasi (dalam milidetik dikonversi ke jam)
        const durasiMs = new Date(parkir.waktuKeluar).getTime() - new Date(parkir.waktuMasuk).getTime();
        const durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60)); // pembulatan ke atas untuk jam

        const tarifPerJam = 5000;
        parkir.biaya = durasiJam * tarifPerJam || tarifPerJam; // Jika kurang dari 1 jam, tetap bayar 1 jam

        await parkir.save();

        res.status(200).json({
            message: 'Kendaraan berhasil keluar',
            data: parkir
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Read All: Melihat semua data parkir
exports.lihatSemuaParkir = async (req, res) => {
    try {
        const dataParkir = await Parking.find();
        res.json(dataParkir);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Delete: Menghapus data parkir berdasarkan ID
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