import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-show-description",
  templateUrl: "./show-description.component.html",
})
export class ShowDescriptionComponent implements OnInit {
  description: string = "";
  objectType: string = "";
  loading = true;
  showDescriptionForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;  
  componente: any;  
  plano: any;  
  tipoNota: any;
  elemento: any;
  item: any;
  weight: any;
  grade: any;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ShowDescriptionComponent  ) {}

  ngOnInit(): void {
    this.showDescriptionForm = this.formBuilder.group({
      entity: [this.data?.entidade?.name],
      cycle: [this.data?.ciclo?.name],
      pillar: [this.data?.pilar?.name],
      component: [this.data?.componente?.name],
      plan: [this.data?.plano?.name],
      gradeType: [this.data?.tipoNota?.name],
      element: [this.data?.elemento?.name],
      item: [this.data?.item?.name],
      weight: [this.data?.weight],
      grade: [this.data?.grade],
      description: [this.data?.description],
      objectType: [this.data?.objectType]
    });
  }

  getTitle() {
    let name = '';
    let objectType = this.data?.objectType || '';
    switch (this.data?.objectType) {
      case 'Entidade':
        name = this.data?.entidade?.name || '';
        objectType = 'Entidade';
        break;
      case 'Ciclo':
        name = this.data?.ciclo?.name || '';
        objectType = 'Ciclo';
        break;
      case 'Pilar':
        name = this.data?.pilar?.name || '';
        objectType = 'Pilar';
        break;
      case 'Componente':
        name = this.data?.componente?.name || '';
        objectType = 'Componente';
        break;
      case 'Plano':
        name = this.data?.plano?.name || '';
        objectType = 'Plano';
        break;
      case 'Tipo Nota':
        name = this.data?.tipoNota?.name || '';
        objectType = 'Tipo Nota';
        break;
      case 'Elemento':
        name = this.data?.elemento?.name || '';
        objectType = 'Elemento';
        break;
      case 'Item':
        name = this.data?.item?.name || '';
        objectType = 'Item';
        break;
      default:
        name = '';
    }
    return `Descrição do ${this.data?.objectType} :: ${name}`;
  }
}
