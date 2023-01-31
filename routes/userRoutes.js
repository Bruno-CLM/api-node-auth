const route = require('express').Router();
const logger = require('../logger');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


route.get('/:id', checkToken, async(req, res) => {
  try {

    const id = req.params.id;

    const user = await User.findById(id, '-password');

    if(!user){
      return res.status(404).json({msg: "Usuário não encontrado!"});
    }

    return res.status(200).json({user})
  } catch (error) {
      console.log(error)
      logger.error(error)
      res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
  }
});

function checkToken(req, res, next){
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
  
    if(!token){
      return res.status(401).json({msg: "Acesso negado!"});
    }

    const secret = process.env.SECRET;
    
    jwt.verify(token, secret);

    next();
  } catch (error) {
    logger.error(error)
    res.status(500).json({msg: "Token invalido"});
  }
}

module.exports = route;