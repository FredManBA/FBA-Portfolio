import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { WorldsSection } from './WorldsSection';

async function openProject(name: string) {
  const user = userEvent.setup();
  renderWithProviders(<WorldsSection />);
  const trigger = screen.getByRole('button', { name: `Ver detalles ${name}` });
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
    expect(within(dialog).getByRole('link', { name: /Abrir demo/ })).toHaveAttribute(
      'href',
      'https://techbuilder.pages.dev/',
    );
    expect(within(dialog).getAllByRole('link')).toHaveLength(1);
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
    const demo = within(dialog).getByRole('link', { name: /Abrir demo/ });

    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(demo).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(demo).toHaveFocus();
  });

  it('offers the demo without any access to the code', async () => {
    const { dialog } = await openProject('Code To Go');

    expect(within(dialog).getByText('En línea')).toBeInTheDocument();
    expect(within(dialog).queryByText(/código|GitHub/i)).not.toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Abrir demo/ })).toHaveAttribute(
      'href',
      'https://code-to-go.vercel.app/',
    );
  });

  it('links the studio’s public tools to their GitHub repository', async () => {
    const { dialog } = await openProject('Tab Twins');

    expect(within(dialog).getByRole('link', { name: /Ver en GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/Aigen1111/tab-twins',
    );
  });

  it('switches between the screenshots of a gallery', async () => {
    const { user, dialog } = await openProject('Deep Dive Fishing');

    const picker = within(dialog).getByRole('list', { name: 'Capturas' });
    const thumbs = within(picker).getAllByRole('button');
    expect(thumbs).toHaveLength(4);
    // It opens on the cover, the underwater wreck, which is third in the gallery.
    expect(thumbs[2]).toHaveAttribute('aria-current', 'true');
    expect(within(dialog).getByRole('img', { name: /naufragio/ })).toBeInTheDocument();

    await user.click(within(picker).getByRole('button', { name: 'Ver captura 4 de 4' }));

    expect(thumbs[3]).toHaveAttribute('aria-current', 'true');
    expect(thumbs[2]).not.toHaveAttribute('aria-current');
    expect(within(dialog).getByRole('img', { name: /Reina de la Cueva/ })).toBeInTheDocument();
  });

  it('shows no screenshot picker for a single screenshot', async () => {
    const { dialog } = await openProject('Code To Go');

    expect(within(dialog).queryByRole('list', { name: 'Capturas' })).not.toBeInTheDocument();
  });

  it('offers to play a released game', async () => {
    const { dialog } = await openProject('Tiny Kingdoms');

    expect(within(dialog).getByText('Jugable')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Jugar ahora/ })).toHaveAttribute(
      'href',
      'https://tiny-kingdoms.pages.dev/',
    );
  });
});
