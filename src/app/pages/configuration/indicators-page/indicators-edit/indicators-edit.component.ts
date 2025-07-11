import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { IndicatorDTO } from 'src/app/domain/dto/indicator.dto';
import { IndicatorsService } from 'src/app/services/configuration/indicators.service';

@Component({
  selector: 'app-indicators-edit',
  templateUrl: './indicators-edit.component.html',
  styleUrls: ['./indicators-edit.component.css']
})
export class IndicatorsEditComponent implements OnInit {

  indicatorForm = this._formBuilder.group({
    indicatorAcronym: [this.object.indicatorAcronym, [Validators.required]],
    indicatorName: [this.object.indicatorName, [Validators.required]],
    indicatorDescription: [this.object.indicatorDescription]
  });

  constructor(
    public dialogRef: MatDialogRef<IndicatorsEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(IndicatorsService) private _service: IndicatorsService,
    @Inject(MAT_DIALOG_DATA) public object: IndicatorDTO
  ) {}

  ngOnInit(): void {}

  save(): void {
    if (this.indicatorForm.invalid) {
      this.indicatorForm.markAllAsTouched();
      return;
    }

    this.object.indicatorAcronym = this.indicatorForm.value.indicatorAcronym?.toString();
    this.object.indicatorName = this.indicatorForm.value.indicatorName?.toString();
    this.object.indicatorDescription = this.indicatorForm.value.indicatorDescription?.toString();

    const operation$ = this.object.id
      ? this._service.update(this.object)
      : this._service.create(this.object);

    operation$.pipe(
      tap(resp => this.dialogRef.close(resp)),
      catchError(error => {
        console.error('Erro ao salvar indicador:', error);
        return throwError(error);
      })
    ).subscribe();
  }

  getTitle(): string {
    return this.object.id
      ? `Editar Indicador "${this.object.indicatorAcronym}"`
      : 'Cadastrar novo Indicador';
  }
}
