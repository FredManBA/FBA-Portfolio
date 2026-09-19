import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ContactForm } from './ContactForm';

async function fillForm(user: ReturnType<typeof userEvent.setup>, email = 'ana@example.com') {
  await user.type(screen.getByLabelText('Nombre'), 'Ana Mora');
  await user.type(screen.getByLabelText('Correo'), email);
  await user.type(screen.getByLabelText('Mensaje'), 'Quiero cotizar un sitio web.');
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

  it('shows the demo notice without sending anything', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(
      screen.getByText('Demo visual — este formulario no realiza envíos.'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Mensaje')).toHaveValue('Quiero cotizar un sitio web.');
  });
});
