/**
 * The contact form never sends anything itself: it prepares an email in the visitor's own mail
 * app, so the site processes no personal data and needs no form service.
 */
export interface ContactValues {
  name: string;
  message: string;
}

export type ContactField = keyof ContactValues;

export type ContactErrorKey =
  | 'nameRequired'
  | 'nameTooShort'
  | 'nameTooLong'
  | 'messageRequired'
  | 'messageTooShort'
  | 'messageTooLong';

export type ContactErrors = Partial<Record<ContactField, ContactErrorKey>>;

export const CONTACT_FIELDS: readonly ContactField[] = ['name', 'message'];

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  messageMin: 10,
  // Keeps the encoded mailto link short enough for every mail app to open it.
  messageMax: 1000,
} as const;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'nameRequired';
  } else if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = 'nameTooShort';
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = 'nameTooLong';
  }

  if (!message) {
    errors.message = 'messageRequired';
  } else if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = 'messageTooShort';
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = 'messageTooLong';
  }

  return errors;
}

/** A `mailto:` link with the subject and the message (signed with the name) already filled in. */
export function buildMailto(
  values: ContactValues,
  { to, subject }: { to: string; subject: string },
) {
  const body = `${values.message.trim()}\n\n${values.name.trim()}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Hands the prepared email to the visitor's mail app. */
export function openMailApp(href: string) {
  window.location.assign(href);
}
