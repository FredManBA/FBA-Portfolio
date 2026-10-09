import { describe, expect, it } from 'vitest';
import { buildMailto, validateContact } from './contact';

const valid = {
  name: 'Ana Mora',
  message: 'Quiero cotizar un sitio web.',
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('requires both fields and ignores surrounding spaces', () => {
    expect(validateContact({ name: '  ', message: '\n' })).toEqual({
      name: 'nameRequired',
      message: 'messageRequired',
    });
  });

  it('enforces minimum and maximum lengths', () => {
    expect(validateContact({ ...valid, name: 'A' }).name).toBe('nameTooShort');
    expect(validateContact({ ...valid, message: 'Hola' }).message).toBe('messageTooShort');
    expect(validateContact({ ...valid, message: 'x'.repeat(1001) }).message).toBe('messageTooLong');
  });
});

describe('buildMailto', () => {
  it('encodes the subject and the signed message', () => {
    const href = buildMailto(
      { name: ' Ana ', message: '¿Un juego & una web?' },
      { to: 'hola@example.com', subject: 'Propuesta de Ana' },
    );

    expect(href).toBe(
      'mailto:hola@example.com?subject=Propuesta%20de%20Ana&body=%C2%BFUn%20juego%20%26%20una%20web%3F%0A%0AAna',
    );
  });
});
