const route = require('express').Router();
const User = require('../models/User'); 
const logger = require('../logger')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route - Register User
route.post('/register', async(req, res) => {

  try {
    const {name, email, password,confirmpassword} = req.body;

  if(!name){
    return res.status(422).json({msg: "Nome é obrigatório"});
  }
  if(!email){
    return res.status(422).json({msg: "Email é obrigatório"});
  }
  if(!password){
    return res.status(422).json({msg: "Senha é obrigatório"});
  }
  if(password !== confirmpassword){
    return res.status(422).json({msg: "As senhas não conferem!"});
  }

  //check if user exist
  const userExist = await User.findOne({email : email})

  if (userExist) {
    return res.status(422).json({msg: "Por favor, utilize outro email!"});
  }

  //create password
  const salt = await bcrypt.genSalt(20);
  const passwordHash = await bcrypt.hash(password, salt);

  //create user
  const user = new User({
    name,
    email,
    password : passwordHash
  });

  await user.save();

  return res.status(201).json({msg: "Usuário foi criado com sucesso!"});
  } catch (error) {
      logger.error(error.stack)
      res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
  }
});

// Route - Login User
route.post('/user', async(req, res) => {

  try {
    const {email, password} = req.body;

  if(!email){
    return res.status(422).json({msg: "Email é obrigatório"});
  }
  if(!password){
    return res.status(422).json({msg: "Senha é obrigatório"});
  }

  const user = await User.findOne({email : email})

  if (!user) {
    return res.status(404).json({msg: "Usuário não encontrado!"});
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if(!checkPassword){
    return res.status(404).json({msg: "Senha invalida!"});
  }

  const secret = process.env.SECRET;

  const token = jwt.sign({
    id: user._id
  }, secret, {  expiresIn : 60 * 60} )

  res.status(200).header({Authorization: token}).json({msg: "Autenticação realizada com sucesso!"})

  } catch (error) {
      logger.error(error)
      res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
  }
});

module.exports = route;