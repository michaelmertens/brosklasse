import { Request, Response } from 'express-serve-static-core';
import { IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as errorHandler from '../utils/error-service';
import * as logService from '../utils/log-service';
import * as registrationService from '../services/registration-service';
const logger = logService.getLogger('[registration-controller]');


/**
 * Read
 */
export async function getRegistrationByCode(req: Request, res: Response) {
  const code: string = req.params.code;

  try {
    const response = await registrationService.getRegistrationByCode(code);
    res.send(response);
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}

export async function getAllRegistrations(req: Request, res: Response) {
  try {
    const response = await registrationService.getAllRegistrations();
    res.send(response);
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}


/**
 * Write
 */
export async function generateCode(req: Request, res: Response) {
  try {
    const newRegistration = await registrationService.generateNewRegistrationCode();
    res.send(newRegistration);
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}

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
