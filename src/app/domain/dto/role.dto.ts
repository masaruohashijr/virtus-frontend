import { BaseDTO } from "../common/base.dto";
import { FeatureRoleDTO } from "./feature-role.dto";

export class RoleDTO extends BaseDTO {
    name!: string | undefined;
    description!: string | undefined;
    features: FeatureRoleDTO[] = [];
}