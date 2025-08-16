import { BaseDTO } from "../common/base.dto";
import type { FeatureId, RoleId } from "../types/ids";

export class FeatureRoleDTO extends BaseDTO {
    featureId!: FeatureId | undefined;
    roleId!: RoleId | undefined;
}