const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'Red12345'
    const hashePassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashePassword)

    const isMatch = await bcrypt.compare(password, hashePassword)
    console.log(isMatch)
}

myFunction()