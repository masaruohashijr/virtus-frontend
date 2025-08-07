import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { StartCycleDTO } from "src/app/domain/dto/start-cycle.dto";
import { UsersService } from "src/app/services/administration/users.service";
import { CyclesService } from "src/app/services/configuration/cycles.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";
import { CycleRemovedDialogComponent } from "./cycle-removed-dialog/cycle-removed-dialog.component";
import { ConfirmRemoveCycleEntityDialogComponent } from "./confirm-remove-cycle-entity-dialog/confirm-remove-cycle-entity-dialog.component";

@Component({
  selector: "app-remove-cycles-edit",
  templateUrl: "./remove-cycles-edit.component.html",
  styleUrls: ["./remove-cycles-edit.component.css"],
})
export class RemoveCyclesEditComponent implements OnInit {
  @ViewChild("entityInputEl") entityInputEl!: ElementRef<HTMLInputElement>;

  elementForm = this._formBuilder.group({
    name: ["", Validators.required],
    description: [""],
    startsAt: [null as Date | null | undefined],
    endsAt: [null as Date | null | undefined],
    author: [""],
    createdAt: [null as Date | null | undefined],
    entities: [<EntityVirtusDTO[]>[]],
  });

  selectedEntities: EntityVirtusDTO[] = [];
  removedEntities: EntityVirtusDTO[] = [];

  constructor(
    private dialogRef: MatDialogRef<RemoveCyclesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object: StartCycleDTO },
    private _entityService: EntityVirtusService,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    private _service: CyclesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const cycle = this.data.object.cycle;

    this.selectedEntities = cycle.entities || [];

    this.elementForm.patchValue({
      name: cycle.name,
      description: cycle.description,
      startsAt: this.data.object.startsAt,
      endsAt: this.data.object.endsAt,
      author: cycle.author?.name || "",
      createdAt: new Date(this.data.object.cycle.createdAt),
      entities: this.selectedEntities,
    });
    this.elementForm.get("author")?.disable();
    this.elementForm.get("createdAt")?.disable();
  }

  get createdAtFormatted(): string {
    const date = this.elementForm.get("createdAt")?.value;
    return date ? new Intl.DateTimeFormat("pt-BR").format(date) : "";
  }

  removeEntity(chip: EntityVirtusDTO): void {
    const dialogRef = this.dialog.open(
      ConfirmRemoveCycleEntityDialogComponent,
      {
        width: "450px",
        data: { entity: chip },
      }
    );

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) return;

      const current = this.elementForm.get("entities")
        ?.value as EntityVirtusDTO[];
      const updated = current.filter((e) => e.id !== chip.id);

      this.elementForm.get("entities")?.setValue(updated);
      this.removedEntities.push(chip);
    });
  }

  save(): void {
    if (this.removedEntities.length === 0) {
      this.dialogRef.close(); // Nada foi removido
      return;
    }

    this.data.object.cycle.entities =
      this.elementForm.get("entities")?.value ?? [];

    this._service
      .removeCycleProducts(this.data.object) // Reenvia com entidades atualizadas
      .subscribe(() => {
        const mensagem = `As seguintes entidades foram removidas do ciclo:\n\n${this.removedEntities
          .map((e) => `${e.code} - ${e.name}`)
          .join("\n")}`;

        this.dialog.open(CycleRemovedDialogComponent, {
          width: "500px",
          data: {
            title: "Entidades Removidas",
            message: mensagem,
          },
        });

        this.dialogRef.close(this.data.object);
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getTitle(): string {
    return "Remover Entidades do Ciclo";
  }
}
