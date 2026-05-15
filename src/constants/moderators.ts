export const MODERATOR_EMAILS = ["admin@gmail.com"] as const;

export function isModeratorEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return MODERATOR_EMAILS.includes(
    email.toLowerCase() as (typeof MODERATOR_EMAILS)[number]
  );
}