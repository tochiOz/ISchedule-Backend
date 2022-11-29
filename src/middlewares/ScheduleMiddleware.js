import { GeneralValidation } from '../validation';
import { Toolbox } from '../util';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateId,
  validateParameters,
  validateSchedule
} = GeneralValidation;
const {
  findByKey,
  findMultipleByKey
} = GeneralService;
const {
  Schedule
} = database;

const ScheduleMiddleware = {
  /**
   * middleware validating schedule payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof ScheduleMiddleware
   */
  async verifyAvialability(req, res, next) {
    try {
      validateSchedule(req.body);
      const { availableDate } = req.body;
      const availableTime = await findMultipleByKey(Schedule, { availableDate });
      if (availableTime.length) {
        console.log(availableTime);
      }

      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof ScheduleMiddleware
   */
  async verifyAvialabilityPayload(req, res, next) {
    try {
      let availableTime;
      if (req.query.id || req.query.avialabilityId) {
        const id = req.query.id || req.query.avialabilityId;
        validateId({ id });
        availableTime = await findByKey(Schedule, { id });
        if (!availableTime) return errorResponse(res, { code: 404, message: 'Date is Not Found' });
      }

      req.availableTime = availableTime;
      if (req.body) validateParameters(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
};

export default ScheduleMiddleware;