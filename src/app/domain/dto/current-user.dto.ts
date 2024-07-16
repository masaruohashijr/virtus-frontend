export interface CurrentUser {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    role: string;
    iss: string;
    name: string;
    id: number;
    username: string;
    jti: string;
}
