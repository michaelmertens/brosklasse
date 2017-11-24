import { ICodeReservationRequest, IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as registrationRepository from './../repositories/registration-repository';
import * as logService from '../utils/log-service';
import { generateRandomString } from '../utils/common';
import { ErrorCodes, ServerError } from '../utils/error-service';
import { IRegistration } from '../repositories/db-models';
const logger = logService.getLogger('[registration-service]');

/**
 * Read
 */
export async function isValidCode(code: string): Promise<boolean> {
  const registration = await registrationRepository.getRegistrationByCode(code);
  return (registration && !registration.email);
}

export async function getRegistrationByCode(code: string): Promise<IRegistration> {
  return await registrationRepository.getRegistrationByCode(code);
}

export async function getAllRegistrations(): Promise<IRegistration[]> {
  const registrations = await registrationRepository.getAllRegistrations();
  return registrations;
}

export async function getAllMyRegistrations(user: string): Promise<IRegistration[]> {
  const registrations = await registrationRepository.getRegistrationByCreator(user);
  return registrations;
}

/**
 * Write
 */
export async function generateNewRegistrationCode(emailReservation: ICodeReservationRequest): Promise<IRegistration> {
  const newCode = generateRandomString(7).toUpperCase();
  return await registrationRepository.createRegistrationRecord(newCode, emailReservation.createdBy, emailReservation.email);
}

export async function registerCode(code: string, request: IRegistrationRequest): Promise<IRegistration> {
  // Validation
  let registration = await registrationRepository.getRegistrationByCode(code);
  if (!registration) {
    throw new ServerError(ErrorCodes.ERROR_ENTITY_NOT_FOUND);
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