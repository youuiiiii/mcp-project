import { Alert } from "react-native";

import {
  IMPACT_QUESTION_OPTIONS,
  type ReportKindOption,
} from "../../../constants/reportTaxonomy";
import type { TFunction } from "../../../i18n";
import type { NearbyIncidentCandidate } from "../../../services/incidentService";
import type { IncidentImpactAnswers } from "../../../types/incident";
import { formatDistance } from "../../../utils/geo";

export function buildReportDraft({
  cleanTitle,
  cleanDescription,
  impactAnswers,
  kindOption,
  t,
}: {
  cleanTitle: string;
  cleanDescription: string;
  impactAnswers: IncidentImpactAnswers;
  kindOption: ReportKindOption;
  t: TFunction;
}) {
  const kindLabel = t(kindOption.labelKey);

  // Use kind label as the title — simple and user-readable
  const title = cleanTitle || kindLabel;

  const selectedImpacts = IMPACT_QUESTION_OPTIONS.filter((item) => {
    return impactAnswers[item.value] === true;
  }).map((item) => t(item.labelKey));

  // Build a clean, human-friendly description
  let description = cleanDescription;
  if (!description) {
    if (selectedImpacts.length > 0) {
      description = `${kindLabel} dilaporkan di area ini. Dampak: ${selectedImpacts.join(", ")}.`;
    } else {
      description = `${kindLabel} dilaporkan di area ini.`;
    }
  }

  return {
    title,
    description,
  };
}

export function confirmNewReportDespiteDuplicate(
  candidate: NearbyIncidentCandidate,
  t: TFunction
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      t("report.duplicate.title"),
      t("report.duplicate.message", {
        title: candidate.incident.title,
        distance: formatDistance(candidate.distanceMeters),
      }),
      [
        {
          text: t("report.duplicate.reviewMap"),
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: t("report.duplicate.submitNew"),
          style: "destructive",
          onPress: () => resolve(true),
        },
      ]
    );
  });
}
