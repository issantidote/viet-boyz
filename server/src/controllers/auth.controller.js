import * as Auth from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const user = await Auth.registerUser({ email: req.body.email, password: req.body.password });
    const { token } = await Auth.loginUser({ email: req.body.email, password: req.body.password });
    res.status(201).json({ user, token });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const data = await Auth.loginUser({ email: req.body.email, password: req.body.password });
    res.json(data);
  } catch (e) {
    next(e);
  }
}


