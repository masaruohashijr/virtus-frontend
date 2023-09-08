import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionDTO } from 'src/app/domain/dto/action.dto';
import { ActivityRoleDTO } from 'src/app/domain/dto/activity-role.dto';
import { ActivityDTO } from 'src/app/domain/dto/activity.dto';
import { FeatureActivityDTO } from 'src/app/domain/dto/feature-activity.dto';
import { FeatureDTO } from 'src/app/domain/dto/feature.dto';
import { RoleDTO } from 'src/app/domain/dto/role.dto';
import { WorkflowDTO } from 'src/app/domain/dto/workflow.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { ActionsService } from 'src/app/services/administration/actions.service';
import { FeaturesService } from 'src/app/services/administration/features.service';
import { RolesService } from 'src/app/services/administration/roles.service';

@Component({
  selector: 'app-activities-edit',
  templateUrl: './activities-edit.component.html',
  styleUrls: ['./activities-edit.component.css']
})
export class ActivitiesEditComponent extends BaseCrudEditComponent<ActivityDTO> implements OnInit {

  private father: WorkflowDTO
  private object: ActivityDTO

  allFeatures: FeatureDTO[] = [];
  allRoles: RoleDTO[] = [];

  actions: ActionDTO[] = [];
  features: FeatureDTO[] = [];
  roles: RoleDTO[] = [];

  featureInput = new FormControl();
  roleInput = new FormControl();

  selectedFeatures: FeatureDTO[] = [];
  selectedRoles: RoleDTO[] = [];

  elementForm = this._formBuilder.group({
    action: [this.data.object.action, [Validators.required]],
    features: [this.selectedFeatures],
    roles: [this.selectedRoles],
    startAt: [this.data.object.startAt],
    endAt: [this.data.object.endAt],
    expirationTimeDays: [this.data.object.expirationTimeDays, [Validators.required]],
    expirationAction: [this.data.object.expirationAction]
  });

  constructor(public dialogRef: MatDialogRef<ActivitiesEditComponent>,
    private _featureService: FeaturesService,
    private _actionService: ActionsService,
    private _roleService: RolesService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: WorkflowDTO, object: ActivityDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._featureService.getAll('', 0, 1000).subscribe(resp => {
      this.allFeatures = resp.content;
      this.selectedFeatures = this.allFeatures.filter(item => this.object.features?.some(r => r.feature?.id === item.id))
      this.elementForm.get('features')?.setValue(this.selectedFeatures);
      this.features = this.allFeatures.filter(item => !this.selectedFeatures?.some(selected => selected.id === item.id))
    })
    this._actionService.getAll('', 0, 1000).subscribe(resp => {
      this.actions = resp.content;
    })
    this._roleService.getAll('', 0, 1000).subscribe(resp => {
      this.allRoles = resp.content;
      this.selectedRoles = this.allRoles.filter(item => this.object.roles?.some(r => r.role?.id === item.id))
      this.elementForm.get('roles')?.setValue(this.selectedRoles);
      this.roles = this.allRoles.filter(item => !this.selectedRoles?.some(selected => selected.id === item.id))
    })

  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.action = this.elementForm.value.action;
    this.object.actionId = this.elementForm.value.action?.id;
    this.object.startAt = this.elementForm.value.startAt;
    this.object.endAt = this.elementForm.value.endAt;
    this.object.expirationAction = this.elementForm.value.expirationAction;
    this.object.expirationActionId = this.elementForm.value.expirationAction?.id;
    this.object.expirationTimeDays = this.elementForm.value.expirationTimeDays;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.action?.name ? "Editar Atividade \"" + this.object.action?.name + "\"" : "Cadastrar nova Atividade";
  }

  addFeature(event: MatAutocompleteSelectedEvent): void {
    this.selectedFeatures = this.elementForm.get('features')?.value as FeatureDTO[];
    this.selectedFeatures.push(event.option.value);
    this.elementForm.get('features')?.setValue(this.selectedFeatures);
    this.features = this.allFeatures.filter(item => !this.selectedFeatures?.some(selected => selected.id === item.id))
    let newItem = new FeatureActivityDTO();
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

  addRole(event: MatAutocompleteSelectedEvent): void {
    this.selectedRoles = this.elementForm.get('roles')?.value as RoleDTO[];
    this.selectedRoles.push(event.option.value);
    this.elementForm.get('roles')?.setValue(this.selectedRoles);
    this.roles = this.allRoles.filter(item => !this.selectedRoles?.some(selected => selected.id === item.id))
    let newItem = new ActivityRoleDTO();
    newItem.role = event.option.value;
    this.object.roles?.push(newItem)
  }

  removeRole(chip: RoleDTO): void {
    this.selectedRoles = this.elementForm.get('roles')?.value as RoleDTO[];
    const index = this.selectedRoles.indexOf(chip);

    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
      this.elementForm.get('roles')?.setValue(this.selectedRoles);
      this.roles = this.allRoles.filter(item => !this.selectedRoles?.some(selected => selected.id === item.id));
      this.object.roles = this.object.roles?.filter(item => item.role?.id !== chip.id);
    }
  }
}
