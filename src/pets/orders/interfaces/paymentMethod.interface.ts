export interface PaymentMethodInterface {
  _id : string,
  id : string, //id to search in the user payment methods
  type : string, // Nequi | Card | Cash | PSE | Bancolombia
}