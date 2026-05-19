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
  const title = cleanTitle || kindOption.defaultTitle;
  const selectedImpacts = IMPACT_QUESTION_OPTIONS.filter((item) => {
    return impactAnswers[item.value] === true;
  }).map((item) => t(item.labelKey));
  const impactSentence =
    selectedImpacts.length > 0
      ? `Current impact: ${selectedImpacts.join(", ")}.`
      : "No additional impact flags selected.";
  const description =
    cleanDescription ||
    `${kindLabel} reported near the selected map pin. ${impactSentence}`;

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
