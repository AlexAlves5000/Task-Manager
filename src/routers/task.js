const express = require('express')              //carrega o express
const Task = require('../models/task')          //cria o objeto Task utilizando o mongoose que está no arquivo requerido
const auth = require('../middleware/auth')
const router = new express.Router()             //cria um objeto router atraves do express, para armazenar as rotas

router.post('/tasks', auth, async(req, res) => {     //cria um endpoint /task
    
    //cria um instância task com o corpo da requisão que foi feita ao servidor
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task) 
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=false --> rota que será filtrar do documentos
router.get('/tasks', auth, async (req, res) => {    // cria um endpoint /tasks para pesquisar todos os registros, método get
    console.log('entrou na rota get / tasks')
    
    try {
        await req.user.populate({
            path: 'tasks',
            match: {
                completed: false
            }
        }) //.execPopulate()
        res.send(req.user.tasks)
       
        // const tasks = await Task.find({ owner: req.user._id}) //busca as tarefas somente do usuário logado
        // res.status(200).send(tasks)           // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição
    
    try {
        const task = await Task.findOne({ _id, owner: req.user._id}) //busca uma tarefa especifia de um usuário logado
        // const task = await Task.findById({_id})
        if (!task) {                      // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.status(200).send(task)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    } catch (e) {
        res.status(404).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)               //a constante updates recebe os dados que serão atualizados na requisição
    const allowedUpdates = ['description', 'completed'] //cria uma constante com quais campos eu posso alterar no Banco de dados
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //verifica dentro da matriz se os campos recebidos pelo doby estão

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' }) //trata o erro
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {                       // aqui verificamos se existe a tarefa que está sendo deletada
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router         //exporta a rota para o aquivo index.js, assim o servido express consegue detectar a rota