
export interface IRegistrationTO {
  _id: string;
  code: string;
  email?: string;
  registeredAt?: Date;

  createdBy: string;
  reservedFor?: string;
}

export interface IRegistrationRequest {
  code: string;
  email: string;
  nrOfNoClicks: number;
  openedPageAt: Date;
}

export interface ICodeReservationRequest {
  createdBy: string;
  email?: string;
}
