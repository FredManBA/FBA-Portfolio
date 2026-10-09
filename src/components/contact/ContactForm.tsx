import { CircleAlert, CircleCheck, Copy, Mail } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { STUDIO_EMAIL } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  buildMailto,
  openMailApp,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../../utils/contact';
import button from '../ui/button.module.css';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'opened' | 'copied' | 'copyFailed';

const EMPTY_VALUES: ContactValues = { name: '', message: '' };

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Prepares the email in the visitor's own mail app (name, subject and message filled in). The
 * site sends and stores nothing; the studio address stays visible as a fallback.
 */
export function ContactForm() {
  const { t } = useLanguage();
  const copy = t.contact.form;
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange =
    (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Once the visitor tried to send, errors update as they type.
      if (attempted) {
        setErrors(validateContact(next));
      }
      setStatus('idle');
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateContact(values);
    setAttempted(true);
    setErrors(nextErrors);

    const firstInvalid = CONTACT_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const refs = { name: nameRef, message: messageRef };
      refs[firstInvalid].current?.focus();
      setStatus('idle');
      return;
    }

    openMailApp(
      buildMailto(values, { to: STUDIO_EMAIL, subject: copy.subject(values.name.trim()) }),
    );
    setStatus('opened');
  };

  const handleCopy = () => {
    // Clipboard access can be refused; the address stays visible to select by hand.
    navigator.clipboard
      .writeText(STUDIO_EMAIL)
      .then(() => setStatus('copied'))
      .catch(() => setStatus('copyFailed'));
  };

  const describedBy = (field: ContactField) =>
    errors[field] ? `contact-${field}-error` : undefined;

  return (
    <form className={styles.form} noValidate aria-label={copy.label} onSubmit={handleSubmit}>
      <Field id="contact-name" label={copy.name} error={errors.name && copy.errors[errors.name]}>
        <input
          ref={nameRef}
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.nameMax}
          value={values.name}
          onChange={handleChange('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy('name')}
          className={styles.input}
        />
      </Field>

      <Field
        id="contact-message"
        label={copy.message}
        error={errors.message && copy.errors[errors.message]}
      >
        <textarea
          ref={messageRef}
          id="contact-message"
          name="message"
          rows={5}
          required
          maxLength={CONTACT_LIMITS.messageMax}
          value={values.message}
          onChange={handleChange('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
          className={`${styles.input} ${styles.textarea}`}
        />
      </Field>

      <div>
        <button type="submit" className={`${button.button} ${styles.submit}`}>
          {copy.submit}
          <Mail size={17} className={button.arrow} aria-hidden="true" />
        </button>

        <div role="status" aria-live="polite" className={styles.statusRegion}>
          {status !== 'idle' && (
            <p className={styles.status} data-tone={status === 'copyFailed' ? 'error' : 'success'}>
              {status === 'copyFailed' ? (
                <CircleAlert size={18} aria-hidden="true" />
              ) : (
                <CircleCheck size={18} aria-hidden="true" />
              )}
              {copy[status]}
            </p>
          )}
        </div>
      </div>

      <div className={styles.direct}>
        <p>
          {copy.direct}{' '}
          <a href={`mailto:${STUDIO_EMAIL}`} className={styles.address}>
            {STUDIO_EMAIL}
          </a>
        </p>
        <button type="button" className={styles.copy} onClick={handleCopy}>
          <Copy size={15} aria-hidden="true" />
          {copy.copy}
        </button>
      </div>

      <p className={styles.privacy}>{copy.privacy(STUDIO_EMAIL)}</p>
    </form>
  );
}
