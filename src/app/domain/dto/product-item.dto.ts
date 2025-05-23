import { AuditorDTO } from "./auditor.dto";
import { ComponentDTO } from "./components.dto";
import { CycleEntityDTO } from "./cycle-entity.dto";
import { CycleDTO } from "./cycle.dto";
import { ElementDTO } from "./element.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { PillarDTO } from "./pillar.dto";
import { SupervisorDTO } from "./supervisor.dto";
import { GradeTypeDTO } from "./type-of-note.dto";

export class ProductItemDTO {
    id!: number;
    elemento!: ElementDTO;
    tipoNota!: GradeTypeDTO;
    componente!: ComponentDTO;    
    pilar!: PillarDTO;
    ciclo!: CycleEntityDTO;
    entidade!: EntityVirtusDTO;
    supervisor!: SupervisorDTO;
    auditor!: AuditorDTO;
    startsAt!: Date;
    endsAt!: Date;
    plans!: any[]
  grade: any;
  texto: any;
}