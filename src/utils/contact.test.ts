import { describe, expect, it } from 'vitest';
import { buildMailtoUrl, validateContact } from './contact';

const valid = {
  name: 'Ana Mora',
  email: 'ana@example.com',
  message: 'Quiero cotizar un sitio web.',
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('requires every field and ignores surrounding spaces', () => {
    expect(validateContact({ name: '  ', email: '', message: '\n' })).toEqual({
      name: 'nameRequired',
      email: 'emailRequired',
      message: 'messageRequired',
    });
  });

  it.each(['ana', 'ana@', 'ana@example', 'ana @example.com', '@example.com'])(
    'rejects the invalid email "%s"',
    (email) => {
      expect(validateContact({ ...valid, email }).email).toBe('emailInvalid');
    },
  );

  it('enforces minimum and maximum lengths', () => {
    expect(validateContact({ ...valid, name: 'A' }).name).toBe('nameTooShort');
    expect(validateContact({ ...valid, message: 'Hola' }).message).toBe('messageTooShort');
    expect(validateContact({ ...valid, message: 'x'.repeat(4001) }).message).toBe('messageTooLong');
  });
});

describe('buildMailtoUrl', () => {
  it('addresses the public email with the name, email and message', () => {
    const url = new URL(
      buildMailtoUrl(valid, { subject: 'Mensaje de Ana Mora', name: 'Nombre', email: 'Correo' }),
    );

    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('codeservicecontact@gmail.com');
    expect(url.searchParams.get('subject')).toBe('Mensaje de Ana Mora');
    expect(url.searchParams.get('body')).toBe(
      'Quiero cotizar un sitio web.\r\n\r\nNombre: Ana Mora\r\nCorreo: ana@example.com',
    );
  });
});
