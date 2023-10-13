import { BaseDTO } from "../common/base.dto";
import { PillarComponentDTO } from "./pillar-component.dto";
import { UserDTO } from "./user.dto";

export class PillarDTO extends BaseDTO {
  name: string | undefined | null;
  description: string | undefined | null;
  reference: string | undefined | null;
  ordination: number | undefined | null;
  components: PillarComponentDTO[] = [];
}
