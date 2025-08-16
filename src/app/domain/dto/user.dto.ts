import { BaseDTO } from "../common/base.dto";
// RoleDTO pode gerar outro ciclo; tipa como type-only também
import type { RoleDTO } from "./role.dto";

export class UserDTO extends BaseDTO {
  name!: string | undefined;
  username!: string | undefined;
  password!: string | undefined;
  email!: string | undefined;
  mobile!: string | undefined;
  role!: RoleDTO | undefined; // apenas tipo
}
