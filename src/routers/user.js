const express = require('express')              //carrega o express
const router = new express.Router()             //cria um objeto router atraves do express, para armazenar as rotas
const User = require('../models/user')          //cria o objeto User utilizando o mongoose que está no arquivo requerido

router.post('/users', async (req, res) => {     //cria um endpoint /users -> para criar um novo registro -> método post
    const user = new User(req.body)             //cria um instância user com o corpo da requisão que foi feita ao servidor
    try{
        await user.save()
        res.status(201).send(user) 
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {      // cria um endpoint /users para pesquisar todos os registros, método get
    try {
        const users = await User.find({})
        res.status(200).send(users)             // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição

    try {
        const user = await User.findById({_id})
        if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.status(200).send(user)         // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)                       //a constante updates recebe os dados que serão atualizados na requisição
    const allowedUpdates = ['name', 'email', 'password', 'age'] //cria uma constante com quais campos eu posso alterar no Banco de dados
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //verifica dentro da matriz se os campos recebidos pelo doby estão

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user =  await User.findByIdAndDelete(req.params.id)
        if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router         //exporta a rota para o aquivo index.js, assim o servido express consegue detectar a rota