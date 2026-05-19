import type {
  IncidentAccuracyVote,
  IncidentAccuracyVoteType,
} from "../../../types/incident";

export function buildAccuracySummary(
  accuracyVotes: IncidentAccuracyVote[],
  actorKey: string | null
) {
  const accurateCount = accuracyVotes.filter((item) => {
    return item.voteType === "accurate";
  }).length;

  const inaccurateCount = accuracyVotes.filter((item) => {
    return item.voteType === "inaccurate";
  }).length;

  const currentUserVote =
    accuracyVotes.find((item) => item.actorKey === actorKey)?.voteType ?? null;

  let label = "Not verified yet";
  let tone: "neutral" | "success" | "warning" | "danger" = "neutral";

  if (accurateCount >= 2 && accurateCount > inaccurateCount) {
    label = "Confirmed by community";
    tone = "success";
  } else if (inaccurateCount >= 2 && inaccurateCount > accurateCount) {
    label = "Questioned";
    tone = "danger";
  } else if (accurateCount > 0 || inaccurateCount > 0) {
    label = "Waiting for more signals";
    tone = "warning";
  }

  return {
    accurateCount,
    inaccurateCount,
    currentUserVote: currentUserVote as IncidentAccuracyVoteType | null,
    label,
    tone,
  };
}

export function getAccuracyErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "permission-denied"
  ) {
    return "Could not save this check because Firestore rules do not allow it yet. Deploy the latest firestore.rules, then try again.";
  }

  return error instanceof Error ? error.message : "Could not save your check.";
}
