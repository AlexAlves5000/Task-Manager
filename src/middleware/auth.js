const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
   try {
        const token = req.header('Authorization').replace('Bearer ', '')            //a variável token recebe o header da solicitação, sem o texto 'Beare '
        const decoded = jwt.verify(token, '688722An@')                              //a variável decoded recebe um token recebido na solicitação que foi verificado
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}) //o user recebe um usuario existente e com token existente

        if (!user) {
            throw new Error()   // este erro será capturado pelo catch abaixo
        }
        
        req.user = user         //isso faz com que não haja necessidade fazer uma nova pesquisa para descobrir os dados do usuário
        next()
   } catch (e) {
        res.status(401).send({ error: "Please authenticate." })
   }
}

module.exports = auth