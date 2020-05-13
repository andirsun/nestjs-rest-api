export interface Card {
    readonly id:number,
    readonly favorite : boolean,
    readonly type: string,
    readonly nameCard : string,
    readonly lastName : string,
    readonly cardNumber : string,
    readonly monthExpiraton : string,
    readonly yearExpiration : string,
    readonly last4Numbers : string,
    readonly cvc:string,
    readonly franchise:string
};