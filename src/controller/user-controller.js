import userServices from "../service/user-services.js";

const register = async (req, res, next) => {
  try {
    const result = await userServices.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userServices.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await userServices.get(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const requestBody = req.body;
    requestBody.username = username;
    const result = await userServices.update(requestBody);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await userServices.logout(username);
    res.status(200).json({
      data: "Ok",
    });
  } catch (e) {
    next(e);
  }
};

export default { register, login, get, update, logout };
