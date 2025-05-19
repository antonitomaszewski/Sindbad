import { sendEmail } from '../../src/utils/emailService';

describe('emailService', () => {
  it('powinien logować poprawny komunikat do konsoli', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const to = 'test@example.com';
    const subject = 'Temat testowy';
    const body = 'Treść testowa';

    sendEmail(to, subject, body);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Wysyłam email do: ${to}\nTemat: ${subject}\nTreść: ${body}`
    );

    consoleSpy.mockRestore();
  });
});