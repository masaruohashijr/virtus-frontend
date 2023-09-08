import { BaseDTO } from "../common/base.dto";
import { RoleDTO } from "./role.dto";

export class ActivityRoleDTO extends BaseDTO {

    role: RoleDTO | undefined;

}