import { AuthValidation } from '../validation';
import { Toolbox } from '../util';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse, checkToken, verifyToken
} = Toolbox;
const {
  validateSignup, validateLogin
} = AuthValidation;
const {
  findByKey
} = GeneralService;
const {
  User
} = database;
const AuthMiddleware = {
  /**
   * middleware for user signup
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifySignup(req, res, next) {
    try {
      const { email } = req.body;
      validateSignup(req.body);
      const user = await findByKey(User, { email });
      if (user) return errorResponse(res, { code: 409, message: 'Sorry, this email address is in use by another user, kindly review email address' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for user login
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returened by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyLogin(req, res, next) {
    try {
      validateLogin(req.body);
      const { email } = req.body;
      const user = await findByKey(User, { email });
      if (!user) return errorResponse(res, { code: 404, message: 'email does not match anything in our database' });
      req.userData = user;
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * user authentication
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async authenticate(req, res, next) {
    try {
      const token = checkToken(req);
      if (!token) return errorResponse(res, { code: 401, message: 'Access denied, Token required' });
      req.tokenData = verifyToken(token);
      next();
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'The token provided was invalid' });
      }
    }
  },

};

export default AuthMiddleware;
