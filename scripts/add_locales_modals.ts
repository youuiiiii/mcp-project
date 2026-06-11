import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const keysEn = {
  "incident.replyComposer.defaultTarget": "this comment",
  "incident.replyComposer.replyingLabel": "Replying",
  "incident.replyComposer.placeholderReply": "Write a reply...",
  "incident.replyComposer.placeholderComment": "Add context or a short comment...",

  "incident.verify.title": "Incident Verification",
  "incident.verify.subtitle": "Help the community by confirming or updating the condition of this incident.",
  "incident.verify.submit": "Submit Verification",
  "incident.verify.typeTitle": "Verification Type",
  "incident.verify.typeSubtitle": "Choose whether you are confirming, disputing, or updating the incident.",
  "incident.verify.conditionTitle": "Current Condition",
  "incident.verify.conditionSubtitle": "Select the condition that best matches the situation on the ground.",
  "incident.verify.photoTitle": "Recent Evidence Photo",
  "incident.verify.photoSubtitle": "A photo is required as evidence of the current condition.",
  "incident.verify.photoEmpty": "No photo added",
  "incident.verify.photoEmptyDesc": "Add a photo to support your verification.",
  "incident.verify.notesTitle": "Condition Notes",
  "incident.verify.notesSubtitle": "Write a brief note about the condition you observe at the location.",
  "incident.verify.notesPlaceholder": "Example: Road is still blocked, one lane is passable.",
  "incident.verify.notesSufficient": "Notes are sufficient",
  "incident.verify.notesMin": "Minimum 8 characters",

  "thread.verification.opt.valid.label": "Confirm",
  "thread.verification.opt.valid.desc": "I can see this incident is real and accurate.",
  "thread.verification.opt.update.label": "Update Condition",
  "thread.verification.opt.update.desc": "The incident exists, but the condition needs updating.",
  "thread.verification.opt.invalid.label": "Inaccurate",
  "thread.verification.opt.invalid.desc": "I could not find the incident as reported.",

  "thread.condition.opt.still_happening.label": "Still Happening",
  "thread.condition.opt.still_happening.desc": "The incident is still ongoing at this location.",
  "thread.condition.opt.getting_worse.label": "Getting Worse",
  "thread.condition.opt.getting_worse.desc": "The condition appears to be worsening.",
  "thread.condition.opt.partially_resolved.label": "Improving",
  "thread.condition.opt.partially_resolved.desc": "The condition is improving but not fully resolved.",
  "thread.condition.opt.resolved.label": "Appears Resolved",
  "thread.condition.opt.resolved.desc": "The incident appears to be fully resolved.",
  "thread.condition.opt.not_found.label": "Not Found",
  "thread.condition.opt.not_found.desc": "No incident is visible around this location.",

  "incident.resolve.title": "Mark Resolved",
  "incident.resolve.subtitle": "Upload evidence and notes before closing this report.",
  "incident.resolve.submit": "Mark Resolved",
  "incident.resolve.notice": "The photo must show that the location is safe, clear, or no longer disrupting activity.",
  "incident.resolve.photoTitle": "Resolution Evidence Photo",
  "incident.resolve.photoSubtitle": "Upload a recent photo as evidence that the incident is resolved.",
  "incident.resolve.photoEmpty": "No photo added",
  "incident.resolve.photoEmptyDesc": "Add a photo as evidence of the current condition at the location.",
  "incident.resolve.notesTitle": "Resolution Notes",
  "incident.resolve.notesSubtitle": "Explain why this report can be marked as resolved.",
  "incident.resolve.notesPlaceholder": "Example: The road has been cleared and vehicles can pass.",
  "incident.resolve.notesSufficient": "Notes are sufficient",
  "incident.resolve.notesMin": "Minimum 10 characters",

  "incident.report.title": "Report Content",
  "incident.report.subtitle": "Help keep community reports accurate and relevant.",
  "incident.report.notePlaceholder": "Add a brief note, optional...",
  "incident.report.reason.falseInfo": "False Information",
  "incident.report.reason.falseInfoDesc": "The report looks fake, mislocated, or misleading.",
  "incident.report.reason.harmful": "Harmful Content",
  "incident.report.reason.harmfulDesc": "This content may cause panic, violence, or other negative impacts.",
  "incident.report.reason.spam": "Spam",
  "incident.report.reason.spamDesc": "Repeated, irrelevant, or promotional content.",
  "incident.report.reason.privacy": "Privacy Issue",
  "incident.report.reason.privacyDesc": "Contains personal data, sensitive addresses, or someone's identity.",
  "incident.report.reason.image": "Inappropriate Image",
  "incident.report.reason.imageDesc": "The photo contains sensitive or inappropriate content.",
  "incident.report.reason.other": "Other",
  "incident.report.reason.otherDesc": "Other reasons that need to be reviewed."
};

const keysId = {
  "incident.replyComposer.defaultTarget": "komentar ini",
  "incident.replyComposer.replyingLabel": "Membalas",
  "incident.replyComposer.placeholderReply": "Tulis balasan...",
  "incident.replyComposer.placeholderComment": "Tambahkan konteks atau komentar singkat...",

  "incident.verify.title": "Verifikasi Insiden",
  "incident.verify.subtitle": "Bantu komunitas dengan mengonfirmasi atau memperbarui kondisi insiden ini.",
  "incident.verify.submit": "Kirim Verifikasi",
  "incident.verify.typeTitle": "Jenis Verifikasi",
  "incident.verify.typeSubtitle": "Pilih apakah Anda mengonfirmasi, membantah, atau memperbarui insiden.",
  "incident.verify.conditionTitle": "Kondisi Saat Ini",
  "incident.verify.conditionSubtitle": "Pilih kondisi yang paling sesuai dengan situasi di lapangan.",
  "incident.verify.photoTitle": "Foto Bukti Terbaru",
  "incident.verify.photoSubtitle": "Foto diperlukan sebagai bukti kondisi saat ini.",
  "incident.verify.photoEmpty": "Belum ada foto",
  "incident.verify.photoEmptyDesc": "Tambahkan foto untuk mendukung verifikasi Anda.",
  "incident.verify.notesTitle": "Catatan Kondisi",
  "incident.verify.notesSubtitle": "Tulis catatan singkat tentang kondisi yang Anda lihat di lokasi.",
  "incident.verify.notesPlaceholder": "Contoh: Jalan masih tertutup, satu jalur bisa dilewati.",
  "incident.verify.notesSufficient": "Catatan sudah cukup",
  "incident.verify.notesMin": "Minimal 8 karakter",

  "thread.verification.opt.valid.label": "Konfirmasi",
  "thread.verification.opt.valid.desc": "Saya bisa melihat insiden ini nyata dan akurat.",
  "thread.verification.opt.update.label": "Perbarui Kondisi",
  "thread.verification.opt.update.desc": "Insiden ada, tetapi kondisinya perlu diperbarui.",
  "thread.verification.opt.invalid.label": "Tidak Akurat",
  "thread.verification.opt.invalid.desc": "Saya tidak dapat menemukan insiden seperti yang dilaporkan.",

  "thread.condition.opt.still_happening.label": "Masih Terjadi",
  "thread.condition.opt.still_happening.desc": "Insiden masih berlangsung di lokasi ini.",
  "thread.condition.opt.getting_worse.label": "Semakin Parah",
  "thread.condition.opt.getting_worse.desc": "Kondisi tampak memburuk.",
  "thread.condition.opt.partially_resolved.label": "Membaik",
  "thread.condition.opt.partially_resolved.desc": "Kondisi membaik tetapi belum sepenuhnya selesai.",
  "thread.condition.opt.resolved.label": "Tampak Selesai",
  "thread.condition.opt.resolved.desc": "Insiden tampaknya sudah sepenuhnya selesai.",
  "thread.condition.opt.not_found.label": "Tidak Ditemukan",
  "thread.condition.opt.not_found.desc": "Tidak ada insiden yang terlihat di sekitar lokasi ini.",

  "incident.resolve.title": "Tandai Selesai",
  "incident.resolve.subtitle": "Unggah bukti dan catatan sebelum menutup laporan ini.",
  "incident.resolve.submit": "Tandai Selesai",
  "incident.resolve.notice": "Foto harus menunjukkan bahwa lokasi sudah aman, bersih, atau tidak lagi mengganggu aktivitas sekitar.",
  "incident.resolve.photoTitle": "Foto Bukti Penyelesaian",
  "incident.resolve.photoSubtitle": "Unggah foto terbaru sebagai bukti bahwa insiden sudah selesai.",
  "incident.resolve.photoEmpty": "Belum ada foto",
  "incident.resolve.photoEmptyDesc": "Tambahkan foto sebagai bukti kondisi terkini di lokasi.",
  "incident.resolve.notesTitle": "Catatan Penyelesaian",
  "incident.resolve.notesSubtitle": "Jelaskan mengapa laporan ini bisa ditandai selesai.",
  "incident.resolve.notesPlaceholder": "Contoh: Jalan sudah dibersihkan dan kendaraan bisa melintas.",
  "incident.resolve.notesSufficient": "Catatan sudah cukup",
  "incident.resolve.notesMin": "Minimal 10 karakter",

  "incident.report.title": "Laporkan Konten",
  "incident.report.subtitle": "Bantu menjaga laporan komunitas tetap akurat dan relevan.",
  "incident.report.notePlaceholder": "Tambahkan catatan singkat, opsional...",
  "incident.report.reason.falseInfo": "Informasi Palsu",
  "incident.report.reason.falseInfoDesc": "Laporan terlihat palsu, salah lokasi, atau menyesatkan.",
  "incident.report.reason.harmful": "Konten Berbahaya",
  "incident.report.reason.harmfulDesc": "Konten ini dapat memicu kepanikan, kekerasan, atau dampak negatif lainnya.",
  "incident.report.reason.spam": "Spam",
  "incident.report.reason.spamDesc": "Konten berulang, tidak relevan, atau promosi.",
  "incident.report.reason.privacy": "Masalah Privasi",
  "incident.report.reason.privacyDesc": "Berisi data pribadi, alamat sensitif, atau identitas seseorang.",
  "incident.report.reason.image": "Gambar Tidak Pantas",
  "incident.report.reason.imageDesc": "Foto berisi konten sensitif atau tidak pantas.",
  "incident.report.reason.other": "Lainnya",
  "incident.report.reason.otherDesc": "Alasan lain yang perlu ditinjau."
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
