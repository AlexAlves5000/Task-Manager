const express = require('express')              //carrega o express
const router = new express.Router()             //cria um objeto router atraves do express, para armazenar as rotas
const User = require('../models/user')          //cria o objeto User utilizando o mongoose que está no arquivo requerido
const auth = require('../middleware/auth')      //Carrega o middleware criado no arquivo auth.js, depois é só incluir o auth como segundo argumento na rota
const Task = require('../models/task')
const multer = require('multer')
const sharp = require('sharp')

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
        // res.send({user: user.getPublicProfile(), token})    //retorna o usuário e o token. a função getPublicProfile é declarada(criada) dentro de models/user.js
        res.send({user: user, token})    //retorna o usuário e o token. a função getPublicProfile é declarada(criada) dentro de models/user.js
    } catch (e){
        console.log(e)
        res.status(401).send()
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {   //tokens é uma array. O filter através da função vai encontrar o token q está logado
            return token.token !== req.token                    //retorna true para todos os tokens que estão logados em outro dispositivo
        })
        await req.user.save()                                   //Salva o usuário excluindo o token que fez o logout

        res.status(200).send()
    } catch {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        // req.user.tokens = req.user.tokens.filter((token) => {   //tokens é uma array. O filter através da função vai encontrar o token q está logado
        //     return token.token !== req.token                    //retorna true para todos os tokens que estão logados em outro dispositivo
        // })
        await req.user.save()                                   //Salva o usuário excluindo o token que fez o logout

        res.status(200).send()
    } catch {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {      
        res.status(200).send(req.user)   //uma vez que o middleware auth já autenticou o usuário, devemos só devolver os dados do usuário requisitado
})

// router.get('/users/:id', async (req, res) => {
    
//     const _id = req.params.id              // Cria uma variáve. _id que recebe o parâmetro id da requisição

//     try {
//         const user = await User.findById({_id})
//         if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
//             return res.status(404).send()  // vamos retornar o status de erro 404
//         }
//         res.status(200).send(user)         // usando o mongoose salvamos o corpo da requisição no banco de dados, neste caso é um novo usuário
//         console.log(user)
//     } catch (e) {
//         res.status(404).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)                       //a constante updates recebe os dados que serão atualizados na requisição
    const allowedUpdates = ['name', 'email', 'password', 'age'] //cria uma constante com quais campos eu posso alterar no Banco de dados
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //verifica dentro da matriz se os campos recebidos pelo doby estão

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const user = await User.findById(req.params.id) // o user(array) vai receber todos os campos do usuário do banco de dados encontrados por id
        const user = req.user // o user(array) vai receber todos os campos do usuário do banco de dados encontrados por id

        updates.forEach((update) => user[update] = req.body[update]) //aqui o user é alterado com os dados recebidos pelo updates o que for igual permanece, não sabemos quais campos serão alterados

        await user.save() //salvamos o user altedado no banco de dados assim conseguimos executar o middleware (pre) - 'save' do aquivo que usamos o mongoose

        // if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
        //     return res.status(404).send()  // vamos retornar o status de erro 404
        // }
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user =  await User.findByIdAndDelete(req.user._id)
        // if (!user) {                       // aqui criamos uma verificação seu foi encontrado o usuário procurado, se não existe
        //     return res.status(404).send()  // vamos retornar o status de erro 404
        // }

        await req.user.remove()             //o método remove do express deleta o documento, neste caso o usuário que foi previamente autenticado, através do middleware auth
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Upload only files .jpg, .jpeg and png!'))
        }
        
        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
    
})

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() //formata a imagem antes de gravar
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {                         //Função para tratar erros na rota
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {                         //Função para tratar erros na rota
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router         //exporta a rota para o aquivo index.js, assim o servido express consegue detectar a rota