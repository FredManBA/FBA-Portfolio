import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { TechnologiesSection } from './TechnologiesSection';

function visibleTechnologies() {
  const section = screen.getByRole('region', { name: 'Tecnologías' });
  return within(section)
    .getAllByRole('listitem')
    .map((item) => item.textContent);
}

describe('technologies', () => {
  it('shows a first selection and expands to the full list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TechnologiesSection />);

    expect(visibleTechnologies()).toHaveLength(12);
    expect(visibleTechnologies()).toContain('React');
    expect(visibleTechnologies()).not.toContain('GitHub Actions');

    const toggle = screen.getByRole('button', { name: 'Ver todas' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Ver menos');
    expect(visibleTechnologies()).toHaveLength(23);
    // Monogram icons are decorative text, so match the name inside the joined items.
    const allNames = visibleTechnologies().join(' | ');
    for (const name of ['GitHub Actions', 'Cloudflare D1', 'Drizzle ORM', 'HTML5', 'CSS3']) {
      expect(allNames).toContain(name);
    }

    await user.click(toggle);

    expect(toggle).toHaveAccessibleName('Ver todas');
    expect(visibleTechnologies()).toHaveLength(12);
  });

  it('never ranks or rates technologies', () => {
    renderWithProviders(<TechnologiesSection />);

    const section = screen.getByRole('region', { name: 'Tecnologías' });
    expect(within(section).queryByRole('progressbar')).not.toBeInTheDocument();
    expect(section).not.toHaveTextContent(/%|experto|intermedio|principiante/i);
  });
});
