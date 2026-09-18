import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MotionProvider } from '../components/motion/MotionProvider';
import { LanguageProvider } from '../i18n/LanguageProvider';

function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <MotionProvider>{children}</MotionProvider>
    </LanguageProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}
