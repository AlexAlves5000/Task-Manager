require('../src/db/mongoose')
const { count } = require('../src/models/user')
const User =require('../src/models/user')

// User.findByIdAndUpdate('625ebfddd3a1b4d048acb723', {age:1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('625ebfddd3a1b4d048acb723', 20).then ((count) => {
    console.log(count)
}).catch((e) => {
    console.log('Erro: ', e)
})