export class CreateUserPetsDTO {
    readonly id: number;
    readonly phoneToken:string;
    readonly updated: string;
    readonly name: string;
    readonly registrationCode :string;
    readonly phone: number;
    readonly birth: string;
    readonly email: string;
    readonly img: string;
    readonly numOrders:number;
    readonly points: number;
    readonly status: boolean;
    readonly publicityMethod:string
}