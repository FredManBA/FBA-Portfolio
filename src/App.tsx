import { ContactSection } from './components/contact/ContactSection';
import { CosmosDefs } from './components/cosmos/CosmosDefs';
import { Hero } from './components/hero/Hero';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { MAIN_CONTENT_ID, SkipLink } from './components/layout/SkipLink';
import { MotionProvider } from './components/motion/MotionProvider';
import { WorldsSection } from './components/projects/WorldsSection';
import { TeamSection } from './components/team/TeamSection';
import { LanguageProvider } from './i18n/LanguageProvider';

export function App() {
  return (
    <LanguageProvider>
      <MotionProvider>
        <CosmosDefs />
        <SkipLink />
        <Header />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <Hero />
          <WorldsSection />
          <TeamSection />
          <ContactSection />
        </main>
        <Footer />
      </MotionProvider>
    </LanguageProvider>
  );
}
