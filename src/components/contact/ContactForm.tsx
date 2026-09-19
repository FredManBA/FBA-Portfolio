import { CircleAlert, Info, Send } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../../utils/contact';
import button from '../ui/button.module.css';
import styles from './ContactForm.module.css';

const EMPTY_VALUES: ContactValues = { name: '', email: '', message: '' };

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

export function ContactForm() {
  const { t } = useLanguage();
  const copy = t.contact.form;
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange =
    (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Once the visitor tried to send, errors update as they type.
      if (attempted) {
        setErrors(validateContact(next));
      }
      setShowDemoNotice(false);
    };

  // Visual demo only: validates locally and never sends, stores or opens anything.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateContact(values);
    setAttempted(true);
    setErrors(nextErrors);

    const firstInvalid = CONTACT_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const refs = { name: nameRef, email: emailRef, message: messageRef };
      refs[firstInvalid].current?.focus();
      setShowDemoNotice(false);
      return;
    }

    setShowDemoNotice(true);
  };

  const describedBy = (field: ContactField) =>
    errors[field] ? `contact-${field}-error` : undefined;

  return (
    <form className={styles.form} noValidate aria-label={copy.label} onSubmit={handleSubmit}>
      <div className={styles.row}>
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
          id="contact-email"
          label={copy.email}
          error={errors.email && copy.errors[errors.email]}
        >
          <input
            ref={emailRef}
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={CONTACT_LIMITS.emailMax}
            value={values.email}
            onChange={handleChange('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={styles.input}
          />
        </Field>
      </div>

      <Field
        id="contact-message"
        label={copy.message}
        error={errors.message && copy.errors[errors.message]}
      >
        <textarea
          ref={messageRef}
          id="contact-message"
          name="message"
          rows={6}
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
        <button type="submit" className={`${button.button} ${button.primary} ${styles.submit}`}>
          {copy.submit}
          <Send size={17} className={button.arrow} aria-hidden="true" />
        </button>

        <div role="status" aria-live="polite" className={styles.statusRegion}>
          {showDemoNotice && (
            <p className={styles.status} data-tone="info">
              <Info size={18} aria-hidden="true" />
              {copy.demoNotice}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
