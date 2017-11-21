import { Request, Response } from 'express-serve-static-core';
import { IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as errorHandler from '../utils/error-service';
import * as logService from '../utils/log-service';
import * as registrationService from '../services/registration-service';
const logger = logService.getLogger('[registration-controller]');

export async function registerCode(req: Request, res: Response) {
  const code: string = req.params.code;
  const registrationSpec: IRegistrationRequest = req.body;

  try {
    await registrationService.registerCode(code, registrationSpec);
    res.send({});
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}