import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const profileKeysEn = {
  "profile.title.badges": "Achievement Badges",
  "profile.badge.activeReporter": "Active Reporter",
  "profile.badge.quickResponder": "Quick Responder",
  "profile.badge.contributor": "Contributor",
  "profile.badge.volunteer": "Volunteer",

  "profile.title.settings": "Settings",
  "profile.settings.nearbyAlerts": "Nearby Incident Alerts",
  "profile.settings.nearbyAlertsDesc": "Check and notify incidents near you",
  "profile.settings.bmkg": "BMKG Integration",
  "profile.settings.bmkgDesc": "Latest earthquake feed and alerts",
  "profile.settings.education": "Safety Education",
  "profile.settings.educationDesc": "Preparedness guide",
  "profile.settings.history": "Report History",
  "profile.settings.historyDesc": "Your previous reports",
  "profile.settings.moderation": "Fake Report Moderation",
  "profile.settings.moderationDesc.mod": "Review reported content",
  "profile.settings.moderationDesc.user": "Report suspicious content from incident detail",
  "profile.settings.language": "Language",
  "profile.settings.languageDesc": "English / Indonesian",

  "profile.action.logout": "Log Out",

  "profile.modal.editName.title": "Edit Profile Name",
  "profile.modal.editName.placeholder": "Enter your name",
  "profile.modal.logout.title": "Sign Out",
  "profile.modal.logout.message": "Are you sure you want to sign out of this account?",
  "common.save": "Save",
  "common.cancel": "Cancel",

  "profile.alert.nameTooShort.title": "Name too short",
  "profile.alert.nameTooShort.message": "Name must be at least 2 characters.",
  "profile.alert.nearbySent.title": "Nearby alert sent",
  "profile.alert.nearbyChecked.title": "Nearby alerts checked",
  "profile.alert.bmkgError.title": "Could not load BMKG",
  "profile.alert.bmkgError.message": "Could not fetch BMKG earthquake data.",
  "profile.alert.moderationProtected.title": "Moderation is protected",
  "profile.alert.moderationProtected.message": "Fake-report moderation is available for moderator accounts. You can still report suspicious content from an incident detail.",

  "profile.hook.logout.title": "Sign Out",
  "profile.hook.logout.message": "Sign out of this account?",
  "profile.hook.logout.error.title": "Logout Failed",
  "profile.hook.logout.error.message": "An error occurred during logout.",
  "profile.hook.photo.permission.title": "Gallery Permission Needed",
  "profile.hook.photo.permission.message": "Enable gallery permission to choose a profile photo.",
  "profile.hook.photo.invalid.title": "Invalid Photo",
  "profile.hook.photo.invalid.message": "Failed to read image from gallery.",
  "profile.hook.photo.success.title": "Profile Photo Saved",
  "profile.hook.photo.success.message": "Profile photo updated successfully.",
  "profile.hook.photo.error.title": "Failed to Change Photo",
  "profile.hook.photo.error.message": "An error occurred while changing profile photo.",
  "profile.hook.save.noLogin.title": "Not Logged In",
  "profile.hook.save.noLogin.message": "Please log in first.",
  "profile.hook.save.success.title": "Profile Saved",
  "profile.hook.save.success.message": "Name and profile photo updated successfully.",
  "profile.hook.save.error.title": "Failed to Save Profile",
  "profile.hook.save.error.message": "An error occurred while saving profile.",
  
  "profile.role.moderator": "Moderator",
  "profile.role.communityMember": "Community Member",
  "profile.stats.reports": "Reports",
  "profile.stats.points": "Points",
  "profile.stats.areas": "Areas",
  "profile.stats.badges": "Badges",
};

const profileKeysId = {
  "profile.title.badges": "Lencana Prestasi",
  "profile.badge.activeReporter": "Pelapor Aktif",
  "profile.badge.quickResponder": "Responden Cepat",
  "profile.badge.contributor": "Kontributor",
  "profile.badge.volunteer": "Sukarelawan",

  "profile.title.settings": "Pengaturan",
  "profile.settings.nearbyAlerts": "Peringatan Insiden Terdekat",
  "profile.settings.nearbyAlertsDesc": "Periksa dan beritahu insiden di dekat Anda",
  "profile.settings.bmkg": "Integrasi BMKG",
  "profile.settings.bmkgDesc": "Data gempa terbaru dan peringatan",
  "profile.settings.education": "Edukasi Keselamatan",
  "profile.settings.educationDesc": "Panduan kesiapsiagaan",
  "profile.settings.history": "Riwayat Laporan",
  "profile.settings.historyDesc": "Laporan Anda sebelumnya",
  "profile.settings.moderation": "Moderasi Laporan Palsu",
  "profile.settings.moderationDesc.mod": "Tinjau konten yang dilaporkan",
  "profile.settings.moderationDesc.user": "Laporkan konten mencurigakan dari detail insiden",
  "profile.settings.language": "Bahasa",
  "profile.settings.languageDesc": "Inggris / Indonesia",

  "profile.action.logout": "Keluar",

  "profile.modal.editName.title": "Edit Nama Profil",
  "profile.modal.editName.placeholder": "Masukkan nama Anda",
  "profile.modal.logout.title": "Keluar",
  "profile.modal.logout.message": "Apakah Anda yakin ingin keluar dari akun ini?",
  "common.save": "Simpan",
  "common.cancel": "Batal",

  "profile.alert.nameTooShort.title": "Nama terlalu pendek",
  "profile.alert.nameTooShort.message": "Nama minimal terdiri dari 2 karakter.",
  "profile.alert.nearbySent.title": "Peringatan terdekat dikirim",
  "profile.alert.nearbyChecked.title": "Peringatan terdekat diperiksa",
  "profile.alert.bmkgError.title": "Gagal memuat BMKG",
  "profile.alert.bmkgError.message": "Tidak dapat mengambil data gempa BMKG.",
  "profile.alert.moderationProtected.title": "Moderasi dilindungi",
  "profile.alert.moderationProtected.message": "Moderasi laporan palsu tersedia untuk akun moderator. Anda masih dapat melaporkan konten mencurigakan dari detail insiden.",

  "profile.hook.logout.title": "Keluar",
  "profile.hook.logout.message": "Keluar dari akun ini?",
  "profile.hook.logout.error.title": "Gagal Keluar",
  "profile.hook.logout.error.message": "Terjadi kesalahan saat keluar.",
  "profile.hook.photo.permission.title": "Izin Galeri Dibutuhkan",
  "profile.hook.photo.permission.message": "Aktifkan izin galeri untuk memilih foto profil.",
  "profile.hook.photo.invalid.title": "Foto Tidak Valid",
  "profile.hook.photo.invalid.message": "Gagal membaca gambar dari galeri.",
  "profile.hook.photo.success.title": "Foto Profil Tersimpan",
  "profile.hook.photo.success.message": "Foto profil berhasil diperbarui.",
  "profile.hook.photo.error.title": "Gagal Mengubah Foto",
  "profile.hook.photo.error.message": "Terjadi kesalahan saat mengubah foto profil.",
  "profile.hook.save.noLogin.title": "Belum Login",
  "profile.hook.save.noLogin.message": "Silakan login terlebih dahulu.",
  "profile.hook.save.success.title": "Profil Tersimpan",
  "profile.hook.save.success.message": "Nama dan foto profil berhasil diperbarui.",
  "profile.hook.save.error.title": "Gagal Menyimpan Profil",
  "profile.hook.save.error.message": "Terjadi kesalahan saat menyimpan profil.",

  "profile.role.moderator": "Moderator",
  "profile.role.communityMember": "Anggota Komunitas",
  "profile.stats.reports": "Laporan",
  "profile.stats.points": "Poin",
  "profile.stats.areas": "Area",
  "profile.stats.badges": "Lencana",
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

appendLocales(EN_FILE, profileKeysEn);
appendLocales(ID_FILE, profileKeysId);
