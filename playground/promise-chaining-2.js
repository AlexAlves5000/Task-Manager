require('../src/db/mongoose')               //aqui faço minha conexão com o db
const Task = require('../src/models/task')  //aqui carrego o meu modelo de db usando o mongoose - na verdade parece criar uma instância do meu db

Task.deleteOne({_id: '625ecb092b6f6560986e9317'}).then((task) => {
    console.log(task)
    return Task.countDocuments({ completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})

