import { Hero } from './components/hero/Hero';
import { Header } from './components/layout/Header';
import { MAIN_CONTENT_ID, SkipLink } from './components/layout/SkipLink';
import { MotionProvider } from './components/motion/MotionProvider';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { TechnologiesSection } from './components/technologies/TechnologiesSection';
import { LanguageProvider } from './i18n/LanguageProvider';

export function App() {
  return (
    <LanguageProvider>
      <MotionProvider>
        <SkipLink />
        <Header />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <Hero />
          <ProjectsSection />
          <TechnologiesSection />
        </main>
      </MotionProvider>
    </LanguageProvider>
  );
}
