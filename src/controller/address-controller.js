import addressServices from "../service/address-services.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const address = req.body;
    const contactId = req.params.contactId;
    const result = await addressServices.create(user, contactId, address);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const address = req.body;
    const contactId = req.params.contactId;
    const addressId = req.params.addressId;
    address.id = addressId;
    const result = await addressServices.update(user, contactId, address);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const addressId = req.params.addressId;
    const result = await addressServices.get(user, contactId, addressId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const result = await addressServices.list(user, contactId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const addressId = req.params.addressId;

    const result = await addressServices.remove(user, contactId, addressId);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default { create, update, get, list, remove };
