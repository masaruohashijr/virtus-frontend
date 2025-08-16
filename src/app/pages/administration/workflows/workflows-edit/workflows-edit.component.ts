import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { WorkflowDTO } from 'src/app/domain/dto/workflow.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { WorkflowsService } from 'src/app/services/administration/workflows.service';

@Component({
  selector: 'app-workflows-edit',
  templateUrl: './workflows-edit.component.html',
  styleUrls: ['./workflows-edit.component.css']
})
export class WorkflowsEditComponent extends BaseCrudEditComponent<WorkflowDTO> implements OnInit {

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    entityType: [this.object.entityType?.value, [Validators.required]]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<WorkflowsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: WorkflowsService,
    @Inject(MAT_DIALOG_DATA) public object: WorkflowDTO
  ) {
    super();
  }

  ngOnInit(): void {
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.entityType = { value: this.elementForm.value.entityType, description: this.elementForm.value.entityType }
    this.object.activities.forEach(activity => {
      if (activity.actionId == null)
        activity.actionId = activity.action?.id;
      if (activity.expirationActionId == null)
        activity.expirationActionId = activity.expirationAction?.id;
    });

    if (!this.object.id) {
      this.service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    } else {
      this.service.update(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    }

  }

  getTitle() {
    return this.object.name ? "Editar Workflow \"" + this.object.name + "\"" : "Cadastrar novo Workflow";
  }

}
