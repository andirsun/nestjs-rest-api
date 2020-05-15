export interface BarbersPaymentsInterface{
  date : string,
  type : string, //PAYMENT | DISPERSION
  amount : number,
  paymentId : string,//Nequi reference code
  ip : string,
}