//Cuando es la interfaz de un documento debo extends document 

import { Document } from 'mongoose';
export interface Feedback extends Document{ 
    updated: string,
    idUser: string,
    nameUser: string,
    feedback: string
}