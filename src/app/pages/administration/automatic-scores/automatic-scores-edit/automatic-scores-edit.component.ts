import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { AutomaticScoreDTO } from "src/app/domain/dto/automatic-score.dto";

import { PlansService } from "src/app/services/administration/plans.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";
import { ComponentsService } from "src/app/services/configuration/components.service";
import { AutomaticScoresService } from "src/app/services/administration/automatic-scores.service";

@Component({
  selector: "app-automatic-scores-edit",
  templateUrl: "./automatic-scores-edit.component.html",
  styleUrls: ["./automatic-scores-edit.component.css"],
})
export class AutomaticScoresEditComponent implements OnInit {
  form!: FormGroup;
  entityControl = new FormControl();
  entities: any[] = [];
  filteredEntities: any[] = [];
  filteredPlans: PlanDTO[] = [];
  components: ComponentDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private entityService: EntityVirtusService,
    private planService: PlansService,
    private componentsService: ComponentsService,
    private scoreService: AutomaticScoresService,
    public dialogRef: MatDialogRef<AutomaticScoresEditComponent>,
    @Inject(MAT_DIALOG_DATA) public object: AutomaticScoreDTO
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadEntities();
    this.loadComponents();

    this.entityControl.valueChanges.subscribe((value) => {
      const entityId = value?.id;
      if (entityId) {
        this.planService.getByEntityId(entityId).subscribe({
          next: (plans) => (this.filteredPlans = plans || []),
          error: (err) => console.error("Erro ao carregar planos", err),
        });
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      cnpb: [this.object?.cnpb ?? null, Validators.required],
      dataReferencia: [
        this.object?.dataReferencia ?? null,
        [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
      ],
      idComponente: [this.object?.idComponente ?? null, Validators.required],
      nota: [
        this.object?.nota ?? null,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  private loadEntities(): void {
    this.entityService.getAll("", 0, 1000).subscribe({
      next: (res) => {
        this.entities = res.content || [];
        this.filteredEntities = [...this.entities];
      },
      error: (err) => console.error("Erro ao carregar entidades", err),
    });
  }

  private loadComponents(): void {
    this.componentsService.getAll("", 0, 1000).subscribe({
      next: (res) => (this.components = res.content || []),
      error: (err) => console.error("Erro ao carregar componentes", err),
    });
  }

  displayEntityFn(entity: any): string {
    return entity
      ? `${entity.code ?? ""} - ${entity.acronym ?? ""} - ${entity.name ?? ""}`
      : "";
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = new AutomaticScoreDTO();

    dto.id = this.object.id;
    dto.createdAt = this.object.createdAt;
    dto.updatedAt = this.object.updatedAt;
    dto.author = this.object.author;

    dto.cnpb = this.form.value.cnpb;
    dto.dataReferencia = this.form.value.dataReferencia;
    dto.idComponente = this.form.value.idComponente;
    dto.nota = Number(this.form.value.nota); // <-- pega o valor da nota manual
    dto.criadoEm = this.object.criadoEm ?? null;

    const request$ = dto.id
      ? this.scoreService.update(dto)
      : this.scoreService.create(dto);

    request$.subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error("Erro ao salvar nota automática:", err),
    });
  }
}
