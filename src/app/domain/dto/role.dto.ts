import { BaseDTO } from "../common/base.dto";
import type { FeatureRoleDTO } from "./feature-role.dto";

export class RoleDTO extends BaseDTO {
  name!: string | undefined;
  description!: string | undefined;
  features?: FeatureRoleDTO[]; // só tipo; ok para DTO
}
