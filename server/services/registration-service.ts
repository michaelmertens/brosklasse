import { IRegistrationRequest } from '../../public/src/api-contracts/registration';
import * as registrationRepository from './../repositories/registration-repository';
import * as logService from '../utils/log-service';
const logger = logService.getLogger('[registration-service]');

export function registerCode(code: string, registartion: IRegistrationRequest) {
  // Validation
  registrationRepository.getRegistrationByCode(code)

  // Application Logic

  // Delegate to repositories
}
