export interface IRegistrationRequest {
  code: string;
  email: string;
  nrOfNoClicks: number;
  openedPageAt: Date;
}

export interface ICodeReservationRequest {
  email?: string;
}
