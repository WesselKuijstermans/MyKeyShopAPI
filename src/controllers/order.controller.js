const neo = require("../../neo");

const hardware = require("../models/hardware.model")();
const Key = require("../models/key.model")();

const KeyControllerHelper = require("../controllers/key.controller");
const HardwareControllerHelper = require("../controllers/hardware.controller");

const KeyControllerHelperClass = new KeyControllerHelper(Key);
const HardwareControllerHelperClass = new HardwareControllerHelper(hardware);

class OrderControllerHelper {
  constructor(order) {
    this.order = order;
  }

  getAll = async (req, res, next) => {
    const entities = await this.order.find();
    res.status(200).json(entities);
  };

  create = async (req, res, next) => {
    const entity = new this.order(req.body);
    entity.totalPrice = await this.calculateTotalPrice(
      entity.products.gamekeys,
      entity.products.hardware
    );
    await entity.save();
    res.status(201).json({ id: entity.id });
  };

  calculateTotalPrice = async (gamekeys, hardware, next) => {
    let totalGamePrice = 0;
    let totalHardwarePrice = 0;
7
    if (gamekeys != undefined) {
      for (let key of gamekeys) {
        if (key != undefined) {
          const entity = await KeyControllerHelperClass.getOne(key);
          totalGamePrice += Number(entity.price);
        }
      }
      console.log("totalGamePrice", totalGamePrice);
    }

    if (hardware != undefined) {
      for (let item of hardware) {
        if (item != undefined) {
          const entity = await HardwareControllerHelperClass.getOne(item);
          totalHardwarePrice += Number(entity.price);
        }
      }
      console.log("totalHardwarePrice", totalHardwarePrice);
    }

    let totalPrice = totalGamePrice + totalHardwarePrice;
    console.log("totalPrice", totalPrice);
    return totalPrice;
  };
}

async function getOrders(query, req, res) {
  const session = neo.session();

  const result = await session.run(query, {
    userId: req.params.id,
  });

  // we only expect 1 row with results, containing an array of game ids in the field 'gameIds'
  // see the queries in neo.js for what is returned
  const orderIds = result.records[0].get("orderIds");

  session.close();

  const orders = await game.find({ _id: { $in: orderIds } });

  res.status(200).json(orders);
}

async function simple(req, res) {
  await getOrders(neo.recommendSimilar, req, res);
}

async function similar(req, res) {
  await getOrders(neo.recommendSimilarTwo, req, res);
}

async function keyed(req, res) {
  await getOrders(neo.recommendKeyed, req, res);
}

module.exports = OrderControllerHelper;
