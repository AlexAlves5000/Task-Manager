const express = require('express')              //carrega o express
const router = new express.Router()             //cria um objeto router atraves do express, para armazenar as rotas
const User = require('../models/user')          //cria o objeto User utilizando o mongoose que está no arquivo requerido
const auth = require('../middleware/auth')      //Carrega o middleware criado no arquivo auth.js, depois é só incluir o auth como segundo argumento na rota

router.post('/users', async (req, res) => {     //cria um endpoint /users -> para criar um novo registro -> método post
    const user = new User(req.body)             //cria um instância user com o corpo da requisão que foi feita ao servidor
    try{
        const token = await user.genereteAuthToken()
        await user.save()
        res.status(201).send({user, token})
        // res.status(201).send(user) 
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) =>{
    // console.log(req.body.email, req.body.password) --> ok

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) //o findByCredentiails é uma função criada para verificar email e senha, vai retonar um usuário ou não
                                                                                     //é passado para a função o email e password que é passado no corpo da requisição
        const token = await user.genereteAuthToken()
        res.send({user, token})    //retorna o usuário e o token
    } catch (e){
        res.status(401).send()
    }
})

router.get('/users', auth, async (req, res) => {      // cria um endpoint /users para pesquisar todos os registros, método get
    try {
        const users = await User.find({})
        res.status(200).send(users)             // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
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
        const user = await User.findById(req.params.id) // o user(array) vai receber todos os campos do usuário do banco de dados encontrados por id

        updates.forEach((update) => user[update] = req.body[update]) //aqui o user é alterado com os dados recebidos pelo updates o que for igual permanece, não sabemos quais campos serão alterados

        await user.save() //salvamos o user altedado no banco de dados assim conseguimos executar o middleware (pre) - 'save' do aquivo que usamos o mongoose

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