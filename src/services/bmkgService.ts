export type BmkgEarthquake = {
  Tanggal?: string;
  Jam?: string;
  DateTime?: string;
  Coordinates?: string;
  Lintang?: string;
  Bujur?: string;
  Magnitude?: string;
  Kedalaman?: string;
  Wilayah?: string;
  Potensi?: string;
  Dirasakan?: string;
};

type BmkgEarthquakeResponse = {
  Infogempa?: {
    gempa?: BmkgEarthquake[];
  };
};

const BMKG_EARTHQUAKE_URL =
  "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json";

export const fetchRecentBmkgEarthquakes = async (): Promise<
  BmkgEarthquake[]
> => {
  const response = await fetch(BMKG_EARTHQUAKE_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data gempa BMKG.");
  }

  const data = (await response.json()) as BmkgEarthquakeResponse;

  return Array.isArray(data.Infogempa?.gempa) ? data.Infogempa.gempa : [];
};