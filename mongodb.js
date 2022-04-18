// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
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


    // db.collection('users').deleteMany({
    //     age: 11
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectId('62541f4123b9b1c1bcf0b261')
    // }, {
    //     $set: {
    //         name: 'Jarbas'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

})