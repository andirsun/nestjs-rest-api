/*
	The Data transfer object  helps to set the 
	info that will be send from request to the 
	backend, isnt neccesarty all the interface 
	info but the principal things
*/
export class CreateProductDTO {
  readonly id : number ;
  readonly descripcion : string ;
  readonly price : number;
  readonly benefits : string;
  readonly characteristics : string;
  readonly img : string;
  readonly deliveryDays : string;
  readonly phone : number 
}