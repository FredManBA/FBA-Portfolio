import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { openMailClient, WEB3FORMS_ENDPOINT } from '../../utils/contact';
import { ContactForm } from './ContactForm';

vi.mock('../../utils/contact', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/contact')>()),
  openMailClient: vi.fn(),
}));

async function fillForm(user: ReturnType<typeof userEvent.setup>, email = 'ana@example.com') {
  await user.type(screen.getByLabelText('Nombre'), 'Ana Mora');
  await user.type(screen.getByLabelText('Correo'), email);
  await user.type(screen.getByLabelText('Mensaje'), 'Quiero cotizar un sitio web.');
}

function mockFetch(response: { ok: boolean; status?: number; body: unknown }) {
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      ok: response.ok,
      status: response.status ?? (response.ok ? 200 : 400),
      json: () => Promise.resolve(response.body),
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('contact form', () => {
  it('validates every field and focuses the first invalid one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(screen.getByText('Escribe tu nombre.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu correo.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu mensaje.')).toBeInTheDocument();
    const name = screen.getByLabelText('Nombre');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Escribe tu nombre.');
  });

  it('rejects an invalid email and clears the error once corrected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await fillForm(user, 'ana@example');

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    const email = screen.getByLabelText('Correo');
    expect(email).toHaveFocus();
    expect(email).toHaveAccessibleDescription(
      'Escribe un correo válido, por ejemplo nombre@dominio.com.',
    );

    await user.type(email, '.com');

    expect(email).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/Escribe un correo válido/)).not.toBeInTheDocument();
  });

  it('sends the message with Web3Forms and confirms it', async () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'test-key');
    const fetchMock = mockFetch({ ok: true, body: { success: true } });
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(await screen.findByText(/Mensaje enviado/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(JSON.parse(init.body as string)).toMatchObject({
      access_key: 'test-key',
      name: 'Ana Mora',
      email: 'ana@example.com',
      message: 'Quiero cotizar un sitio web.',
    });
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });

  it('shows an error with an email alternative when sending fails', async () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'test-key');
    mockFetch({ ok: false, status: 500, body: { success: false } });
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(await screen.findByText(/No se pudo enviar el mensaje/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Escribir por correo' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:codeservicecontact@gmail\.com\?subject=/),
    );
    expect(screen.getByLabelText('Mensaje')).toHaveValue('Quiero cotizar un sitio web.');
  });

  it('opens a prepared email when no Web3Forms key is configured', async () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '');
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    await waitFor(() => expect(openMailClient).toHaveBeenCalledTimes(1));
    const url = new URL(vi.mocked(openMailClient).mock.calls[0]?.[0] ?? '');
    expect(url.pathname).toBe('codeservicecontact@gmail.com');
    expect(url.searchParams.get('subject')).toBe('Mensaje de Ana Mora desde el portafolio');
    expect(url.searchParams.get('body')).toContain('Correo: ana@example.com');
    expect(screen.getByText(/Se abrió tu aplicación de correo/)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
