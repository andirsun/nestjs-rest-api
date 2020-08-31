export interface ProductInterfaceOrder {
  _id : string,
  idPartner : string,
  img :string,
  deliveryDays : number,
  name : string,
  descripcion : string,
  characteristics : string,
  benefits : string,
  presentations : [ProductPresentationOrder], 
}
interface ProductPresentationOrder {
  _id : string,
  urlImg : string
  reference : string,
  sizes : string,
  volume : string,
  weigth : string,
  description : string, //could be color, taste or other caracteristic 
  units : number, 
  price : number,
};