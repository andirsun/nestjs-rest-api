/*
	The Data transfer object  helps to set the 
	info that will be send from request to the 
	backend, isnt neccesarty all the interface 
	info but the principal things
*/
export class CreatePartnerDTO {
	readonly id: number;
	readonly phoneToken:string;
	readonly updated: string;
	readonly name: string;
	readonly registrationCode :string;
	readonly phone: string;
	readonly birth: string;
	readonly email: string;
	readonly img: string;
	readonly numServices:string;
	readonly points: number;
	readonly status: boolean;
	readonly publicityMethod:string
}