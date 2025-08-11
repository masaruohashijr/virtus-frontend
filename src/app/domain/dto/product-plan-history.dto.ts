import { BaseDTO } from "../common/base.dto";

export interface ProductPlanHistoryDTO extends BaseDTO {
  idProdutoPilarHistorico: number;
  idEntidade: number;
  idCiclo: number;
  idPilar: number;
  idComponente: number;
  idPlano: number;
  tipoAlteracao: "RE" | "RA"; // Retificação ou Ratificação
  nota: number;
  notaAnterior?: number;
  idAuthor: number;
  authorName: string;
  alteradoEm: string;
  motivacao?: string;
}
