const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwellcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alexalves5000@gmail.com',
        subject: 'Boas Vindas - Task Manager',
        text: 'Olá ' + name + ' seja bem vindo ao app Task Manager!'
    })
    .then(() => {
        console.log('Email enviado')
    })
    .catch((e) => {
        console.error(e)
    })
}

const sendcancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alexalves5000@gmail.com',
        subject: 'Sentiremos sua falta!',
        text: 'Olá ' + name + ', é uma pena que tenha tomado a decisão de cancelar a sua conta no Task Manager, mas ficaremos esperando o seu retorno!'
    })
    .then(() => {
        console.log('Email enviado')
    })
    .catch((e) => {
        console.error(e)
    })
}

module.exports = {
    sendwellcomeEmail,
    sendcancelationEmail
}


// const msg = {
//     to: 'alexalves5000@gmail.com', // Change to your recipient
//     from: 'alexalves5000@gmail.com', // Change to your verified sender
//     subject: 'Aula 131',
//     text: 'Este é um email de teste.',
//     html: '<strong>Teste de envio de email</strong>',
//   }

// sgMail.send(msg)
//     .then(() => {
//         console.log('Email enviado')
//     })
//     .catch((e) => {
//         console.error(e)
//     })