/*
	The Data transfer object  helps to set the 
	info that will be send from request to the 
	backend, isnt neccesarty all the interface 
	info but the principal things
*/
export class CreatePartnerDTO {
	readonly id: number;
	readonly appName: string;
	readonly phone: string;
	readonly email: string;
	readonly landLine : number;
	readonly businessName : string;
	readonly password :string
}