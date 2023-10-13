import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CycleEntityDTO } from 'src/app/domain/dto/cycle-entity.dto';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { CyclesService } from 'src/app/services/configuration/cycles.service';

@Component({
  selector: 'app-cycles-entities-edit',
  templateUrl: './cycles-entities-edit.component.html',
  styleUrls: ['./cycles-entities-edit.component.css']
})
export class CyclesEntitiesEditComponent extends BaseCrudEditComponent<CycleEntityDTO> implements OnInit {

  private father: EntityVirtusDTO
  private object: CycleEntityDTO

  cycles: CycleDTO[] = []

  elementForm = this._formBuilder.group({
    cycle: [this.data.object.cycle, [Validators.required]],
    averageType: [this.data.object.averageType?.value, [Validators.required]],
    startsAt: [this.data.object.startsAt, [Validators.required]],
    endsAt: [this.data.object.endsAt, [Validators.required]]
  });

  constructor(public dialogRef: MatDialogRef<CyclesEntitiesEditComponent>,
    private _cyclesService: CyclesService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: EntityVirtusDTO, object: CycleEntityDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._cyclesService.getAll('', 0, 200).subscribe(resp => {
      this.cycles = resp.content;
    })
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.cycle = this.elementForm.value.cycle;
    this.object.averageType = { value: this.elementForm.value.averageType, description: this.elementForm.value.averageType };
    this.object.startsAt = this.elementForm.value.startsAt;
    this.object.endsAt = this.elementForm.value.endsAt;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.cycle?.name ? "Editar Ciclo \"" + this.object.cycle?.name + "\"" : "Cadastrar novo Ciclo";
  }

}
