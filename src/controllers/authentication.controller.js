const User = require("../models/user.model")();

const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const neo = require("../../neo");
const { ObjectId } = require("mongodb");

const ErrorController = require("./error.controller");
const CrudController = require("./crud")
const UserCrudController = new CrudController(User)
const RSA_PRIVATE_KEY = fs.readFileSync("jwtRS256.key");
function validateUser(email, password) {
  if (email && password) {
    return true;
  } else {
    return false;
  }
}

class authController {
  constructor(model) {
    this.model = model;
  }

  login = async (req, res, next) => {
    
    const user = await this.model.findOne({ email: req.body.email });

    if (user == undefined) {
      return res.status(401).json({
        message: "Email does not exist",
      });
    }
    console.log("dit werkt");
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(await user.toJSON(), RSA_PRIVATE_KEY);
      return res.status(200).json({
        message: "Succesvol ingelogd",
        user,
        token,
      });
    } else {
      return res.status(401).json({
        message: "Verkeerd wachtwoord",
      });
    }
  };
  register = async (req, res, next) => {
    delete req.body._id;
    let user = new this.model(req.body);

    user.password = await bcrypt.hash(req.body.password, 10);

    try {
      await user.save();
    } catch (error) {
      console.log(error);
      ErrorController.handleError(res, error);
      return;
    }

    console.log("saving user", user);
    if (user) {
      console.log("if user", user);
      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        expiresIn: "1d",
        subject: user._id.toString(),
      });

      const today = new Date();
      const date = new Date();
      date.setDate(today.getDate() + 1);

      res.status(200).json({
        token: jwtBearerToken,
        expires: date,
        user,
      });
    }
  };
  validate = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const secret = RSA_PRIVATE_KEY;
      console.log(secret);
      console.log(token);
      jwt.verify(token, secret);
      req.user = jwt.decode(token);
      next();
    } catch (e) {
      return res.status(401).send({
        code: 401,
        error: "Unauthorized ",
        message: "You are not signed in",
      });
    }
  };
}

module.exports = authController;
