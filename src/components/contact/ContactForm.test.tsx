import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STUDIO_EMAIL } from '../../data/site';
import { renderWithProviders } from '../../test/render';
import { openMailApp } from '../../utils/contact';
import { ContactForm } from './ContactForm';

vi.mock('../../utils/contact', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/contact')>()),
  openMailApp: vi.fn(),
}));

const MESSAGE_LABEL = '¿Qué quieres construir?';
const SUBMIT = 'Abrir en mi correo';

describe('contact form', () => {
  beforeEach(() => {
    vi.mocked(openMailApp).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('validates both fields and focuses the first invalid one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole('button', { name: SUBMIT }));

    expect(screen.getByText('Escribe tu nombre.')).toBeInTheDocument();
    expect(screen.getByText('Cuéntanos qué quieres construir.')).toBeInTheDocument();
    const name = screen.getByLabelText('Nombre');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Escribe tu nombre.');
    expect(openMailApp).not.toHaveBeenCalled();
  });

  it('opens the visitor mail app with the subject and signed message filled in', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await user.type(screen.getByLabelText('Nombre'), 'Ana Mora');
    await user.type(screen.getByLabelText(MESSAGE_LABEL), 'Queremos un juego para nuestra marca.');

    await user.click(screen.getByRole('button', { name: SUBMIT }));

    expect(openMailApp).toHaveBeenCalledOnce();
    const [href] = vi.mocked(openMailApp).mock.calls[0] ?? [''];
    const url = new URL(href);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(STUDIO_EMAIL);
    expect(url.searchParams.get('subject')).toBe(
      'Propuesta de Ana Mora desde la web de Needy Friends',
    );
    expect(url.searchParams.get('body')).toBe('Queremos un juego para nuestra marca.\n\nAna Mora');
    expect(screen.getByRole('status')).toHaveTextContent('Abrimos tu aplicación de correo');
  });

  it('shows the studio address with a copy button and a privacy note', async () => {
    // user-event installs its own clipboard stub on setup.
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    expect(screen.getByRole('link', { name: STUDIO_EMAIL })).toHaveAttribute(
      'href',
      `mailto:${STUDIO_EMAIL}`,
    );
    expect(screen.getByText(/Solo lo usamos para responderte/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copiar correo' }));

    expect(await screen.findByText('Correo copiado.')).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe(STUDIO_EMAIL);
  });

  it('explains how to copy by hand when the clipboard is refused', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole('button', { name: 'Copiar correo' }));

    expect(await screen.findByText(/No se pudo copiar/)).toBeInTheDocument();
  });
});
