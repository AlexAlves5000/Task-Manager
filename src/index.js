const express = require('express')          //carrega a biblioteca express
require('./db/mongoose')                    //chama a conexão com o banco de dados
const userRouter = require('./routers/user')//chama o as rotas contidas no aquivo de rotas para usuários
const taskRouter = require('./routers/task')

const app = express()                       //cria o objeto app -> que é responsável pela execução do servidor
const port = process.env.PORT || 3000       //cria a porta que o servidor funcionará no navegador

// app.use((req, res, next) => {
//     if(req.method === "GET"){
//         res.send('GET request are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
//     // if(req !== null) {
//     //     res.status(503).send('Site off line, please try to later')
//     // } else {
//     //     next()
//     // }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {                    //carrega o servidor para ficar 'escutando' a porta 3000
    console.log('Sever is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     const user = await User.findById('630786765572cf934d0f21ba')
//     await user.populate('tasks')
//     // console.log(user.tasks)


//     // const task = await Task.findById('630786a75572cf934d0f21c6')
//     // await task.populate('owner') //.execPopulate()
//     // console.log(task.owner)
// }

// main()
