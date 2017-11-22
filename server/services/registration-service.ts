import { IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as registrationRepository from './../repositories/registration-repository';
import * as logService from '../utils/log-service';
import { IRegistration } from '../repositories/db-models';
import { generateRandomString } from '../utils/common';
import { ErrorTypes, ServerError } from '../utils/error-service';
const logger = logService.getLogger('[registration-service]');

/**
 * Read
 */
export async function getRegistrationByCode(code: string): Promise<IRegistration> {
  return await registrationRepository.getRegistrationByCode(code);
}

export async function getAllRegistrations(): Promise<IRegistration[]> {
  const registrations = await registrationRepository.getAllRegistrations();
  return registrations;
}

/**
 * Write
 */
export async function generateNewRegistrationCode(): Promise<IRegistration> {
  const newCode = generateRandomString(6).toUpperCase();
  return await registrationRepository.createRegistrationRecord(newCode);
}

export async function registerCode(code: string, request: IRegistrationRequest): Promise<IRegistration> {
  // Validation
  let registration = await registrationRepository.getRegistrationByCode(code);
  if (!registration) {
    throw new ServerError(ErrorTypes.ERROR_ENTITY_NOT_FOUND);
  }

  // Application Logic
  registration.registeredAt = new Date();
  registration.email = request.email;
  registration.tracking = registration.tracking || {};
  registration.tracking.nrOfNoClick = request.nrOfNoClicks;
  registration.tracking.openedPageAt = request.openedPageAt;

  // Delegate to repositories
  return registrationRepository.save(registration);
}