import { describe, expect, it } from 'vitest';
import { validateContact } from './contact';

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
