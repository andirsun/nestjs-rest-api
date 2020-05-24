export class LoginUserDTO {
  readonly phone : string;
  readonly email : string;
  readonly name : string;
  readonly img : string;
  /* APPLE | GOOGLE | FACEBOOK | PHONE */
  readonly method : string;
}