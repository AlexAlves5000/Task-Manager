const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true

    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
         type: mongoose.Schema.Types.ObjectId,
         require: true,
         ref: 'User'                        //cria uma referência no DB entre a tarefa e o User - criado no model user.js
    }
}) 

module.exports = Task