import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { Reveal } from '../ui/Reveal';
import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id={SECTION_IDS.contact} className={styles.section} aria-labelledby="contact-title">
      <div className="container">
        <Reveal className={styles.slab}>
          <div className={styles.fluid} aria-hidden="true" />
          <div className={styles.copy}>
            <h2 id="contact-title" className={styles.title}>
              {t.contact.title}
            </h2>
            <p className={styles.intro}>{t.contact.intro}</p>
          </div>
          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
