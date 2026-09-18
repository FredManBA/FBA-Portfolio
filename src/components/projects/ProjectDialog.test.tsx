import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ProjectsSection } from './ProjectsSection';

async function openProject(name: string) {
  const user = userEvent.setup();
  renderWithProviders(<ProjectsSection />);
  const trigger = screen.getByRole('button', { name: `Ver proyecto ${name}` });
  await user.click(trigger);
  const dialog = await screen.findByRole('dialog', { name });
  return { user, trigger, dialog };
}

describe('project detail dialog', () => {
  it('opens from its card with the project details', async () => {
    const { dialog } = await openProject('TechBuilder');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription(
      'Workspace visual para explorar tecnologías, comparar alternativas y construir arquitecturas de software.',
    );
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText('39 tests aprobados')).toBeInTheDocument();
    expect(within(dialog).getByText('Cloudflare Pages')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Ver demo/ })).toHaveAttribute(
      'href',
      'https://techbuilder.pages.dev/',
    );
    expect(within(dialog).getByRole('link', { name: /Ver código/ })).toHaveAttribute(
      'href',
      'https://github.com/FredManBA/TechBuilder',
    );
  });

  it('closes with Escape and returns focus to the card', async () => {
    const { user, trigger } = await openProject('Costa Rica 360');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with its close button', async () => {
    const { user, dialog } = await openProject('Costa Rica 360');

    await user.click(within(dialog).getByRole('button', { name: 'Cerrar' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps keyboard focus inside the dialog', async () => {
    const { user, dialog } = await openProject('Costa Rica 360');
    const close = within(dialog).getByRole('button', { name: 'Cerrar' });
    const code = within(dialog).getByRole('link', { name: /Ver código/ });

    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(code).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(code).toHaveFocus();
  });

  it('shows private code without linking to the repository', async () => {
    const { dialog } = await openProject('Code To-Go');

    expect(within(dialog).getByText('Código privado')).toBeInTheDocument();
    expect(within(dialog).queryByRole('link', { name: /Ver código/ })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Ver demo/ })).toHaveAttribute(
      'href',
      'https://code-to-go.vercel.app/',
    );
  });
});
