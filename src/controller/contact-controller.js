import contactServices from "../service/contact-services.js";

const create = async (req, res, next) => {
  try {
    const contact = await contactServices.create(req.user, req.body);
    res.status(200).json({
      data: contact,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.id;
    const contact = await contactServices.get(user, contactId);
    res.status(200).json({
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.id = req.params.id;
    const contact = await contactServices.update(user, request);
    res.status(200).json({
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.id;
    const result = await contactServices.remove(user, contactId);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const user = req.user;
    const request = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      page: req.query.page,
      size: req.query.size,
    };
    const result = await contactServices.search(user, request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, get, update, remove, search };
