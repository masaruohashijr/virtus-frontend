import { BaseDTO } from "../common/base.dto";

export interface ProductPillarHistoryDTO extends BaseDTO {
  idProdutoPilarHistorico: number;
  idEntidade: number;
  idCiclo: number;
  idPilar: number;
  peso: number;
  idTipoPontuacao: number;
  nota: number;
  tipoAlteracao: "P" | "N";
  idAuditor: number;
  auditorAnteriorId: number;
  idAuthor: number;
  authorName: string;
  alteradoEm: string;
  motivacao: string;
}
