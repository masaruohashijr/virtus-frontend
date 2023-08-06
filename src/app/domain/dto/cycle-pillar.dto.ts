import { BaseDTO } from "../common/base.dto";
import { PillarDTO } from "./pillar.dto";
import { UserDTO } from "./user.dto";

export class CyclePillarDTO extends BaseDTO {
  pillar: PillarDTO | undefined | null;
  averageType: any;
  standardWeight: number | undefined | null;
  author: UserDTO | undefined | null;
}
