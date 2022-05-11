// ESTE ARQUIVO CONTEM O MODELO DO BANCO DE DADOS DE USUÁRIOS

const bcrypt = require('bcryptjs/dist/bcrypt')
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true                  // recurso do mongoose que retira os espaços do nome digitado
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,            //recurso do mongoose que coloca todas as letras em minunsculas
        validate(value) {           //aqui usamos o validate q é do mongoose juntamente com a biblioteca validator, para verificar se o valor é um email
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Idade deve ser um número positivo!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 6,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('The password cannot contain the word password!')
            }
        }
    }
})

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {                          // verifica se o campo password foi alterado, se sim faz o hash da nova senha.
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User