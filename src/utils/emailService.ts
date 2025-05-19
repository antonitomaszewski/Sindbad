export const sendEmail = (to: string, subject: string, body: string)  =>{
    // Tu w prawdziwej aplikacji byłaby integracja z serwisem email (np. nodemailer)
    // Na razie tylko logujemy do konsoli
    console.log(`Wysyłam email do: ${to}\nTemat: ${subject}\nTreść: ${body}`);
}