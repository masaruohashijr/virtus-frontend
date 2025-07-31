import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { catchError } from "rxjs/internal/operators/catchError";
import { tap } from "rxjs/internal/operators/tap";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { StartCycleDTO } from "src/app/domain/dto/start-cycle.dto";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";
import { UsersService } from "src/app/services/administration/users.service";
import { CyclesService } from "src/app/services/configuration/cycles.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";
import { CurrentUser } from "src/app/domain/dto/current-user.dto";
import { CycleStartedDialogComponent } from "./cycle-started-dialog/cycle-started-dialog.component";

@Component({
  selector: "app-start-cycles-edit",
  templateUrl: "./start-cycles-edit.component.html",
  styleUrls: ["./start-cycles-edit.component.css"],
})
export class StartCyclesEditComponent
  extends BaseCrudEditComponent<StartCycleDTO>
  implements OnInit
{
  @ViewChild("entityInputEl") entityInputEl!: ElementRef<HTMLInputElement>;

  private object: StartCycleDTO;

  entityInput = new FormControl();

  allEntities: EntityVirtusDTO[] = [];
  entities: EntityVirtusDTO[] = [];
  selectedEntities: EntityVirtusDTO[] = [];

  elementForm = this._formBuilder.group({
    name: [this.data.object.cycle.name, [Validators.required]],
    description: [this.data.object.cycle.description],
    startsAt: [
      this.data.object.startsAt || new Date(new Date().getFullYear(), 0, 1),
      [Validators.required],
    ],
    endsAt: [
      this.data.object.endsAt || new Date(new Date().getFullYear(), 11, 31),
      [Validators.required],
    ],
    author: [this.data.object.cycle.author?.name || "", []],
    createdAt: [this.data.object.cycle.createdAt],
    entities: [this.selectedEntities],
  });

  constructor(
    public dialogRef: MatDialogRef<StartCyclesEditComponent>,
    private _service: CyclesService,
    private _entityService: EntityVirtusService,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { object: StartCycleDTO }
  ) {
    super();
    this.object = data.object;
    this.object.entities = data.object.cycle.entities;
    console.log(this.object);
  }
  currentUser: CurrentUser = this._usersService.getCurrentUser();
  curUserRole: string = this.currentUser?.role || "";
  ngOnInit(): void {
    this._entityService.getAll("", 0, 1000).subscribe((resp) => {
      this.allEntities = resp.content;
      this.entities = this.allEntities;
      this.selectedEntities = this.allEntities.filter((item) =>
        this.object.entities?.some((r) => r.id === item.id)
      );
      this.elementForm.get("entities")?.setValue(this.selectedEntities);
      this.entities = this.allEntities.filter(
        (item) =>
          !this.selectedEntities?.some((selected) => selected.id === item.id)
      );
    });
    this.elementForm.get("author")?.disable();
    this.elementForm.get("createdAt")?.disable();
    this.entityInput.valueChanges.subscribe((value) => {
      this.filterEntities(value);
    });
  }

  addEntity(event: MatAutocompleteSelectedEvent): void {
    const selectedEntity = event.option.value;

    if (selectedEntity) {
      this.selectedEntities =
        (this.elementForm.get("entities")?.value as EntityVirtusDTO[]) || [];
      this.selectedEntities.push(selectedEntity);
      this.elementForm.get("entities")?.setValue(this.selectedEntities);

      // Atualiza a lista de entidades removendo as já selecionadas
      this.entities = this.allEntities.filter(
        (item) =>
          !this.selectedEntities.some((selected) => selected.id === item.id)
      );

      this.object.entities?.push(selectedEntity);

      // Limpa o input
      this.clearFilter();
    }
  }

  removeEntity(chip: EntityVirtusDTO): void {
    this.selectedEntities = this.elementForm.get("entities")
      ?.value as EntityVirtusDTO[];
    const index = this.selectedEntities.indexOf(chip);

    if (index >= 0) {
      this.selectedEntities.splice(index, 1);
      this.elementForm.get("entities")?.setValue(this.selectedEntities);

      // Atualiza a lista de opções disponíveis
      this.entities = this.allEntities.filter(
        (item) =>
          !this.selectedEntities.some((selected) => selected.id === item.id)
      );

      this.object.entities = this.object.entities?.filter(
        (item) => item?.id !== chip.id
      );
      this.clearFilter();
    }
  }

  // Método para filtrar as entidades no autocomplete
  filterEntities(value: string): void {
    try {
      const filterValue = value ? value.toLowerCase() : "";
      this.entities = this.allEntities.filter(
        (entity) =>
          entity?.name?.toLowerCase().includes(filterValue) ||
          entity?.acronym?.toLowerCase().includes(filterValue) ||
          entity?.code?.toString().includes(filterValue)
      );
    } catch {
      this.entities = this.allEntities.filter(
        (item) =>
          !this.selectedEntities.some((selected) => selected.id === item.id)
      );
    }
  }

  clearFilter(): void {
    this.entityInput.setValue("");
    if (this.entityInputEl) {
      this.entityInputEl.nativeElement.value = "";
    }

    this.entities = this.allEntities.filter(
      (item) =>
        !this.selectedEntities.some((selected) => selected.id === item.id)
    );
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched();
      return;
    }

    this.object.cycle.name = this.elementForm.value.name;
    this.object.cycle.description = this.elementForm.value.description;
    this.object.startsAt = this.elementForm.value.startsAt;
    this.object.endsAt = this.elementForm.value.endsAt;

    this._service
      .startCycle(this.object)
      .pipe(
        tap((resp) => {
          this.dialogRef.close(resp);

          const nomeCiclo = this.object.cycle.name;
          const dataInicio = this.object.startsAt
            ? new Date(this.object.startsAt).toLocaleDateString("pt-BR")
            : "";
          const dataFim = this.object.endsAt
            ? new Date(this.object.endsAt).toLocaleDateString("pt-BR")
            : "";
          const entidadesFormatadas = this.selectedEntities
            .map((e) => `${e.code} - ${e.name}`)
            .join("\n");

          const mensagem = `O ${nomeCiclo} foi iniciado para o período de:\n${dataInicio} a ${dataFim}\n\nPara as entidades abaixo:\n${entidadesFormatadas}`;

          if (this.dialog) {
            this.dialog.open(CycleStartedDialogComponent, {
              width: "500px",
              data: {
                title: "Ciclo Iniciado",
                message: mensagem,
              },
            });
          }
        })
      )
      .subscribe();
  }

  getTitle() {
    return "Iniciar Ciclo";
  }
}
