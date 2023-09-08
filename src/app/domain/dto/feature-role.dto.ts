import { BaseDTO } from "../common/base.dto";
import { FeatureDTO } from "./feature.dto";
import { RoleDTO } from "./role.dto";

export class FeatureRoleDTO extends BaseDTO {
    feature!: FeatureDTO | undefined;
    role!: RoleDTO | undefined;    
}