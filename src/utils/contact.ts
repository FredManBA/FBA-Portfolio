import { CONTACT } from '../data/contact';
import type { Language } from '../types';

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

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

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

/** Returns the configured Web3Forms key, or undefined to use the mailto fallback. */
export function getWeb3FormsKey(): string | undefined {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
  return key ? key : undefined;
}

export async function submitToWeb3Forms(
  values: ContactValues,
  { accessKey, language }: { accessKey: string; language: Language },
): Promise<void> {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: 'Nuevo mensaje desde el portafolio FBA',
      from_name: 'Portafolio FBA',
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      language,
    }),
  });

  const result: unknown = await response.json().catch(() => null);
  const accepted =
    typeof result === 'object' && result !== null && 'success' in result && result.success === true;

  if (!response.ok || !accepted) {
    throw new Error(`Web3Forms did not accept the message (HTTP ${response.status}).`);
  }
}

interface MailtoLabels {
  subject: string;
  name: string;
  email: string;
}

export function buildMailtoUrl(values: ContactValues, labels: MailtoLabels): string {
  const body = [
    values.message.trim(),
    '',
    `${labels.name}: ${values.name.trim()}`,
    `${labels.email}: ${values.email.trim()}`,
  ].join('\r\n');

  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(body)}`;
}

export function openMailClient(url: string): void {
  window.location.href = url;
}
