import { BaseDTO } from "../common/base.dto";
import { CyclePillarDTO } from "./cycle-pillar.dto";

export class CycleDTO extends BaseDTO {
  ordination: number | undefined | null;
  name: string | undefined | null;
  description: string | undefined | null;
  reference: string | undefined | null;
  cyclePillars: CyclePillarDTO[] = [];
}
