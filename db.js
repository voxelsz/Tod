const mongoose = require('mongoose');

// Koneksi ke MongoDB
const mongoURI = "mongodb+srv://voxelspro:vUqjFr9P4XjUhDkv@cluster0.o2wjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("[DB] Terhubung ke MongoDB");
}).catch((error) => {
  console.error("[DB] Gagal terhubung ke MongoDB:", error.message);
});

// Definisi skema
const NumberSchema = new mongoose.Schema({
  nomor: { type: String, unique: true, required: true },
});

// Model
const NumberModel = mongoose.model('Number', NumberSchema);

module.exports = { mongoose, NumberModel };
