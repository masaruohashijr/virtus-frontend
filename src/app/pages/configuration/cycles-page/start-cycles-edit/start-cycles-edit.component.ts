import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { StartCycleDTO } from 'src/app/domain/dto/start-cycle.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { CyclesService } from 'src/app/services/configuration/cycles.service';
import { EntityVirtusService } from 'src/app/services/rating/entity-virtus.service';

@Component({
  selector: 'app-start-cycles-edit',
  templateUrl: './start-cycles-edit.component.html',
  styleUrls: ['./start-cycles-edit.component.css']
})
export class StartCyclesEditComponent extends BaseCrudEditComponent<StartCycleDTO> implements OnInit {

  private object: StartCycleDTO

  entityInput = new FormControl();

  allEntities: EntityVirtusDTO[] = [];
  entities: EntityVirtusDTO[] = [];
  selectedEntities: EntityVirtusDTO[] = [];

  elementForm = this._formBuilder.group({
    name: [this.data.object.cycle.name, [Validators.required]],
    description: [this.data.object.cycle.description],
    startsAt: [this.data.object.startsAt, [Validators.required]],
    endsAt: [this.data.object.endsAt, [Validators.required]],
    author: [this.data.object.cycle.author],
    createdAt: [this.data.object.cycle.createdAt],
    entities: [this.selectedEntities]
  });

  constructor(public dialogRef: MatDialogRef<StartCyclesEditComponent>,
    private _service: CyclesService,
    private _entityService: EntityVirtusService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { object: StartCycleDTO }) {
    super();
    this.object = data.object;
  }

  ngOnInit(): void {
    this._entityService.getAll('', 0, 1000).subscribe((resp) => {
      this.allEntities = resp.content;
      this.entities = this.allEntities;
      console.log(this.entities)
    });
    this.elementForm.get('author')?.disable();
    this.elementForm.get('createdAt')?.disable();
  }

  addEntity(event: MatAutocompleteSelectedEvent): void {
    this.selectedEntities = this.elementForm.get('entities')?.value as EntityVirtusDTO[];
    this.selectedEntities.push(event.option.value);
    this.elementForm.get('entities')?.setValue(this.selectedEntities);
    this.entities = this.allEntities.filter(item => !this.selectedEntities?.some(selected => selected.id === item.id))
    this.object.entities?.push(event.option.value)
  }

  removeEntity(chip: EntityVirtusDTO): void {
    this.selectedEntities = this.elementForm.get('entities')?.value as EntityVirtusDTO[];
    const index = this.selectedEntities.indexOf(chip);

    if (index >= 0) {
      this.selectedEntities.splice(index, 1);
      this.elementForm.get('entities')?.setValue(this.selectedEntities);
      this.entities = this.allEntities.filter(item => !this.selectedEntities?.some(selected => selected.id === item.id));
      this.object.entities = this.object.entities?.filter(item => item?.id !== chip.id);
    }
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.cycle.name = this.elementForm.value.name;
    this.object.cycle.description = this.elementForm.value.description;
    this.object.startsAt = this.elementForm.value.startsAt;
    this.object.endsAt = this.elementForm.value.endsAt;



    this._service.startCycle(this.object).pipe(
      tap(resp => {
        this.dialogRef.close(resp);
      }),
      catchError(error => {
        console.error(error);
        return throwError(error);
      })
    ).subscribe();

  }

  getTitle() {
    return "Iniciar Ciclo";
  }

}
function throwError(error: any): any {
  throw new Error('Function not implemented.');
}

