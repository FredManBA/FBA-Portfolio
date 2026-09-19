import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id={SECTION_IDS.contact} className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div>
          <SectionHeading id="contact-title" title={t.contact.title} intro={t.contact.intro} />
        </div>

        <Reveal delay={0.15} className={styles.formPanel}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
