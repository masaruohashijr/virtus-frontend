import { EntityVirtusDTO } from './entity-virtus.dto';
import { BaseDTO } from "../common/base.dto";

export class PlanDTO extends BaseDTO {

    reference: string | undefined | null;
    name: string | undefined | null
    description: string | undefined | null;
    cnpb: string | undefined | null;
    legislation: string | undefined | null;
    situation: string | undefined | null;
    guaranteeResource: number | undefined | null;
    modality: string | undefined | null;
    entity: EntityVirtusDTO | undefined | null;

}