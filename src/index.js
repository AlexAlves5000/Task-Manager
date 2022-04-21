const express = require('express')          //carrega a biblioteca express
require('./db/mongoose')                    //chama a conexão com o banco de dados
const User = require('./models/user')
const Task = require('./models/task')


const app = express()                       //cria o objeto app -> que é responsável pela execução do servidor
const port = process.env.PORT || 3000       //cria a porta que o servidor funcionará no navegador

app.use(express.json())

app.post('/users', (req, res) => {          //cria um endpoint /users -> para criar um novo registro -> método post
    const user = new User(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor

    user.save().then(() => {                //
        res.status(201).send(user)          // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    }).catch((e) => {                       //
        res.status(400).send(e)             // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.get('/users', (req, res) => {          // cria um endpoint /users para pesquisar todos os registros, método get
    User.find({}).then((users) => {        // pesquisa no DB usando o método do mongoose model.find({}) -> neste caso pesquisa tudo
        res.status(200).send(users)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(users)
    }).catch((e) => {                      //
        res.status(500).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição

    User.findById({_id}).then((user) => {  // pesquisa no DB usando o método do mongoose model.find({}) -> neste caso pesquisa tudo
        if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }

        res.status(200).send(user)         // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(user)
    }).catch((e) => {                      //
        res.status(404).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})


app.post('/tasks', (req, res) => {          //cria um endpoint /user
    const user = new Task(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor

    user.save().then(() => {                //
        res.staus(201).send(user)           // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    }).catch((e) => {                       //
        res.status(400).send(e)             // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.get('/tasks', (req, res) => {          // cria um endpoint /users para pesquisar todos os registros, método get
    Task.find({}).then((tasks) => {        // pesquisa no DB usando o método do mongoose model.find({}) -> neste caso pesquisa tudo
        res.status(200).send(tasks)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(tasks)
    }).catch((e) => {                      //
        res.status(500).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição
    
    Task.findById({_id}).then((tasks) => { // pesquisa no DB usando o método do mongoose model.find({}) -> neste caso pesquisa tudo
        if (!tasks) {                      // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
            return res.status(404).send()  // vamos retornar o status de erro 404
        }

        res.status(200).send(tasks)        // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
        console.log(tasks)
    }).catch((e) => {                      //
        res.status(404).send(e)            // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.listen(port, () => {                    //carrega o servidor para ficar 'escutando' a porta 3000
    console.log('Sever is up on port ' + port)
})


