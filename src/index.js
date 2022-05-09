const express = require('express')          //carrega a biblioteca express
require('./db/mongoose')                    //chama a conexão com o banco de dados
const User = require('./models/user')
const Task = require('./models/task')

const app = express()                       //cria o objeto app -> que é responsável pela execução do servidor
const port = process.env.PORT || 3000       //cria a porta que o servidor funcionará no navegador

app.use(express.json())

app.post('/users', async (req, res) => {          //cria um endpoint /users -> para criar um novo registro -> método post
    const user = new User(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor
    try{
        await user.save()
        res.status(201).send(user) 
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {          // cria um endpoint /users para pesquisar todos os registros, método get
    try {
        const users = await User.find({})
        res.status(200).send(users)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/users/:id', async (req, res) => {
    
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

app.post('/tasks', async(req, res) => {          //cria um endpoint /user
    const task = new Task(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor

    try {
        await task.save()
        res.staus(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/tasks', async (req, res) => {          // cria um endpoint /users para pesquisar todos os registros, método get
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição
    
    try {
        const task = await Task.findById({_id})
        if (!task) {                      // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }
        res.status(200).send(task)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(task)
    } catch (e) {
        res.status(404).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    }
})

app.listen(port, () => {                    //carrega o servidor para ficar 'escutando' a porta 3000
    console.log('Sever is up on port ' + port)
})


