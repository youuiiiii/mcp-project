export const en = {
  "common.cancel": "Cancel",
  "common.camera": "Camera",
  "common.gallery": "Gallery",
  "common.loading": "Loading...",
  "common.photoLimit": "You can add up to {max} photos per report.",

  "tabs.home": "Home",
  "tabs.map": "Map",
  "tabs.report": "Report",
  "tabs.profile": "Profile",

  "report.header.badge": "Community Report",
  "report.header.title": "Report Incident",
  "report.header.subtitle":
    "Send a report from your current location. Before publishing, SIGAP checks for similar active incidents nearby.",
  "report.submit.idle": "Submit Report",
  "report.submit.loading": "Sending...",

  "report.location.title": "Automatic report location",
  "report.location.description":
    "When you submit, SIGAP uses your current location. Make sure you are near the incident and location permission is enabled.",

  "report.category.title": "1. Category",
  "report.category.subtitle": "Choose the main type of incident.",
  "report.subcategory.title": "2. Subcategory",
  "report.subcategory.subtitle":
    "Choose a more specific incident type when useful.",
  "report.kind.title": "1. What happened?",
  "report.kind.subtitle":
    "Pick the closest match. SIGAP uses this to route, filter, and de-duplicate reports.",
  "report.impact.title": "2. Current impact",
  "report.impact.subtitle":
    "Tap what is true right now. These answers calculate urgency automatically.",
  "report.details.title": "3. Add context",
  "report.details.subtitle":
    "Optional, but useful if there is something nearby people should know.",
  "report.details.titlePlaceholder": "Optional headline",
  "report.details.descriptionPlaceholder":
    "Add a short note, landmarks, affected direction, or anything important.",
  "report.details.minimumCharacters": "{count}/{min} minimum characters",
  "report.severity.title": "4. Severity",
  "report.severity.subtitle": "Choose how urgent the current situation is.",
  "report.evidence.title": "4. Evidence",
  "report.evidence.subtitle":
    "Add 1-4 incident photos. The first photo becomes the report cover.",
  "report.evidence.counter": "{count}/{max} photos selected",
  "report.evidence.cover": "Cover",
  "report.evidence.emptyTitle": "No photos yet",
  "report.evidence.emptyText":
    "At least 1 photo is required before the report can become a public map pin.",

  "report.validation.loginRequired.title": "Login Required",
  "report.validation.loginRequired.message":
    "Please log in before sending a report.",
  "report.validation.categoryRequired.title": "Category Required",
  "report.validation.categoryRequired.message":
    "Choose the incident category first.",
  "report.validation.kindRequired.title": "Report Type Required",
  "report.validation.kindRequired.message":
    "Choose what happened before submitting.",
  "report.validation.subcategoryRequired.title": "Incident Type Required",
  "report.validation.subcategoryRequired.message":
    "Choose the specific incident type before submitting.",
  "report.validation.titleTooShort.title": "Title Too Short",
  "report.validation.titleTooShort.message":
    "The title must be at least {min} characters.",
  "report.validation.descriptionTooShort.title": "Description Too Short",
  "report.validation.descriptionTooShort.message":
    "The description must be at least {min} characters.",
  "report.validation.photoRequired.title": "Photo Required",
  "report.validation.photoRequired.message": "Add at least 1 incident photo.",
  "report.validation.photoLimit.title": "Photo Limit",
  "report.validation.cameraPermission.title": "Camera Permission Needed",
  "report.validation.cameraPermission.message":
    "Enable camera permission to take evidence photos.",
  "report.validation.galleryPermission.title": "Gallery Permission Needed",
  "report.validation.galleryPermission.message":
    "Enable gallery permission to choose evidence photos.",
  "report.validation.invalidPhoto.title": "Invalid Photo",
  "report.validation.invalidCapturedPhoto.message":
    "Could not read the captured photo.",
  "report.validation.invalidSelectedPhoto.message":
    "Could not read the selected image.",
  "report.validation.locationPermission.title": "Location Permission Needed",
  "report.validation.locationPermission.message":
    "Enable location permission so this report can be placed on the map.",
  "report.validation.lowAccuracy.title": "Low Location Accuracy",
  "report.validation.lowAccuracy.message":
    "Your location accuracy is about {accuracy} meters. Turn on high accuracy/GPS and try again.",
  "report.validation.uploadFailed.title": "Upload Failed",
  "report.validation.uploadFailed.message":
    "At least 1 evidence photo must upload successfully.",

  "report.error.openCamera.title": "Could Not Open Camera",
  "report.error.openCamera.fallback":
    "Something went wrong while opening the camera.",
  "report.error.openGallery.title": "Could Not Open Gallery",
  "report.error.openGallery.fallback":
    "Something went wrong while opening the gallery.",
  "report.error.send.title": "Could Not Send Report",
  "report.error.send.fallback": "Something went wrong while sending the report.",

  "report.duplicate.title": "Similar Incident Nearby",
  "report.duplicate.message":
    "\"{title}\" is about {distance} away. Updating the existing incident usually keeps the map cleaner.",
  "report.duplicate.reviewMap": "Review Map",
  "report.duplicate.submitNew": "Submit New",

  "report.success.title": "Report Sent",
  "report.success.message": "Your report has been added to the map.",
  "report.success.viewMap": "View Map",
  "report.success.createAnother": "Create Another",

  "incident.category.natural_disaster.label": "Natural Disaster",
  "incident.category.natural_disaster.short": "Disaster",
  "incident.category.natural_disaster.description":
    "Floods, earthquakes, landslides, tsunamis, strong winds, or other natural hazards.",
  "incident.category.fire_emergency.label": "Fire Emergency",
  "incident.category.fire_emergency.short": "Fire",
  "incident.category.fire_emergency.description":
    "Fire, heavy smoke, building fires, vehicle fires, land fires, or electrical fires.",
  "incident.category.accident_infrastructure.label":
    "Accident & Infrastructure",
  "incident.category.accident_infrastructure.short": "Road",
  "incident.category.accident_infrastructure.description":
    "Accidents, blocked or damaged roads, fallen trees, downed cables, or damaged facilities.",
  "incident.category.security_public_order.label": "Security & Public Order",
  "incident.category.security_public_order.short": "Security",
  "incident.category.security_public_order.description":
    "Crime, theft, fights, risky crowds, public disturbance, or safety concerns.",
  "incident.category.medical_rescue.label": "Medical & Rescue",
  "incident.category.medical_rescue.short": "Medical",
  "incident.category.medical_rescue.description":
    "Medical emergencies, fainting, workplace accidents, drowning, or evacuation needs.",
  "incident.category.missing_lost.label": "Missing / Lost",
  "incident.category.missing_lost.short": "Missing",
  "incident.category.missing_lost.description":
    "Missing people, lost items, or missing vehicles.",
  "incident.category.other.label": "Other / Not Sure",
  "incident.category.other.short": "Other",
  "incident.category.other.description":
    "Reports that do not fit the main incident types yet.",

  "incident.subcategory.flood.label": "Flood",
  "incident.subcategory.flood.short": "Flood",
  "incident.subcategory.earthquake.label": "Earthquake",
  "incident.subcategory.earthquake.short": "Quake",
  "incident.subcategory.landslide.label": "Landslide",
  "incident.subcategory.landslide.short": "Slide",
  "incident.subcategory.volcanic_eruption.label": "Volcanic Eruption",
  "incident.subcategory.volcanic_eruption.short": "Volcano",
  "incident.subcategory.strong_wind.label": "Strong Wind",
  "incident.subcategory.strong_wind.short": "Wind",
  "incident.subcategory.tsunami.label": "Tsunami",
  "incident.subcategory.tsunami.short": "Tsunami",
  "incident.subcategory.fire.label": "General Fire",
  "incident.subcategory.fire.short": "Fire",
  "incident.subcategory.building_fire.label": "House / Building Fire",
  "incident.subcategory.building_fire.short": "Building",
  "incident.subcategory.vehicle_fire.label": "Vehicle Fire",
  "incident.subcategory.vehicle_fire.short": "Vehicle",
  "incident.subcategory.land_fire.label": "Land Fire",
  "incident.subcategory.land_fire.short": "Land",
  "incident.subcategory.electrical_fire.label": "Electrical Fire",
  "incident.subcategory.electrical_fire.short": "Electric",
  "incident.subcategory.traffic_accident.label": "Traffic Accident",
  "incident.subcategory.traffic_accident.short": "Accident",
  "incident.subcategory.fallen_tree.label": "Fallen Tree",
  "incident.subcategory.fallen_tree.short": "Tree",
  "incident.subcategory.road_block.label": "Road Block",
  "incident.subcategory.road_block.short": "Blocked",
  "incident.subcategory.damaged_road.label": "Damaged Road",
  "incident.subcategory.damaged_road.short": "Road",
  "incident.subcategory.fallen_power_line.label": "Downed Power Line",
  "incident.subcategory.fallen_power_line.short": "Cable",
  "incident.subcategory.collapsed_building.label": "Collapsed Building",
  "incident.subcategory.collapsed_building.short": "Collapse",
  "incident.subcategory.crime.label": "Crime",
  "incident.subcategory.crime.short": "Crime",
  "incident.subcategory.theft.label": "Theft",
  "incident.subcategory.theft.short": "Theft",
  "incident.subcategory.brawl.label": "Fight / Brawl",
  "incident.subcategory.brawl.short": "Brawl",
  "incident.subcategory.risky_crowd.label": "Risky Crowd",
  "incident.subcategory.risky_crowd.short": "Crowd",
  "incident.subcategory.mob_violence.label": "Mob Violence",
  "incident.subcategory.mob_violence.short": "Mob",
  "incident.subcategory.public_disturbance.label": "Public Disturbance",
  "incident.subcategory.public_disturbance.short": "Disturb",
  "incident.subcategory.medical.label": "Medical Emergency",
  "incident.subcategory.medical.short": "Medical",
  "incident.subcategory.fainted_person.label": "Fainted Person",
  "incident.subcategory.fainted_person.short": "Faint",
  "incident.subcategory.work_accident.label": "Workplace Accident",
  "incident.subcategory.work_accident.short": "Work",
  "incident.subcategory.drowning.label": "Drowning",
  "incident.subcategory.drowning.short": "Drown",
  "incident.subcategory.evacuation_needed.label": "Evacuation Needed",
  "incident.subcategory.evacuation_needed.short": "Evacuate",
  "incident.subcategory.missing_person.label": "Missing Person",
  "incident.subcategory.missing_person.short": "Missing",
  "incident.subcategory.missing_item.label": "Lost Item",
  "incident.subcategory.missing_item.short": "Item",
  "incident.subcategory.missing_vehicle.label": "Missing Vehicle",
  "incident.subcategory.missing_vehicle.short": "Vehicle",
  "incident.subcategory.other_incident.label": "Other Incident",
  "incident.subcategory.other_incident.short": "Other",

  "report.kind.roadBlockedOrCrash.label": "Road blocked / crash",
  "report.kind.roadBlockedOrCrash.short": "Road",
  "report.kind.roadBlockedOrCrash.helper":
    "Accident, fallen tree, damaged road, blocked access, or traffic hazard.",
  "report.kind.floodOrWeather.label": "Flood / weather hazard",
  "report.kind.floodOrWeather.short": "Weather",
  "report.kind.floodOrWeather.helper":
    "Flood, strong wind, landslide, earthquake impact, or weather danger.",
  "report.kind.fireOrSmoke.label": "Fire / smoke",
  "report.kind.fireOrSmoke.short": "Fire",
  "report.kind.fireOrSmoke.helper":
    "Visible fire, heavy smoke, electrical fire, vehicle fire, or land fire.",
  "report.kind.publicSafety.label": "Public safety issue",
  "report.kind.publicSafety.short": "Safety",
  "report.kind.publicSafety.helper":
    "Fight, theft, risky crowd, disturbance, or safety concern.",
  "report.kind.medicalOrRescue.label": "Medical / rescue needed",
  "report.kind.medicalOrRescue.short": "Rescue",
  "report.kind.medicalOrRescue.helper":
    "Injury, fainting, drowning, evacuation, or urgent help needed.",
  "report.kind.missingPerson.label": "Missing person",
  "report.kind.missingPerson.short": "Missing",
  "report.kind.missingPerson.helper":
    "Someone is missing and community visibility may help.",
  "report.kind.lostItemOrVehicle.label": "Lost item / vehicle",
  "report.kind.lostItemOrVehicle.short": "Lost",
  "report.kind.lostItemOrVehicle.helper":
    "Lost bag, wallet, important item, bicycle, motorcycle, or vehicle.",
  "report.kind.otherIncident.label": "Not sure / other",
  "report.kind.otherIncident.short": "Other",
  "report.kind.otherIncident.helper":
    "Use this when the report does not match the options above.",

  "report.impact.peopleInDanger.label": "People may be in danger",
  "report.impact.peopleInDanger.helper":
    "Someone could be hurt or needs people nearby to stay alert.",
  "report.impact.accessBlocked.label": "Road or access is blocked",
  "report.impact.accessBlocked.helper":
    "Vehicles, pedestrians, or responders may have trouble passing.",
  "report.impact.needsEmergencyHelp.label": "Emergency help may be needed",
  "report.impact.needsEmergencyHelp.helper":
    "Responder, medical, rescue, security, or official help may be needed.",
  "report.impact.stillHappening.label": "It is still happening now",
  "report.impact.stillHappening.helper":
    "Turn this off if the situation already looks over or cleared.",
  "report.impact.locationIsExact.label": "The location is exact",
  "report.impact.locationIsExact.helper":
    "Leave this on if you are at or very close to the incident.",

  "incident.severity.low.label": "Low",
  "incident.severity.low.description":
    "Not immediately dangerous, but still useful for nearby people to know.",
  "incident.severity.medium.label": "Medium",
  "incident.severity.medium.description":
    "Disrupts nearby activity and needs caution.",
  "incident.severity.high.label": "High",
  "incident.severity.high.description":
    "Dangerous, urgent, and needs quick attention.",
} as const;

export type TranslationKey = keyof typeof en;
export type TranslationResources = Record<TranslationKey, string>;

export const id: TranslationResources = {
  "common.cancel": "Batal",
  "common.camera": "Kamera",
  "common.gallery": "Galeri",
  "common.loading": "Memuat...",
  "common.photoLimit": "Anda bisa menambahkan maksimal {max} foto per laporan.",

  "tabs.home": "Beranda",
  "tabs.map": "Peta",
  "tabs.report": "Lapor",
  "tabs.profile": "Profil",

  "report.header.badge": "Laporan Komunitas",
  "report.header.title": "Laporkan Insiden",
  "report.header.subtitle":
    "Kirim laporan dari lokasi Anda saat ini. Sebelum diterbitkan, SIGAP memeriksa insiden aktif serupa di sekitar.",
  "report.submit.idle": "Kirim Laporan",
  "report.submit.loading": "Mengirim...",

  "report.location.title": "Lokasi laporan otomatis",
  "report.location.description":
    "Saat Anda mengirim laporan, SIGAP memakai lokasi Anda saat ini. Pastikan Anda berada dekat insiden dan izin lokasi aktif.",

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
  "report.impact.locationIsExact.label": "Lokasi sudah tepat",
  "report.impact.locationIsExact.helper":
    "Biarkan aktif jika Anda berada di atau sangat dekat dengan insiden.",

  "incident.severity.low.label": "Rendah",
  "incident.severity.low.description":
    "Tidak langsung berbahaya, tetapi tetap berguna diketahui orang sekitar.",
  "incident.severity.medium.label": "Sedang",
  "incident.severity.medium.description":
    "Mengganggu aktivitas sekitar dan membutuhkan kehati-hatian.",
  "incident.severity.high.label": "Tinggi",
  "incident.severity.high.description":
    "Berbahaya, mendesak, dan membutuhkan perhatian cepat.",
};

export type LanguageCode = "en" | "id";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "id",
    label: "Indonesian",
    nativeLabel: "Bahasa Indonesia",
  },
];

export const translations: Record<LanguageCode, TranslationResources> = {
  en,
  id,
};
