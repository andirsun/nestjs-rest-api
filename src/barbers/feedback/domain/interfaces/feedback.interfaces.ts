import { Document } from 'mongoose';
export interface Feedback extends Document{ 
	updated: string,
	idUser: string,
	nameUser: string,
	feedback: string
}