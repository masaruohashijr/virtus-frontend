import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { FeatureRoleDTO } from 'src/app/domain/dto/feature-role.dto';
import { FeatureDTO } from 'src/app/domain/dto/feature.dto';
import { RoleDTO } from 'src/app/domain/dto/role.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { FeaturesService } from 'src/app/services/administration/features.service';
import { RolesService } from 'src/app/services/administration/roles.service';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.css']
})
export class RolesEditComponent extends BaseCrudEditComponent<RoleDTO> implements OnInit {

  allFeatures: FeatureDTO[] = [];

  features: FeatureDTO[] = [];

  featureInput = new FormControl();

  selectedFeatures: FeatureDTO[] = [];

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    features: [this.selectedFeatures],
    description: [this.object.description]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<RolesEditComponent>,
    private _service: RolesService,
    private _featureService: FeaturesService,
    private _formBuilder: FormBuilder,
    @Inject(MatDialog) private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: RoleDTO
  ) {
    super();
  }

  ngOnInit(): void {
    this._featureService.getAll('', 0, 1000).subscribe(resp => {
      this.allFeatures = resp.content;
      this.selectedFeatures = this.allFeatures.filter(item => this.object.features?.some(r => r.feature?.id === item.id))
      this.elementForm.get('features')?.setValue(this.selectedFeatures);
      this.features = this.allFeatures.filter(item => !this.selectedFeatures?.some(selected => selected.id === item.id))
    })
  }

  addFeature(event: MatAutocompleteSelectedEvent): void {
    this.selectedFeatures = this.elementForm.get('features')?.value as FeatureDTO[];
    this.selectedFeatures.push(event.option.value);
    this.elementForm.get('features')?.setValue(this.selectedFeatures);
    this.features = this.allFeatures.filter(item => !this.selectedFeatures?.some(selected => selected.id === item.id))
    let newItem = new FeatureRoleDTO();
    newItem.feature = event.option.value;
    this.object.features?.push(newItem)
  }

  removeFeature(chip: FeatureDTO): void {
    this.selectedFeatures = this.elementForm.get('features')?.value as FeatureDTO[];
    const index = this.selectedFeatures.indexOf(chip);

    if (index >= 0) {
      this.selectedFeatures.splice(index, 1);
      this.elementForm.get('features')?.setValue(this.selectedFeatures);
      this.features = this.allFeatures.filter(item => !this.selectedFeatures?.some(selected => selected.id === item.id));
      this.object.features = this.object.features?.filter(item => item.feature?.id !== chip.id);
    }
  }

  getTitle() {
    return this.object?.name ? "Editar Perfil \"" + this.object?.name + "\"" : "Cadastrar novo Perfil";
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();

    if (!this.object.id) {
      this._service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          this.mostrarErro(error, this.errorDialog);

          return throwError(error);
        })
      ).subscribe();
    } else {
      this._service.update(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          this.mostrarErro(error, this.errorDialog);

          return throwError(error);
        })
      ).subscribe();
    }

  }
}
