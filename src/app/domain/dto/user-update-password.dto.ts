export class UserUpdatePasswordDTO {

    userId!: number;
    password: string | undefined;
    repeatedPassword: string | undefined;
}