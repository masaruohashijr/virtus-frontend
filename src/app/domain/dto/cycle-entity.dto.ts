import { BaseDTO } from "../common/base.dto";
import { CycleDTO } from "./cycle.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { UserDTO } from "./user.dto";

export class CycleEntityDTO extends BaseDTO {

    averageType : any;
    supervisor: UserDTO | undefined | null;
    startsAt: Date | undefined | null;
    endsAt: Date | undefined | null;
    cycle: CycleDTO | undefined | null;
    entity: EntityVirtusDTO | undefined | null;
}