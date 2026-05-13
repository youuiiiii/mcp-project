import type { IncidentReport } from "../../../types/incident";

export const getEmergencyGuidance = (
  incident: IncidentReport | null
): string => {
  if (!incident) {
    return "Lokasi SOS Anda sudah dicatat. Tetap tenang, cari tempat aman terdekat, dan hubungi pihak berwenang jika kondisi mendesak.";
  }

  const incidentKind = incident.subcategory ?? incident.type;

  if (incidentKind) {
    switch (incidentKind) {
      case "flood":
        return "Hindari arus air, pindah ke tempat lebih tinggi, dan jangan memaksa melewati jalan tergenang.";

      case "earthquake":
        return "Lindungi kepala, jauhi kaca atau bangunan rapuh, lalu keluar ke area terbuka saat aman.";

      case "landslide":
        return "Jauhi lereng, tebing, dan area tanah retak. Bergerak ke area yang lebih stabil.";

      case "volcanic_eruption":
        return "Gunakan masker, jauhi area abu tebal, ikuti arahan evakuasi, dan hindari daerah aliran lahar.";

      case "strong_wind":
        return "Jauhi pohon besar, tiang listrik, baliho, dan bangunan rapuh. Cari tempat berlindung yang aman.";

      case "tsunami":
        return "Segera menjauh dari pantai dan bergerak ke tempat tinggi. Ikuti jalur evakuasi resmi.";

      case "fire":
      case "building_fire":
      case "vehicle_fire":
      case "land_fire":
      case "electrical_fire":
        return "Jauhi sumber api, hindari asap, jangan gunakan lift, dan cari jalur evakuasi terdekat.";

      case "traffic_accident":
        return "Jauhi badan jalan, beri ruang untuk petugas, dan hindari kerumunan di sekitar lokasi.";

      case "fallen_tree":
        return "Jauhi pohon, kabel listrik, dan area tertutup. Gunakan jalur alternatif.";

      case "road_block":
        return "Cari jalur alternatif dan hindari memaksakan kendaraan melewati area terhalang.";

      case "damaged_road":
        return "Kurangi kecepatan, hindari lubang atau retakan besar, dan gunakan jalur lain bila memungkinkan.";

      case "fallen_power_line":
        return "Jangan menyentuh kabel, jauhi area sekitar kabel, dan segera laporkan ke petugas terkait.";

      case "collapsed_building":
        return "Jauhi reruntuhan, hindari masuk ke area bangunan, dan beri ruang untuk petugas penyelamat.";

      case "crime":
      case "theft":
        return "Jaga jarak aman, jangan mengejar pelaku sendirian, dan segera hubungi pihak keamanan atau kepolisian.";

      case "brawl":
      case "risky_crowd":
      case "mob_violence":
      case "public_disturbance":
        return "Hindari kerumunan, jangan ikut terlibat, tetap waspada, dan menjauh dari area yang tidak kondusif.";

      case "medical":
      case "fainted_person":
      case "work_accident":
      case "drowning":
      case "evacuation_needed":
        return "Beri ruang kepada korban, hubungi bantuan medis, dan jangan memindahkan korban tanpa kebutuhan darurat.";
    }
  }

  switch (incident.category) {
    case "natural_disaster":
      return "Jauhi area berisiko, cari tempat aman, dan ikuti arahan petugas jika tersedia.";

    case "fire_emergency":
      return "Jauhi sumber api dan asap, cari jalur evakuasi, dan hubungi petugas darurat.";

    case "accident_infrastructure":
      return "Jaga jarak dari lokasi kejadian, hindari area terhalang, dan gunakan jalur alternatif.";

    case "security_public_order":
      return "Menjauh dari area tidak kondusif, jangan ikut terlibat, dan hubungi pihak berwenang.";

    case "medical_rescue":
      return "Beri ruang kepada korban, hubungi bantuan medis, dan bantu hanya jika aman dilakukan.";

    default:
      return "Tetap tenang, jauhi area kejadian, dan hubungi pihak berwenang jika dibutuhkan.";
  }
};