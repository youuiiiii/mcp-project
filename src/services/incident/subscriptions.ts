import {
  collection,
  limit as limitQuery,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  ACCURACY_VOTES_COLLECTION,
  REPLIES_COLLECTION,
  REPORTS_COLLECTION,
  VERIFICATIONS_COLLECTION,
} from "./collections";
import {
  mapAccuracyVoteDocument,
  mapIncidentDocument,
  mapReplyDocument,
  mapVerificationDocument,
} from "./mappers";
import { SubscribeToIncidentsOptions } from "./serviceTypes";
import {
  IncidentAccuracyVote,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../types/incident";

export const subscribeToIncidents = (
  onSuccess: (reports: IncidentReport[]) => void,
  onError?: (error: Error) => void,
  options: SubscribeToIncidentsOptions = {}
) => {
  const constraints: QueryConstraint[] = [
    where("moderationStatus", "==", "visible"),
  ];

  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }

  if (options.category) {
    constraints.push(where("category", "==", options.category));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (typeof options.limitCount === "number" && options.limitCount > 0) {
    constraints.push(limitQuery(Math.floor(options.limitCount)));
  }

  const reportsQuery = query(
    collection(db, REPORTS_COLLECTION),
    ...constraints
  );

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs
        .map(mapIncidentDocument)
        .filter((report): report is IncidentReport => {
          return report !== null && report.moderationStatus !== "hidden";
        });

      onSuccess(reports);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentVerifications = (
  reportId: string,
  onSuccess: (items: IncidentVerification[]) => void,
  onError?: (error: Error) => void
) => {
  const verificationsQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, VERIFICATIONS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    verificationsQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) => {
        return mapVerificationDocument(item, reportId);
      });

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentReplies = (
  reportId: string,
  onSuccess: (items: IncidentReply[]) => void,
  onError?: (error: Error) => void
) => {
  const repliesQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, REPLIES_COLLECTION),
    where("moderationStatus", "==", "visible"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    repliesQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map((item) => {
          return mapReplyDocument(item, reportId);
        })
        .filter((reply) => reply.moderationStatus !== "hidden");

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentAccuracyVotes = (
  reportId: string,
  onSuccess: (items: IncidentAccuracyVote[]) => void,
  onError?: (error: Error) => void
) => {
  const votesQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, ACCURACY_VOTES_COLLECTION),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    votesQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) => {
        return mapAccuracyVoteDocument(item, reportId);
      });

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

