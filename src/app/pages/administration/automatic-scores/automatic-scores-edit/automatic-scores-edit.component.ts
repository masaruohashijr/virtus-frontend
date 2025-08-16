import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AutomaticScoreDTO } from "src/app/domain/dto/automatic-score.dto";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { PlanDTO } from "src/app/domain/dto/plan.dto";

import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { debounceTime, map, startWith } from "rxjs";
import { AutomaticScoresService } from "src/app/services/administration/automatic-scores.service";
import { PlansService } from "src/app/services/administration/plans.service";
import { ComponentsService } from "src/app/services/configuration/components.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";

@Component({
  selector: "app-automatic-scores-edit",
  templateUrl: "./automatic-scores-edit.component.html",
  styleUrls: ["./automatic-scores-edit.component.css"],
})
export class AutomaticScoresEditComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  public initialEntityToSelect: any = null;
  entityControl = new FormControl();
  filteredEntities: any[] = [];
  components: ComponentDTO[] = [];
  entities: { id: number; name: string; code?: string; acronym?: string }[] =
    [];
  filteredPlans: PlanDTO[] = [];
  selectedEntityId: number | null = null;
  @ViewChild("entityInput", { static: true }) entityInput!: any;

  constructor(
    private fb: FormBuilder,
    private entityService: EntityVirtusService,
    private planService: PlansService,
    private componentsService: ComponentsService,
    private scoreService: AutomaticScoresService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AutomaticScoresEditComponent>,
    @Inject(MAT_DIALOG_DATA) public object: AutomaticScoreDTO
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.buildForm();
    this.loadComponents();

    if (this.object?.cnpb) {
      this.loadPlanAndEntityFromCnpb(this.object.cnpb);
    } else {
      this.loadEntities();
    }

    this.entityControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(300),
        map((value) => this.filterEntities(value))
      )
      .subscribe((filtered) => {
        this.filteredEntities = filtered;
      });

    this.entityInput.nativeElement.addEventListener("focus", () => {
      if (this.entities.length <= 1) {
        this.loadEntities();
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      entityControl: this.entityControl,
      cnpb: [this.object?.cnpb ?? null, Validators.required],
      referenceDate: [
        this.object?.referenceDate ?? null,
        [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
      ],
      componentId: [this.object?.componentId ?? null, Validators.required],
      nota: [
        this.object?.score ?? null,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  private loadEntities(): void {
    this.entityService.getAll("", 0, 1000).subscribe({
      next: (response) => {
        this.entities = (response.content || []).map((e: any) => ({
          id: e.id,
          name: e.name ?? "",
          acronym: e.acronym ?? "",
          code: e.code ?? "",
        }));

        this.filteredEntities = [...this.entities];

        if (this.initialEntityToSelect) {
          const match = this.entities.find(
            (e) => e.id === this.initialEntityToSelect.id
          );

          if (match) {
            // Executa fora da zona Angular para evitar re-renderização imediata
            this.ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this.ngZone.run(() => {
                  this.entityControl.setValue(match, { emitEvent: false });
                  this.selectedEntityId = match.id;
                  this.loadPlansForEntity(match.id);
                  this.cdr.detectChanges(); // força atualização da view
                });
              }, 0);
            });
          }
        }
      },
      error: (err) => console.error("Erro ao carregar entidades", err),
    });
  }

  private loadPlanAndEntityFromCnpb(cnpb: string): void {
    this.planService.getByCnpb(cnpb).subscribe({
      next: (plan: PlanDTO) => {
        if (plan?.entity?.id) {
          const entity = {
            id: plan.entity.id,
            name: plan.entity.name ?? "",
            acronym: plan.entity.acronym ?? "",
            code: plan.entity.code ?? "",
          };

          this.entities = [entity]; // só essa
          this.filteredEntities = [entity];
          this.entityControl.setValue(entity, { emitEvent: false });
          this.selectedEntityId = entity.id;

          // carrega os planos do plano informado
          this.planService.getByEntityId(entity.id).subscribe({
            next: (plans) => {
              this.filteredPlans = plans || [];
              if (!this.filteredPlans.find((p) => p.cnpb === cnpb)) {
                this.filteredPlans.unshift(plan);
              }
            },
            error: (err) => {
              console.error("Erro ao carregar planos da entidade", err);
              this.filteredPlans = [];
            },
          });
        }
      },
      error: (err) => {
        console.error("Erro ao buscar plano por CNPB:", err);
      },
    });
  }

  // Nova função para carregar planos, para evitar duplicação de código
  private loadPlansForEntity(entityId: number): void {
    this.planService.getByEntityId(entityId).subscribe({
      next: (plans) => {
        this.filteredPlans = plans || [];
        if (
          this.object?.cnpb &&
          !this.filteredPlans.find((p) => p.cnpb === this.object.cnpb)
        ) {
        }
      },
      error: (err) => {
        console.error("Erro ao carregar planos da entidade", err);
        this.filteredPlans = [];
      },
    });
  }

  private loadComponents(): void {
    this.componentsService.getAll("", 0, 1000).subscribe({
      next: (res) => (this.components = res.content || []),
      error: (err) => console.error("Erro ao carregar componentes", err),
    });
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
    dto.referenceDate = this.form.value.referenceDate;
    dto.componentId = this.form.value.componentId;
    dto.score = Number(this.form.value.nota);

    const request$ = dto.id
      ? this.scoreService.update(dto)
      : this.scoreService.create(dto);

    request$.subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error("Erro ao salvar nota automática:", err),
    });
  }

  onEntitySelected(event: MatAutocompleteSelectedEvent): void {
    const entity = event.option.value;
    if (!entity?.id) return;

    this.selectedEntityId = entity.id;
    // Remova esta linha: this.entityControl.setValue(entity);

    this.planService.getByEntityId(entity.id).subscribe({
      next: (plans) => {
        this.filteredPlans = plans || [];
      },
      error: (err) => {
        console.error("Erro ao carregar planos da entidade", err);
        this.filteredPlans = [];
      },
    });
  }

  displayEntityFn(entity: any): string {
    if (!entity) return "";
    return `${entity.code ?? ""} - ${entity.acronym ?? ""} - ${
      entity.name ?? ""
    }`;
  }

  private filterEntities(value: string): any[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : "";
    if (!filterValue) {
      return [];
    }
    return this.entities.filter((entity) =>
      `${entity.code ?? ""} ${entity.acronym ?? ""} ${entity.name ?? ""}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  onEntityFieldFocused(): void {
    if (this.entities.length == 1) {
      this.loadEntities();
    }
  }
}
