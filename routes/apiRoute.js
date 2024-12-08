const express = require('express');
const router = express.Router();
const { NumberModel } = require('../db');

// Endpoint untuk menambahkan nomor
router.post('/add', async (req, res) => {
  const { nomor } = req.body;

  if (!nomor) {
    return res.status(400).json({ success: false, message: 'Nomor harus disertakan!' });
  }

  try {
    const existingNumber = await NumberModel.findOne({ nomor });
    if (existingNumber) {
      return res.status(400).json({ success: false, message: 'Nomor sudah ada!' });
    }

    const newNumber = new NumberModel({ nomor });
    await newNumber.save();

    res.status(200).json({ success: true, message: 'Nomor berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server!', error });
  }
});

// Endpoint untuk menghapus nomor
router.delete('/delete', async (req, res) => {
  const { nomor } = req.body;

  if (!nomor) {
    return res.status(400).json({ success: false, message: 'Nomor harus disertakan!' });
  }

  try {
    const existingNumber = await NumberModel.findOne({ nomor });
    if (!existingNumber) {
      return res.status(400).json({ success: false, message: 'Nomor tidak ditemukan!' });
    }

    await NumberModel.deleteOne({ nomor });
    res.status(200).json({ success: true, message: 'Nomor berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server!', error });
  }
});

// Endpoint untuk mendapatkan daftar nomor
router.get('/list', async (req, res) => {
  try {
    const numbers = await NumberModel.find({});
    res.status(200).json({ success: true, numbers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server!' });
  }
});

module.exports = router;
