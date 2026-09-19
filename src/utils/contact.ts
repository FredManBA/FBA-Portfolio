export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactValues;

export type ContactErrorKey =
  | 'nameRequired'
  | 'nameTooShort'
  | 'nameTooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'emailTooLong'
  | 'messageRequired'
  | 'messageTooShort'
  | 'messageTooLong';

export type ContactErrors = Partial<Record<ContactField, ContactErrorKey>>;

export const CONTACT_FIELDS: readonly ContactField[] = ['name', 'email', 'message'];

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 4000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'nameRequired';
  } else if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = 'nameTooShort';
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = 'nameTooLong';
  }

  if (!email) {
    errors.email = 'emailRequired';
  } else if (email.length > CONTACT_LIMITS.emailMax) {
    errors.email = 'emailTooLong';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'emailInvalid';
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
