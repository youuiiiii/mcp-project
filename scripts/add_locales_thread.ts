import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const keysEn = {
  "incident.accuracy.title": "FIELD VERIFICATION",
  "incident.accuracy.subtitle": "Is this incident still ongoing at this location? Only confirm if you are nearby.",
  "incident.accuracy.active": "STILL ACTIVE",
  "incident.accuracy.clear": "CLEAR / SAFE",

  "incident.timeline.title": "Recent Activity",
  "incident.timeline.subtitle": "Latest status updates and evidence for this report.",
  "incident.timeline.updatesCount": "{count} updates",
  "incident.timeline.reportCreated": "Report created",
  "incident.timeline.reportMessage": "New report added to the system.",
  "incident.timeline.reportBadge": "Report",
  "incident.timeline.resolvedTitle": "Marked resolved",
  "incident.timeline.resolvedMessage": "This report has been marked resolved by the community.",
  "incident.timeline.resolvedBadge": "Resolved",
  "incident.timeline.meta": "{author} · {date}",
  "incident.timeline.hasPhoto": " · with photo",
  "incident.timeline.defaultAuthor": "User",

  "incident.discussion.title": "Community Comments",
  "incident.discussion.count": "{count} comments",
  "incident.discussion.loading": "Loading comments...",
  "incident.discussion.emptyTitle": "No comments yet",
  "incident.discussion.emptyDesc": "Be the first to add useful information.",
  "incident.discussion.anonymous": "Anonymous",
  "incident.discussion.replyingTo": "Replying to {name}",
  "incident.discussion.replyAction": "Reply",

  "common.view": "View",

  "thread.update.still_happening.label": "Still Happening",
  "thread.update.still_happening.short": "Active",
  "thread.update.still_happening.desc": "Condition is still ongoing at the location.",
  "thread.update.getting_worse.label": "Getting Worse",
  "thread.update.getting_worse.short": "Worse",
  "thread.update.getting_worse.desc": "Condition appears to be getting worse or more dangerous.",
  "thread.update.improving.label": "Improving",
  "thread.update.improving.short": "Improving",
  "thread.update.improving.desc": "Condition is improving but not fully resolved.",
  "thread.update.safe_now.label": "Safe Now",
  "thread.update.safe_now.short": "Safe",
  "thread.update.safe_now.desc": "Location appears safe or incident has subsided.",
  "thread.update.not_found.label": "Not Found",
  "thread.update.not_found.short": "None",
  "thread.update.not_found.desc": "Incident is not visible at the reported location.",
  "thread.update.additional_info.label": "Additional Info",
  "thread.update.additional_info.short": "Info",
  "thread.update.additional_info.desc": "Additional context, photos, or notes from the community.",

  "thread.status.active": "Active",
  "thread.status.resolved": "Resolved",

  "thread.verification.valid": "Confirmed",
  "thread.verification.invalid": "Inaccurate",
  "thread.verification.update": "Condition Update",

  "thread.condition.still_happening": "Still happening",
  "thread.condition.getting_worse": "Getting worse",
  "thread.condition.partially_resolved": "Improving",
  "thread.condition.resolved_but_not_closed": "Appears resolved",
  "thread.condition.not_found": "Not found",
  "thread.condition.unknown": "Condition unknown",

  "common.time.unavailable": "Time unavailable",
};

const keysId = {
  "incident.accuracy.title": "VERIFIKASI LAPANGAN",
  "incident.accuracy.subtitle": "Apakah insiden ini masih berlangsung di lokasi ini? Hanya konfirmasi jika Anda berada di dekat lokasi.",
  "incident.accuracy.active": "MASIH AKTIF",
  "incident.accuracy.clear": "AMAN / SELESAI",

  "incident.timeline.title": "Aktivitas Terbaru",
  "incident.timeline.subtitle": "Pembaruan status dan bukti terbaru untuk laporan ini.",
  "incident.timeline.updatesCount": "{count} pembaruan",
  "incident.timeline.reportCreated": "Laporan dibuat",
  "incident.timeline.reportMessage": "Laporan baru ditambahkan ke sistem.",
  "incident.timeline.reportBadge": "Laporan",
  "incident.timeline.resolvedTitle": "Ditandai selesai",
  "incident.timeline.resolvedMessage": "Laporan ini telah ditandai selesai oleh komunitas.",
  "incident.timeline.resolvedBadge": "Selesai",
  "incident.timeline.meta": "{author} · {date}",
  "incident.timeline.hasPhoto": " · ada foto",
  "incident.timeline.defaultAuthor": "Pengguna",

  "incident.discussion.title": "Komentar Komunitas",
  "incident.discussion.count": "{count} komentar",
  "incident.discussion.loading": "Memuat komentar...",
  "incident.discussion.emptyTitle": "Belum ada komentar",
  "incident.discussion.emptyDesc": "Jadilah yang pertama menambahkan informasi berguna.",
  "incident.discussion.anonymous": "Anonim",
  "incident.discussion.replyingTo": "Membalas {name}",
  "incident.discussion.replyAction": "Balas",

  "common.view": "Lihat",

  "thread.update.still_happening.label": "Masih Terjadi",
  "thread.update.still_happening.short": "Aktif",
  "thread.update.still_happening.desc": "Kondisi masih berlangsung di lokasi.",
  "thread.update.getting_worse.label": "Semakin Parah",
  "thread.update.getting_worse.short": "Memburuk",
  "thread.update.getting_worse.desc": "Kondisi tampak semakin memburuk atau semakin berbahaya.",
  "thread.update.improving.label": "Membaik",
  "thread.update.improving.short": "Membaik",
  "thread.update.improving.desc": "Kondisi membaik tapi belum sepenuhnya selesai.",
  "thread.update.safe_now.label": "Sudah Aman",
  "thread.update.safe_now.short": "Aman",
  "thread.update.safe_now.desc": "Lokasi tampak aman atau kejadian sudah mereda.",
  "thread.update.not_found.label": "Tidak Ditemukan",
  "thread.update.not_found.short": "Tidak Ada",
  "thread.update.not_found.desc": "Kejadian tidak terlihat di lokasi yang dilaporkan.",
  "thread.update.additional_info.label": "Info Tambahan",
  "thread.update.additional_info.short": "Info",
  "thread.update.additional_info.desc": "Konteks, foto, atau catatan tambahan dari komunitas.",

  "thread.status.active": "Aktif",
  "thread.status.resolved": "Selesai",

  "thread.verification.valid": "Dikonfirmasi",
  "thread.verification.invalid": "Tidak Akurat",
  "thread.verification.update": "Pembaruan Kondisi",

  "thread.condition.still_happening": "Masih terjadi",
  "thread.condition.getting_worse": "Semakin parah",
  "thread.condition.partially_resolved": "Membaik",
  "thread.condition.resolved_but_not_closed": "Tampak selesai",
  "thread.condition.not_found": "Tidak ditemukan",
  "thread.condition.unknown": "Kondisi tidak ditentukan",

  "common.time.unavailable": "Waktu tidak tersedia",
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
