import { AuditorDTO } from "./auditor.dto";
import { ComponentDTO } from "./components.dto";
import { CycleEntityDTO } from "./cycle-entity.dto";
import { BaseDTO } from 'src/app/domain/common/base.dto';
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { PillarDTO } from "./pillar.dto";
import { SupervisorDTO } from "./supervisor.dto";
import { GradeTypeDTO } from "./type-of-note.dto";
import { PlanDTO } from "./plan.dto";
import { ElementDTO } from "./element.dto";

export class ProductElementDTO extends BaseDTO {
    element!: ElementDTO;
    plan!: PlanDTO;
    gradeType!: GradeTypeDTO;
    component!: ComponentDTO;
    pillar!: PillarDTO;
    cycle!: CycleEntityDTO;
    entity!: EntityVirtusDTO;
    supervisor!: SupervisorDTO;
    auditor!: AuditorDTO;
    startsAt!: Date;
    endsAt!: Date;
}