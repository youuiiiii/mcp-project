import type { TranslationResources } from "../translationTypes";

export const id: TranslationResources = {
  "common.cancel": "Batal",
  "common.camera": "Kamera",
  "common.gallery": "Galeri",
  "common.loading": "Memuat...",
  "common.photoLimit": "Anda bisa menambahkan maksimal {max} foto per laporan.",

  "tabs.home": "Beranda",
  "tabs.map": "Peta",
  "tabs.report": "Lapor",
  "tabs.incidents": "Laporan",
  "tabs.profile": "Profil",

  "report.header.badge": "Laporan Komunitas",
  "report.header.title": "Laporkan Insiden",
  "report.header.subtitle":
    "Mulai dari lokasi Anda saat ini, sesuaikan pin insiden jika perlu, lalu SIGAP memeriksa insiden aktif serupa di sekitar.",
  "report.submit.idle": "Kirim Laporan",
  "report.submit.loading": "Mengirim...",

  "report.location.title": "Lokasi insiden",
  "report.location.description":
    "SIGAP memulai dari lokasi Anda saat ini. Jika insiden terjadi di tempat lain yang masih dekat, sesuaikan pin sebelum mengirim.",
  "report.location.currentPin": "Memakai lokasi Anda saat ini sebagai pin insiden.",
  "report.location.manualPin": "Memakai pin insiden yang sudah disesuaikan.",
  "report.location.notSet": "Belum ada pin dipilih. SIGAP akan memakai lokasi Anda saat mengirim.",
  "report.location.accuracy": "Akurasi GPS sekitar {accuracy} m",
  "report.location.useCurrent": "Pakai Lokasi Saat Ini",
  "report.location.adjustPin": "Sesuaikan Pin",
  "report.location.picker.title": "Sesuaikan Pin Insiden",
  "report.location.picker.subtitle": "Ketuk peta atau geser marker ke lokasi insiden terjadi.",
  "report.location.picker.save": "Simpan Pin",

  "report.category.title": "1. Kategori",
  "report.category.subtitle": "Pilih jenis utama insiden.",
  "report.subcategory.title": "2. Subkategori",
  "report.subcategory.subtitle":
    "Pilih jenis insiden yang lebih spesifik jika diperlukan.",
  "report.kind.title": "1. Apa yang terjadi?",
  "report.kind.subtitle":
    "Pilih yang paling mendekati. SIGAP memakai ini untuk rute, filter, dan deteksi laporan duplikat.",
  "report.impact.title": "2. Dampak saat ini",
  "report.impact.subtitle":
    "Pilih kondisi yang benar saat ini. Jawaban ini menghitung urgensi secara otomatis.",
  "report.details.title": "3. Tambahkan konteks",
  "report.details.subtitle":
    "Opsional, tetapi berguna jika ada hal yang perlu diketahui orang sekitar.",
  "report.details.titlePlaceholder": "Judul opsional",
  "report.details.descriptionPlaceholder":
    "Tambahkan catatan singkat, patokan lokasi, arah terdampak, atau hal penting.",
  "report.details.minimumCharacters": "{count}/{min} karakter minimum",
  "report.severity.title": "4. Tingkat Urgensi",
  "report.severity.subtitle": "Pilih seberapa mendesak situasi saat ini.",
  "report.evidence.title": "4. Bukti",
  "report.evidence.subtitle":
    "Tambahkan 1-4 foto insiden. Foto pertama menjadi sampul laporan.",
  "report.evidence.counter": "{count}/{max} foto dipilih",
  "report.evidence.cover": "Sampul",
  "report.evidence.emptyTitle": "Belum ada foto",
  "report.evidence.emptyText":
    "Minimal 1 foto diperlukan sebelum laporan menjadi pin publik di peta.",

  "report.validation.loginRequired.title": "Login Diperlukan",
  "report.validation.loginRequired.message":
    "Silakan login sebelum mengirim laporan.",
  "report.validation.categoryRequired.title": "Kategori Diperlukan",
  "report.validation.categoryRequired.message": "Pilih kategori insiden dulu.",
  "report.validation.kindRequired.title": "Jenis Laporan Diperlukan",
  "report.validation.kindRequired.message":
    "Pilih apa yang terjadi sebelum mengirim laporan.",
  "report.validation.subcategoryRequired.title": "Jenis Insiden Diperlukan",
  "report.validation.subcategoryRequired.message":
    "Pilih jenis insiden yang spesifik sebelum mengirim.",
  "report.validation.titleTooShort.title": "Judul Terlalu Pendek",
  "report.validation.titleTooShort.message":
    "Judul harus minimal {min} karakter.",
  "report.validation.descriptionTooShort.title": "Deskripsi Terlalu Pendek",
  "report.validation.descriptionTooShort.message":
    "Deskripsi harus minimal {min} karakter.",
  "report.validation.photoRequired.title": "Foto Diperlukan",
  "report.validation.photoRequired.message": "Tambahkan minimal 1 foto insiden.",
  "report.validation.photoLimit.title": "Batas Foto",
  "report.validation.cameraPermission.title": "Izin Kamera Diperlukan",
  "report.validation.cameraPermission.message":
    "Aktifkan izin kamera untuk mengambil foto bukti.",
  "report.validation.galleryPermission.title": "Izin Galeri Diperlukan",
  "report.validation.galleryPermission.message":
    "Aktifkan izin galeri untuk memilih foto bukti.",
  "report.validation.invalidPhoto.title": "Foto Tidak Valid",
  "report.validation.invalidCapturedPhoto.message":
    "Foto yang diambil tidak dapat dibaca.",
  "report.validation.invalidSelectedPhoto.message":
    "Gambar yang dipilih tidak dapat dibaca.",
  "report.validation.locationPermission.title": "Izin Lokasi Diperlukan",
  "report.validation.locationPermission.message":
    "Aktifkan izin lokasi agar laporan dapat ditempatkan di peta.",
  "report.validation.lowAccuracy.title": "Akurasi Lokasi Rendah",
  "report.validation.lowAccuracy.message":
    "Akurasi lokasi Anda sekitar {accuracy} meter. Aktifkan akurasi tinggi/GPS dan coba lagi.",
  "report.validation.uploadFailed.title": "Upload Gagal",
  "report.validation.uploadFailed.message":
    "Minimal 1 foto bukti harus berhasil diunggah.",

  "report.error.openCamera.title": "Kamera Tidak Dapat Dibuka",
  "report.error.openCamera.fallback":
    "Terjadi kesalahan saat membuka kamera.",
  "report.error.openGallery.title": "Galeri Tidak Dapat Dibuka",
  "report.error.openGallery.fallback":
    "Terjadi kesalahan saat membuka galeri.",
  "report.error.send.title": "Laporan Tidak Dapat Dikirim",
  "report.error.send.fallback":
    "Terjadi kesalahan saat mengirim laporan.",

  "report.duplicate.title": "Ada Insiden Serupa di Sekitar",
  "report.duplicate.message":
    "\"{title}\" berjarak sekitar {distance}. Memperbarui insiden yang sudah ada biasanya membuat peta lebih rapi.",
  "report.duplicate.reviewMap": "Lihat Peta",
  "report.duplicate.submitNew": "Kirim Baru",

  "report.success.title": "Laporan Terkirim",
  "report.success.message": "Laporan Anda sudah ditambahkan ke peta.",
  "report.success.viewMap": "Lihat Peta",
  "report.success.createAnother": "Buat Lagi",

  "incident.category.natural_disaster.label": "Bencana Alam",
  "incident.category.natural_disaster.short": "Bencana",
  "incident.category.natural_disaster.description":
    "Banjir, gempa, longsor, tsunami, angin kencang, atau bahaya alam lainnya.",
  "incident.category.fire_emergency.label": "Darurat Kebakaran",
  "incident.category.fire_emergency.short": "Kebakaran",
  "incident.category.fire_emergency.description":
    "Api, asap tebal, kebakaran bangunan, kendaraan, lahan, atau listrik.",
  "incident.category.accident_infrastructure.label":
    "Kecelakaan & Infrastruktur",
  "incident.category.accident_infrastructure.short": "Jalan",
  "incident.category.accident_infrastructure.description":
    "Kecelakaan, jalan terhalang atau rusak, pohon tumbang, kabel jatuh, atau fasilitas rusak.",
  "incident.category.security_public_order.label":
    "Keamanan & Ketertiban Umum",
  "incident.category.security_public_order.short": "Keamanan",
  "incident.category.security_public_order.description":
    "Kejahatan, pencurian, perkelahian, kerumunan berisiko, gangguan umum, atau kekhawatiran keamanan.",
  "incident.category.medical_rescue.label": "Medis & Penyelamatan",
  "incident.category.medical_rescue.short": "Medis",
  "incident.category.medical_rescue.description":
    "Darurat medis, pingsan, kecelakaan kerja, tenggelam, atau kebutuhan evakuasi.",
  "incident.category.missing_lost.label": "Hilang / Tertinggal",
  "incident.category.missing_lost.short": "Hilang",
  "incident.category.missing_lost.description":
    "Orang hilang, barang hilang, atau kendaraan hilang.",
  "incident.category.other.label": "Lainnya / Tidak Yakin",
  "incident.category.other.short": "Lainnya",
  "incident.category.other.description":
    "Laporan yang belum cocok dengan jenis insiden utama.",

  "incident.subcategory.flood.label": "Banjir",
  "incident.subcategory.flood.short": "Banjir",
  "incident.subcategory.earthquake.label": "Gempa",
  "incident.subcategory.earthquake.short": "Gempa",
  "incident.subcategory.landslide.label": "Longsor",
  "incident.subcategory.landslide.short": "Longsor",
  "incident.subcategory.volcanic_eruption.label": "Erupsi Gunung",
  "incident.subcategory.volcanic_eruption.short": "Erupsi",
  "incident.subcategory.strong_wind.label": "Angin Kencang",
  "incident.subcategory.strong_wind.short": "Angin",
  "incident.subcategory.tsunami.label": "Tsunami",
  "incident.subcategory.tsunami.short": "Tsunami",
  "incident.subcategory.fire.label": "Kebakaran Umum",
  "incident.subcategory.fire.short": "Api",
  "incident.subcategory.building_fire.label": "Kebakaran Rumah / Bangunan",
  "incident.subcategory.building_fire.short": "Bangunan",
  "incident.subcategory.vehicle_fire.label": "Kebakaran Kendaraan",
  "incident.subcategory.vehicle_fire.short": "Kendaraan",
  "incident.subcategory.land_fire.label": "Kebakaran Lahan",
  "incident.subcategory.land_fire.short": "Lahan",
  "incident.subcategory.electrical_fire.label": "Kebakaran Listrik",
  "incident.subcategory.electrical_fire.short": "Listrik",
  "incident.subcategory.traffic_accident.label": "Kecelakaan Lalu Lintas",
  "incident.subcategory.traffic_accident.short": "Kecelakaan",
  "incident.subcategory.fallen_tree.label": "Pohon Tumbang",
  "incident.subcategory.fallen_tree.short": "Pohon",
  "incident.subcategory.road_block.label": "Jalan Terhalang",
  "incident.subcategory.road_block.short": "Terhalang",
  "incident.subcategory.damaged_road.label": "Jalan Rusak",
  "incident.subcategory.damaged_road.short": "Jalan",
  "incident.subcategory.fallen_power_line.label": "Kabel Listrik Jatuh",
  "incident.subcategory.fallen_power_line.short": "Kabel",
  "incident.subcategory.collapsed_building.label": "Bangunan Roboh",
  "incident.subcategory.collapsed_building.short": "Roboh",
  "incident.subcategory.crime.label": "Kejahatan",
  "incident.subcategory.crime.short": "Kejahatan",
  "incident.subcategory.theft.label": "Pencurian",
  "incident.subcategory.theft.short": "Pencurian",
  "incident.subcategory.brawl.label": "Perkelahian / Tawuran",
  "incident.subcategory.brawl.short": "Tawuran",
  "incident.subcategory.risky_crowd.label": "Kerumunan Berisiko",
  "incident.subcategory.risky_crowd.short": "Kerumunan",
  "incident.subcategory.mob_violence.label": "Kekerasan Massa",
  "incident.subcategory.mob_violence.short": "Massa",
  "incident.subcategory.public_disturbance.label": "Gangguan Umum",
  "incident.subcategory.public_disturbance.short": "Gangguan",
  "incident.subcategory.medical.label": "Darurat Medis",
  "incident.subcategory.medical.short": "Medis",
  "incident.subcategory.fainted_person.label": "Orang Pingsan",
  "incident.subcategory.fainted_person.short": "Pingsan",
  "incident.subcategory.work_accident.label": "Kecelakaan Kerja",
  "incident.subcategory.work_accident.short": "Kerja",
  "incident.subcategory.drowning.label": "Tenggelam",
  "incident.subcategory.drowning.short": "Tenggelam",
  "incident.subcategory.evacuation_needed.label": "Butuh Evakuasi",
  "incident.subcategory.evacuation_needed.short": "Evakuasi",
  "incident.subcategory.missing_person.label": "Orang Hilang",
  "incident.subcategory.missing_person.short": "Orang",
  "incident.subcategory.missing_item.label": "Barang Hilang",
  "incident.subcategory.missing_item.short": "Barang",
  "incident.subcategory.missing_vehicle.label": "Kendaraan Hilang",
  "incident.subcategory.missing_vehicle.short": "Kendaraan",
  "incident.subcategory.other_incident.label": "Insiden Lainnya",
  "incident.subcategory.other_incident.short": "Lainnya",

  "report.kind.roadBlockedOrCrash.label": "Jalan terhalang / kecelakaan",
  "report.kind.roadBlockedOrCrash.short": "Jalan",
  "report.kind.roadBlockedOrCrash.helper":
    "Kecelakaan, pohon tumbang, jalan rusak, akses tertutup, atau bahaya lalu lintas.",
  "report.kind.floodOrWeather.label": "Banjir / bahaya cuaca",
  "report.kind.floodOrWeather.short": "Cuaca",
  "report.kind.floodOrWeather.helper":
    "Banjir, angin kencang, longsor, dampak gempa, atau bahaya cuaca.",
  "report.kind.fireOrSmoke.label": "Api / asap",
  "report.kind.fireOrSmoke.short": "Api",
  "report.kind.fireOrSmoke.helper":
    "Api terlihat, asap tebal, kebakaran listrik, kendaraan, atau lahan.",
  "report.kind.publicSafety.label": "Masalah keamanan publik",
  "report.kind.publicSafety.short": "Keamanan",
  "report.kind.publicSafety.helper":
    "Perkelahian, pencurian, kerumunan berisiko, gangguan, atau kekhawatiran keamanan.",
  "report.kind.medicalOrRescue.label": "Butuh medis / penyelamatan",
  "report.kind.medicalOrRescue.short": "Rescue",
  "report.kind.medicalOrRescue.helper":
    "Cedera, pingsan, tenggelam, evakuasi, atau bantuan mendesak.",
  "report.kind.missingPerson.label": "Orang hilang",
  "report.kind.missingPerson.short": "Hilang",
  "report.kind.missingPerson.helper":
    "Seseorang hilang dan visibilitas komunitas dapat membantu.",
  "report.kind.lostItemOrVehicle.label": "Barang / kendaraan hilang",
  "report.kind.lostItemOrVehicle.short": "Hilang",
  "report.kind.lostItemOrVehicle.helper":
    "Tas, dompet, barang penting, sepeda, motor, atau kendaraan hilang.",
  "report.kind.otherIncident.label": "Tidak yakin / lainnya",
  "report.kind.otherIncident.short": "Lainnya",
  "report.kind.otherIncident.helper":
    "Gunakan ini jika laporan tidak cocok dengan pilihan di atas.",

  "report.impact.peopleInDanger.label": "Orang mungkin dalam bahaya",
  "report.impact.peopleInDanger.helper":
    "Seseorang mungkin terluka atau orang sekitar perlu waspada.",
  "report.impact.accessBlocked.label": "Jalan atau akses terhalang",
  "report.impact.accessBlocked.helper":
    "Kendaraan, pejalan kaki, atau petugas mungkin sulit lewat.",
  "report.impact.needsEmergencyHelp.label": "Mungkin butuh bantuan darurat",
  "report.impact.needsEmergencyHelp.helper":
    "Petugas, medis, rescue, keamanan, atau bantuan resmi mungkin dibutuhkan.",
  "report.impact.stillHappening.label": "Masih terjadi sekarang",
  "report.impact.stillHappening.helper":
    "Matikan jika situasi tampaknya sudah selesai atau bersih.",
  "report.impact.locationIsExact.label": "Saya berada di atau sangat dekat dengan insiden",
  "report.impact.locationIsExact.helper":
    "Aktifkan hanya jika pin yang dipilih benar-benar sesuai dengan lokasi insiden.",

  "incident.severity.low.label": "Rendah",
  "incident.severity.low.description":
    "Tidak langsung berbahaya, tetapi tetap berguna diketahui orang sekitar.",
  "incident.severity.medium.label": "Sedang",
  "incident.severity.medium.description":
    "Mengganggu aktivitas sekitar dan membutuhkan kehati-hatian.",
  "incident.severity.high.label": "Tinggi",
  "incident.severity.high.description":
    "Berbahaya, mendesak, dan membutuhkan perhatian cepat.",

  // Auth Translation Keys
  "auth.signInToSigap": "Masuk ke SIGAP",
  "auth.signUpToSigap": "Buat Akun Anda",
  "auth.dontHaveAccount": "Belum punya akun?",
  "auth.alreadyHaveAccount": "Sudah punya akun?",
  "auth.signUp": "Daftar",
  "auth.signUpBtn": "Daftar Sekarang",
  "auth.signIn": "Masuk",
  "auth.email": "Email",
  "auth.emailPlaceholder": "Masukkan email Anda",
  "auth.password": "Kata Sandi",
  "auth.passwordPlaceholder": "Masukkan kata sandi Anda",
  "auth.rememberMe": "Ingat saya",
  "auth.forgotPassword": "Lupa Kata Sandi?",
  "auth.continueWithGoogle": "Lanjutkan dengan Google",
  "auth.continueWithApple": "Lanjutkan dengan Apple",
  "auth.forgotPasswordTitle": "Lupa Kata Sandi",
  "auth.forgotPasswordDesc": "Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda. Silakan masukkan alamat email Anda.",
  "auth.send": "Kirim",
  "auth.backToLogin": "Kembali ke Login",
  "auth.checkYourEmail": "Periksa email Anda",
  "auth.checkYourEmailDesc": "Kami telah mengirimkan email berisi petunjuk untuk mengatur ulang kata sandi Anda.",
  "auth.fullName": "Nama Lengkap",
  "auth.fullNamePlaceholder": "Masukkan nama lengkap Anda",
  "auth.confirmPassword": "Konfirmasi Kata Sandi",
  "auth.confirmPasswordPlaceholder": "Masukkan kembali kata sandi Anda",

  // Onboarding & Welcome
  "onboarding.slide0.title": "Peta Krisis",
  "onboarding.slide0.desc": "Pantau peringatan bencana secara real-time dan lihat peta krisis aktif di sekitar komunitas Anda dengan mudah.",
  "onboarding.slide1.title": "Info Penyelamatan SOS",
  "onboarding.slide1.desc": "Akses info kontak petugas tanggap darurat dengan cepat dan simulasikan panggilan langsung ke nomor darurat.",
  "onboarding.slide2.title": "Aktivitas Relawan",
  "onboarding.slide2.desc": "Bergabunglah dengan program penyelamatan komunitas dan kelas pelatihan keselamatan. Ciptakan lingkungan yang lebih aman bersama.",
  "onboarding.continue": "Lanjutkan",
  "onboarding.getStarted": "Mulai",
  "auth.welcomeTitle": "Selamat Datang di SIGAP",
  "auth.welcomeDesc": "Membantu Anda memantau situasi dan tetap waspada di mana saja.",
  "auth.createAccount": "Buat akun",
  "auth.successTitle": "Akun Anda berhasil dibuat!",
  "auth.successDesc": "Tinggal satu langkah lagi untuk menjelajahi situasi keselamatan. Masuk untuk mulai menggunakan SIGAP.",
  "auth.legalText": "Dengan menggunakan SIGAP, Anda menyetujui Ketentuan dan Kebijakan Privasi kami.",

  // Home Screen
  "home.hero.greeting": "Selamat pagi",
  "home.hero.statusBadge": "Semua Aman",
  "home.hero.title": "Semua Aman di Sekitar Anda",
  "home.hero.summary": "Ada {activeCount} laporan aktif di sekitar Anda ({attentionCount} darurat).",
  "home.actions.reportIncident": "Laporkan Kejadian",
  "home.actions.viewMap": "Lihat Peta",

  // Incident Trust Statuses
  "incident.trust.unverified": "Belum Terverifikasi",
  "incident.trust.gainingTrust": "Mulai Dipercaya",
  "incident.trust.communityVerified": "Terverifikasi Warga",
  "incident.trust.moderatorConfirmed": "Dikonfirmasi Staf",
  "incident.trust.resolved": "Selesai",

  // Incident Card
  "incident.card.untitled": "Laporan Tanpa Judul",
  "incident.card.timeUnavailable": "Waktu tidak tersedia",
  "incident.card.share": "Bagikan Kejadian",
  "incident.card.confirmationCount.one": "1 konfirmasi warga",
  "incident.card.confirmationCount.other": "{count} konfirmasi warga",
};
