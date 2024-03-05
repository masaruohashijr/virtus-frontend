import { BaseDTO } from "../common/base.dto";
import { CycleDTO } from "./cycle.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { OfficeDTO } from "./office.dto";

export class JurisdictionDTO extends BaseDTO {

    entity!: EntityVirtusDTO | undefined | null;
    startsAt: Date | undefined | null;
    endsAt: Date | undefined | null;
    office!: OfficeDTO;
    cycle!: CycleDTO;

}