export interface EvaluatePlansTreeNode {
    id: number;
    name: String;
    type: String;
    children: EvaluatePlansTreeNode[];
    object: EvaluatePlansTreeNode;
    supervisorId: number;
    superVisorName: string;
    auditorId: number ;
    auditorName: string;
    gradeTypeId: number ;
    gradeTypeName: string;
    weight: number;
    letter: string;
    grade: number;
    periodoPermitido?: boolean;
    periodoCiclo?: boolean;
}