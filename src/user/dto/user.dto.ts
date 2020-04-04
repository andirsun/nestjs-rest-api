export class CreateUserDTO {
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