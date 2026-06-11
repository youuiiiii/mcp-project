import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const homeKeysEn = {
  "home.hero.welcome": "Welcome back",
  "home.stats.todays": "Today's Incidents",
  "home.stats.handled": "Handled",
  "home.stats.activeVolunteers": "Active Volunteers",
  "home.section.quickActions": "Quick Actions",
  "home.section.recentIncidents": "Recent Incidents",
  "home.action.seeAll": "See all",
  "home.loading.dashboard": "Loading dashboard...",
  "home.empty.title": "No recent incidents",
  "home.empty.desc": "New community reports will appear here as soon as they are submitted.",
  
  "home.quick.report": "Report",
  "home.quick.earthquake": "Earthquake",
  "home.quick.education": "Education",
  "home.quick.maps": "Maps",
  "home.quick.incident": "Incident",
  "home.quick.profile": "Profile",

  "common.time.unknown": "Unknown time",
  "common.time.justNow": "Just now",
  "common.time.minutesAgo": "{min} minute(s) ago",
  "common.time.hoursAgo": "{hour} hour(s) ago",
  "common.time.daysAgo": "{day} day(s) ago",

  "status.resolved": "Resolved",
  "status.monitoring": "Monitoring",
  "status.active": "Active",

  "home.reports.count": "{count} report(s)"
};

const homeKeysId = {
  "home.hero.welcome": "Selamat datang kembali",
  "home.stats.todays": "Insiden Hari Ini",
  "home.stats.handled": "Tertangani",
  "home.stats.activeVolunteers": "Relawan Aktif",
  "home.section.quickActions": "Aksi Cepat",
  "home.section.recentIncidents": "Insiden Terbaru",
  "home.action.seeAll": "Lihat semua",
  "home.loading.dashboard": "Memuat dasbor...",
  "home.empty.title": "Tidak ada insiden terbaru",
  "home.empty.desc": "Laporan komunitas baru akan muncul di sini segera setelah dikirimkan.",

  "home.quick.report": "Lapor",
  "home.quick.earthquake": "Gempa",
  "home.quick.education": "Edukasi",
  "home.quick.maps": "Peta",
  "home.quick.incident": "Insiden",
  "home.quick.profile": "Profil",

  "common.time.unknown": "Waktu tidak diketahui",
  "common.time.justNow": "Baru saja",
  "common.time.minutesAgo": "{min} menit yang lalu",
  "common.time.hoursAgo": "{hour} jam yang lalu",
  "common.time.daysAgo": "{day} hari yang lalu",

  "status.resolved": "Selesai",
  "status.monitoring": "Dipantau",
  "status.active": "Aktif",

  "home.reports.count": "{count} laporan"
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

appendLocales(EN_FILE, homeKeysEn);
appendLocales(ID_FILE, homeKeysId);
