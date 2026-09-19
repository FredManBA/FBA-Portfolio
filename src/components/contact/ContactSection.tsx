import { ArrowUpRight, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import { SiGithub, SiWhatsapp } from 'react-icons/si';
import { CONTACT } from '../../data/contact';
import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';

interface Channel {
  kind: 'whatsapp' | 'email' | 'github';
  label: string;
  value: ReactNode;
  href: string;
  icon: ReactNode;
  external: boolean;
}

// Lets long addresses wrap after the @ instead of mid-word on small screens.
const [EMAIL_USER, EMAIL_DOMAIN] = CONTACT.email.split('@');

export function ContactSection() {
  const { t } = useLanguage();

  const channels: Channel[] = [
    {
      kind: 'whatsapp',
      label: t.contact.whatsapp,
      value: CONTACT.whatsapp.label,
      href: CONTACT.whatsapp.url,
      icon: <SiWhatsapp size={20} />,
      external: true,
    },
    {
      kind: 'email',
      label: t.contact.email,
      value: (
        <>
          {EMAIL_USER}@<wbr />
          {EMAIL_DOMAIN}
        </>
      ),
      href: `mailto:${CONTACT.email}`,
      icon: <Mail size={20} />,
      external: false,
    },
    {
      kind: 'github',
      label: t.contact.github,
      value: CONTACT.github.label,
      href: CONTACT.github.url,
      icon: <SiGithub size={20} />,
      external: true,
    },
  ];

  return (
    <section id={SECTION_IDS.contact} className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div>
          <SectionHeading id="contact-title" title={t.contact.title} intro={t.contact.intro} />
          <Reveal delay={0.1}>
            <ul role="list" className={styles.channels} aria-label={t.contact.channelsLabel}>
              {channels.map((channel) => (
                <li key={channel.kind}>
                  <a
                    href={channel.href}
                    className={styles.channel}
                    data-kind={channel.kind}
                    {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className={styles.channelIcon} aria-hidden="true">
                      {channel.icon}
                    </span>
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{channel.label}</span>
                      <span className={styles.channelValue}>{channel.value}</span>
                    </span>
                    <ArrowUpRight size={18} className={styles.channelArrow} aria-hidden="true" />
                    {channel.external && <span className="sr-only">{t.projects.newTab}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className={styles.formPanel}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
