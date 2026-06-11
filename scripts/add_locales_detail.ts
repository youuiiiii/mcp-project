import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const keysEn = {
  "common.back": "Back",

  "incident.alert.loginRequired.title": "Login Required",
  "incident.alert.loginRequired.message": "Please log in to report content.",
  "incident.alert.reasonRequired.title": "Reason Required",
  "incident.alert.reasonRequired.message": "Select a reason to report this content.",
  "incident.alert.invalidIdentity.title": "Invalid Identity",
  "incident.alert.invalidIdentity.message": "Your account is not valid.",
  "incident.alert.reportSubmitted.title": "Report Submitted",
  "incident.alert.reportSubmitted.message": "Thank you. This report will be reviewed by our team.",
  "incident.alert.reportFailed.title": "Failed to Report Content",
  "incident.alert.reportFailed.message": "An error occurred while submitting the content report.",
  
  "incident.loading": "Loading incident...",
  "incident.unavailable.title": "Incident unavailable",
  "incident.unavailable.desc": "This incident could not be loaded.",
  "incident.defaultTitle": "Incident",
  
  "incident.meta.severity": "{severity} Severity",
  "incident.meta.reports": "{count} Reports",
  "incident.meta.responders": "{count} Responders",
  "incident.meta.reportedAt": "Reported {time} - {date}",
  "incident.meta.noDescription": "No extra description was provided.",
  
  "incident.action.verify": "Verify & Update Condition",
  "incident.action.markResolved": "Mark as Resolved (Admin)",
  "incident.action.reportFalse": "Report as false or inappropriate",
  
  "incident.section.updates": "Community Updates",
  "incident.accuracy.disabledReason": "Your report has been counted. Nearby users can confirm if the incident is still active.",
};

const keysId = {
  "common.back": "Kembali",

  "incident.alert.loginRequired.title": "Wajib Login",
  "incident.alert.loginRequired.message": "Silakan login untuk melaporkan konten.",
  "incident.alert.reasonRequired.title": "Alasan Diperlukan",
  "incident.alert.reasonRequired.message": "Pilih alasan untuk melaporkan konten ini.",
  "incident.alert.invalidIdentity.title": "Identitas Tidak Valid",
  "incident.alert.invalidIdentity.message": "Akun Anda tidak valid.",
  "incident.alert.reportSubmitted.title": "Laporan Terkirim",
  "incident.alert.reportSubmitted.message": "Terima kasih. Laporan ini akan ditinjau oleh tim kami.",
  "incident.alert.reportFailed.title": "Gagal Melaporkan Konten",
  "incident.alert.reportFailed.message": "Terjadi kesalahan saat mengirim laporan konten.",

  "incident.loading": "Memuat insiden...",
  "incident.unavailable.title": "Insiden tidak tersedia",
  "incident.unavailable.desc": "Insiden ini tidak dapat dimuat.",
  "incident.defaultTitle": "Insiden",

  "incident.meta.severity": "Tingkat Keparahan {severity}",
  "incident.meta.reports": "{count} Laporan",
  "incident.meta.responders": "{count} Responden",
  "incident.meta.reportedAt": "Dilaporkan {time} - {date}",
  "incident.meta.noDescription": "Tidak ada deskripsi tambahan yang diberikan.",

  "incident.action.verify": "Verifikasi & Update Kondisi",
  "incident.action.markResolved": "Tandai Selesai (Admin)",
  "incident.action.reportFalse": "Laporkan sebagai palsu atau tidak pantas",

  "incident.section.updates": "Pembaruan Komunitas",
  "incident.accuracy.disabledReason": "Laporan Anda telah dihitung. Pengguna terdekat dapat mengonfirmasi apakah insiden masih aktif.",
};

function appendLocales(filePath: string, keys: Record<string, string>) {
  let content = fs.readFileSync(filePath, "utf-8");
  const lastBraceIndex = content.lastIndexOf("}");
  
  if (lastBraceIndex === -1) {
    console.error("Could not find closing brace in", filePath);
    return;
  }
  
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
