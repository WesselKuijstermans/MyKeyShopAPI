const hardware = require("../models/hardware.model")(); // note we need to call the model caching function
const User = require("../models/user.model")(); // note we need to call the model caching function

const neo = require("../../neo");

const errors = require("../errors");

class HardwareControllerHelper {
  constructor(hardware) {
    this.hardware = hardware;
  }
  getOne = async (id) => {
    const entity = await this.hardware.findById(id);
    return entity;
  };
}

async function purchase(req, res) {
  // check whether request is valid
  if (!req.body.user) {
    throw new errors.EntityNotFoundError(
      "User is required to purchase a piece of hardware hardware"
    );
  }

  // get the hardware from the db and check whether we have such a hardware
  const hardware = await hardware.findById(req.params.id);
  if (!hardware) {
    throw new errors.EntityNotFoundError(
      `hardware with id '${req.params.id}' not found`
    );
  }

  // add the hardware to the bought list of the user
  const user = await User.findOne({ name: req.body.user });

  // maybe not necessary any more now that we store it in neo?
  // BEWARE: atomicity issues!
  user.bought.push(hardware._id);
  await user.save();

  // open a neo session
  const session = neo.session();

  // store the purchase in neo
  await session.run(neo.purchaseHardware, {
    hardwareId: hardware._id.toString(),
    userId: user._id.toString(),
  });

  // close the neo session
  session.close();

  res.status(201).end();
}

module.exports = HardwareControllerHelper;
