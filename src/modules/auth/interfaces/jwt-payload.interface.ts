/* 
    Json Web Token Payload interface 
    do not store sensitive information like passwords in a JWT.
*/
export interface JwtPayload {
  phone: number;
}