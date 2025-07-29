import { BaseDTO } from "../common/base.dto";

export interface ProductPillarHistoryDTO extends BaseDTO {
  idProdutoPilarHistorico: number;
  idEntidade: number;
  idCiclo: number;
  idPilar: number;

  peso: number;
  pesoAnterior?: number;

  nota: number;
  notaAnterior?: number;

  idTipoPontuacao: number;
  metodo: string;

  tipoAlteracao: "P" | "N"; // Peso ou Nota

  idAuditor?: number;
  auditorAnteriorId?: number;

  idAuthor: number;
  authorName: string;
  alteradoEm: string;

  motivacaoPeso?: string;

  // Campos derivados para uso no HTML
  alteracaoLabel?: string; // "Peso" ou "Nota"
  valorDe?: number;        // pesoAnterior ou notaAnterior
  valorPara?: number;      // peso ou nota
}
