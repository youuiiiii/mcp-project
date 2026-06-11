import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.join(__dirname, "../src/i18n/locales/en.ts");
const ID_FILE = path.join(__dirname, "../src/i18n/locales/id.ts");

const keysEn = {
  "incident.threadModal.title": "Incident Detail",
  "incident.threadModal.subtitle": "Incident information and community updates.",
  "incident.accuracy.disabledReason": "Your report has been counted. Nearby users can confirm if the incident is still active.",
};

const keysId = {
  "incident.threadModal.title": "Detail Insiden",
  "incident.threadModal.subtitle": "Informasi insiden dan pembaruan komunitas.",
  "incident.accuracy.disabledReason": "Laporan Anda telah dihitung. Pengguna di sekitar dapat mengonfirmasi apakah insiden masih aktif.",
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
