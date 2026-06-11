import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const keysEn = {
  "incident.feedback.verifying.title": "Verifying location",
  "incident.feedback.verifying.desc": "Please wait, we are checking that you are near this report.",
  "incident.feedback.success.title": "Location Verified",
  "incident.feedback.success.desc": "Thank you, your location check has been updated.",
  "incident.feedback.no_permission.title": "Location Not Allowed",
  "incident.feedback.no_permission.desc": "Enable location permissions to confirm this report.",
  "incident.feedback.location_off.title": "Location Turned Off",
  "incident.feedback.location_off.desc": "Turn on device location to confirm this report.",
  "incident.feedback.too_far.title": "Too Far",
  "incident.feedback.too_far.desc": "You are too far from the report location to confirm it.",
  "incident.feedback.error.title": "Check Failed"
};

const keysId = {
  "incident.feedback.verifying.title": "Memeriksa lokasi",
  "incident.feedback.verifying.desc": "Sebentar, kami sedang memeriksa bahwa kamu berada dekat laporan ini.",
  "incident.feedback.success.title": "Lokasi Terverifikasi",
  "incident.feedback.success.desc": "Terima kasih, pengecekan lokasi kamu sudah diperbarui.",
  "incident.feedback.no_permission.title": "Lokasi tidak diizinkan",
  "incident.feedback.no_permission.desc": "Aktifkan izin lokasi untuk mengonfirmasi laporan ini.",
  "incident.feedback.location_off.title": "Lokasi dimatikan",
  "incident.feedback.location_off.desc": "Aktifkan lokasi perangkat untuk mengonfirmasi laporan ini.",
  "incident.feedback.too_far.title": "Terlalu Jauh",
  "incident.feedback.too_far.desc": "Kamu terlalu jauh dari lokasi laporan untuk mengonfirmasinya.",
  "incident.feedback.error.title": "Pengecekan Gagal"
};

function appendLocales(filePath: string, keys: Record<string, string>) {
  let content = fs.readFileSync(filePath, "utf-8");
  const lastBraceIndex = content.lastIndexOf("}");
  
  let newEntries = "";
  for (const [k, v] of Object.entries(keys)) {
    if (content.includes(`"${k}"`)) continue;
    newEntries += `  "${k}": "${v}",\n`;
  }
  
  if (newEntries === "") return;
  
  const newContent = content.slice(0, lastBraceIndex) + newEntries + content.slice(lastBraceIndex);
  fs.writeFileSync(filePath, newContent);
  console.log(`Updated ${filePath}`);
}

appendLocales(EN_FILE, keysEn);
appendLocales(ID_FILE, keysId);
