const jwt = require("jsonwebtoken")
const User = require("../models/user")
require('dotenv').config()


const auth = async (req, res, next) => {
   try {
        const token = req.header('Authorization').replace('Bearer ', '')            //a variável token recebe o header da solicitação, sem o texto 'Beare '
        const decoded = jwt.verify(token, process.env.SECRETWORD)                                //a variável decoded recebe um token recebido na solicitação que foi verificado
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}) //o user recebe um usuario existente e com token existente

        if (!user) {
            throw new Error()   // este erro será capturado pelo catch abaixo
        }
        
        req.token = token       //o toquem recebido polo req recebe o token limpo recebido acima 
        req.user = user         //isso faz com que não haja necessidade fazer uma nova pesquisa para descobrir os dados do usuário
        console. log(req.user.name + ' está logado!')
        next()
   } catch (e) {
        res.status(401).send({ error: "Please authenticate." })
   }
}

module.exports = auth