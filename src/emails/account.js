const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const msg = {
    to: 'alexalves5000@gmail.com', // Change to your recipient
    from: 'alexalves5000@gmail.com', // Change to your verified sender
    subject: 'Aula 131',
    text: 'Este é um email de teste.',
    html: '<strong>Teste de envio de email</strong>',
  }

sgMail.send(msg)
    .then(() => {
        console.log('Email enviado')
    })
    .catch((e) => {
        console.error(e)
    })