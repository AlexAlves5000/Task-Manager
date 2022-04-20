const express = require('express')          //carrega a biblioteca express
require('./db/mongoose')                    //chama a conexão com o banco de dados
const User = require('./models/user')
const Task = require('./models/task')


const app = express()                       //cria o objeto app -> que é responsável pela execução do servidor
const port = process.env.PORT || 3000       //cria a porta que o servidor funcionará no navegador

app.use(express.json())

app.post('/users', (req, res) => {          //cria um endpoint /user
    const user = new User(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor

    user.save().then(() => {                //
        res.send(user)                      // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    }).catch((e) => {                       //
        res.status(400).send(e)             // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.post('/tasks', (req, res) => {          //cria um endpoint /user
    const user = new Task(req.body)         //cria um instância user com o corpo da requisão que foi feita ao servidor

    user.save().then(() => {                //
        res.send(user)                      // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
    }).catch((e) => {                       //
        res.status(400).send(e)             // enviamos uma resposta de erro, caso isso ocorra, inclusive enviando um código de erro
    })
})

app.listen(port, () => {                    //carrega o servidor para ficar 'escutando' a porta 3000
    console.log('Sever is up on port ' + port)
})


