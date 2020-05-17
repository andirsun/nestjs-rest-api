export class CreateProductPresentationDTO {
  readonly reference : string;
  readonly status :string; // archived | outOfstock | available |unavailable 
  readonly sizes : string;
  readonly volume : string;
  readonly weigth : string;
  readonly stock : number;
  readonly description : string; //could be color, taste or other caracteristic   
  readonly price : number;
}