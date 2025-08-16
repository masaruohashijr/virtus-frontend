import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { JurisdictionDTO } from 'src/app/domain/dto/jurisdiction.dto';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { EntityVirtusService } from 'src/app/services/rating/entity-virtus.service';

@Component({
  selector: 'app-jurisdictions-edit',
  templateUrl: './jurisdictions-edit.component.html',
  styleUrls: ['./jurisdictions-edit.component.css']
})
export class JurisdictionsEditComponent extends BaseCrudEditComponent<JurisdictionDTO> implements OnInit {

  private father: OfficeDTO
  private object: JurisdictionDTO

  entities: EntityVirtusDTO[] = []

  jurisdictionForm = this._formBuilder.group({
    entity: [this.data?.object?.entity, [Validators.required]],
    startsAt: [this.data?.object?.startsAt],
    endsAt: [this.data?.object?.endsAt]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<JurisdictionsEditComponent>,
    private _entityService: EntityVirtusService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: OfficeDTO, object: JurisdictionDTO }
  ) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._entityService.getAllAvailable().subscribe(resp => {
      this.entities = resp;
    })
  }

  save() {
    if (this.jurisdictionForm.invalid) {
      this.jurisdictionForm.markAllAsTouched()
      return;
    }

    this.object.entity = this.jurisdictionForm.value.entity;
    this.object.startsAt = this.jurisdictionForm.value.startsAt;
    this.object.endsAt = this.jurisdictionForm.value.endsAt;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object?.entity?.id ? "Editar Jurisdição \"" + this.object?.entity?.name + "\"" : "Cadastrar nova Jurisdição";
  }

}
