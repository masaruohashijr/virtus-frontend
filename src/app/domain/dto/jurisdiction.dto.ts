import { BaseDTO } from "../common/base.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";

export class JurisdictionDTO extends BaseDTO {

    entity!: EntityVirtusDTO | undefined | null;
    startsAt: Date | undefined | null;
    endsAt: Date | undefined | null;

}