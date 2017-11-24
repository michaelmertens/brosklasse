import { Request, Response } from 'express-serve-static-core';
import { ICodeReservationRequest, IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as errorHandler from '../utils/error-service';
import * as logService from '../utils/log-service';
import * as registrationService from '../services/registration-service';
import { ErrorCodes, getErrorMessageForClient } from '../utils/error-service';
import { constants } from '../config';
const logger = logService.getLogger('[registration-controller]');


/**
 * Read
 */
export async function checkCode(req: Request, res: Response) {
  const code: string = req.params.code;
  try {
    if (code === constants.ADMIN_CODE) {
      res.status(400).send(getErrorMessageForClient(ErrorCodes.REDIRECT_ADMIN));
      return;
    }

    const isValidCode = await registrationService.isValidCode(code);
    if (!isValidCode) {
      res.status(404).send();
      return;
    }

    res.status(200).send({});
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}

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
    const username = req.query.by;
    if (username) {
      const response = await registrationService.getAllMyRegistrations(username);
      res.send(response);
    } else {
      const response = await registrationService.getAllRegistrations();
      res.send(response);
    }
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}


/**
 * Write
 */
export async function generateCode(req: Request, res: Response) {
  try {
    const reservationRequest: ICodeReservationRequest = req.body;

    const newRegistration = await registrationService.generateNewRegistrationCode(reservationRequest);
    logger.info(`New code was generated for ${reservationRequest.email} by ${reservationRequest.createdBy}.`)

    res.send(newRegistration);
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}

export async function registerCode(req: Request, res: Response) {
  const code: string = req.params.code;
  const registrationSpec: IRegistrationRequest = req.body;

  try {
    const newRegistration = await registrationService.registerCode(code, registrationSpec);
    res.send(newRegistration);
  } catch (err) {
    errorHandler.handleError(res, logger)(err);
  }
}
