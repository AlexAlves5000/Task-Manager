const express = require('express')              //carrega o express
const router = new express.Router()             //cria um objeto router atraves do express, para armazenar as rotas
const Task = require('../models/task')          //cria o objeto Task utilizando o mongoose que está no arquivo requerido

router.post('/tasks', async(req, res) => {     //cria um endpoint /task
    const task = new Task(req.body)            //cria um instância task com o corpo da requisão que foi feita ao servidor

    try {
        await task.save()
        res.staus(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {    // cria um endpoint /tasks para pesquisar todos os registros, método get
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)           // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição
    
    try {
        const task = await Task.findById({_id})
        if (!task) {                      // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.status(200).send(task)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    } catch (e) {
        res.status(404).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)               //a constante updates recebe os dados que serão atualizados na requisição
    const allowedUpdates = ['description', 'completed'] //cria uma constante com quais campos eu posso alterar no Banco de dados
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //verifica dentro da matriz se os campos recebidos pelo doby estão

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' }) //trata o erro
    }

    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if (!task) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task =  await Task.findByIdAndDelete(req.params.id)
        if (!task) {                       // aqui verificamos se existe a tarefa que está sendo deletada
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router         //exporta a rota para o aquivo index.js, assim o servido express consegue detectar a rota