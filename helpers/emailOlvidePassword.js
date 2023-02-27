import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    // Enviar el email

    const { nombre, email, token } = datos;

    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu password en APV',
        text: 'Reestablece tu password en APV',
        html: `<p>Hola ${nombre},\n Has solicitado reestablecer tu password en APV.</p>
        <p>Tu cuenta está lista, solo debes comprobarla en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>

        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvidePassword;