// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb+srv://taskapp:688722Ab@cluster0.ka4yck8.mongodb.net/?retryWrites=true&w=majoritymongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Não foi possivel conectar a um servidor!')
    }

    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        description: 'Fazer exercícios'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})