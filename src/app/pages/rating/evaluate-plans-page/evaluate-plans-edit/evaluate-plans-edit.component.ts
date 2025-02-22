import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { EvaluatePlansTreeDTO } from 'src/app/domain/dto/evaluate-plans-tree-dto';
import { EvaluatePlansService } from 'src/app/services/rating/evaluate-plans.service';

interface EvaluatePlansTreeNode {
  linha: number;
  nivel: string;
  nome: string;
  supervisor?: string;
  auditor?: string;
  tipoNota?: string;
  peso?: number;
  pesoInvalido?: boolean;
  metodo?: string;
  nota?: number;
  children?: EvaluatePlansTreeNode[];
}

interface ElementoItem {
  itemNome: any;
  supervisorNome: any;
  auditorNome: any;
  tipoNotaNome: any;
  peso: any;
  pesoPadraoEC: number;
  metodo: any;
  nota: any;
}

@Component({
  selector: 'app-evaluate-plans-edit',
  templateUrl: './evaluate-plans-edit.component.html',
  styleUrls: ['./evaluate-plans-edit.component.css']
})
export class EvaluatePlansEditComponent implements OnInit {

  @Input() object!: EntityVirtusDTO;

  treeControl = new NestedTreeControl<EvaluatePlansTreeNode>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<EvaluatePlansTreeNode>();

  evaluatePlansTree: EvaluatePlansTreeDTO[] = [];

  constructor(private _service: EvaluatePlansService) { }

  ngOnInit(): void {
    if (this.object.cycleSelected) {
      this._service.getEvaluatePlansTreeByEntityAndCycleId(this.object.id, this.object.cycleSelected.id).subscribe(resp => {
        this.evaluatePlansTree = resp;
        this.treeDataSource.data = this.transformToTreeData(this.evaluatePlansTree);
      });
    }
  }

  // Função para transformar os dados para o formato necessário pela árvore
  transformToTreeData(data: EvaluatePlansTreeDTO[]): EvaluatePlansTreeNode[] {
    const groupedData = this.groupByEntidade(data);

    return groupedData.map((entity, index) => ({
      linha: index + 1,
      nivel: 'Entidade',
      nome: entity.entidadeNome,
      children: this.groupByCiclo(entity.ciclos).map((cycle, cycleIndex) => ({
        linha: cycleIndex + 1,
        nivel: 'Ciclo',
        nome: cycle.cicloNome,
        children: this.groupByPilar(cycle.pilares).map((pilar, pilarIndex) => ({
          linha: pilarIndex + 1,
          nivel: 'Pilar',
          nome: pilar.pilarNome,
          children: this.groupByComponente(pilar.componentes).map((componente, componenteIndex) => ({
            linha: componenteIndex + 1,
            nivel: 'Componente',
            nome: componente.componenteNome,
            children: this.groupByPlano(componente.planos).map((plano, planoIndex) => ({
              linha: planoIndex + 1,
              nivel: 'Plano',
              nome: plano.planoNome,
              children: this.groupByTipoNota(plano.tiposNotas).map((tipoNota, tipoNotaIndex) => ({
                linha: tipoNotaIndex + 1,
                nivel: 'Tipo de Nota',
                nome: tipoNota.tipoNotaNome,
                children: this.groupByElemento(tipoNota.elementos).map((elemento, elementoIndex) => ({
                  linha: elementoIndex + 1,
                  nivel: 'Elemento',
                  nome: elemento.elementoNome,
                  children: elemento.itens.map((item: ElementoItem, itemIndex: number) => ({
                    linha: itemIndex + 1,
                    nivel: 'Item',
                    nome: item.itemNome,
                    supervisor: item.supervisorNome,
                    auditor: item.auditorNome,
                    tipoNota: item.tipoNotaNome,
                    peso: item.peso,
                    pesoInvalido: item.pesoPadraoEC !== 100,
                    metodo: item.metodo,
                    nota: item.nota,
                  }))
                }))
              }))
            }))
          }))
        }))
      }))
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    //this.treeDataSource.data = this.filterTree(this.evaluatePlansTree, filterValue);
  }

  // Função para agrupar dados por Entidade
  groupByEntidade(data: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    data.forEach((item) => {
      if (!grouped[item.entidadeId]) {
        grouped[item.entidadeId] = { entidadeNome: item.entidadeNome, ciclos: [] };
      }
      grouped[item.entidadeId].ciclos.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Ciclo
  groupByCiclo(ciclos: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    ciclos.forEach((item) => {
      if (!grouped[item.cicloId]) {
        grouped[item.cicloId] = { cicloNome: item.cicloNome, pilares: [] };
      }
      grouped[item.cicloId].pilares.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Pilar
  groupByPilar(pilares: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    pilares.forEach((item) => {
      if (!grouped[item.pilarId]) {
        grouped[item.pilarId] = { pilarNome: item.pilarNome, componentes: [] };
      }
      grouped[item.pilarId].componentes.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Componente
  groupByComponente(componentes: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    componentes.forEach((item) => {
      if (!grouped[item.componenteId]) {
        grouped[item.componenteId] = { componenteNome: item.componenteNome, planos: [] };
      }
      grouped[item.componenteId].planos.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Plano
  groupByPlano(planos: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    planos.forEach((item) => {
      if (!grouped[item.planoId]) {
        grouped[item.planoId] = { planoNome: item.cnpb, tiposNotas: [] };
      }
      grouped[item.planoId].tiposNotas.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Tipo de Nota
  groupByTipoNota(tiposNotas: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    tiposNotas.forEach((item) => {
      if (!grouped[item.tipoNotaId]) {
        grouped[item.tipoNotaId] = { tipoNotaNome: item.tipoNotaNome, elementos: [] };
      }
      grouped[item.tipoNotaId].elementos.push(item);
    });
    return Object.values(grouped);
  }

  // Função para agrupar dados por Elemento
  groupByElemento(elementos: EvaluatePlansTreeDTO[]): any[] {
    const grouped: any = {};
    elementos.forEach((item) => {
      if (!grouped[item.elementoId]) {
        grouped[item.elementoId] = { elementoNome: item.elementoNome, itens: [] };
      }
      grouped[item.elementoId].itens.push(item);
    });
    return Object.values(grouped);
  }

  // Função para verificar se o nó tem filhos
  hasChild = (_: number, node: EvaluatePlansTreeNode) => !!node.children && node.children.length > 0;
}
