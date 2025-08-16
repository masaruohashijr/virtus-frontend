import { TreeNode } from "primeng/api";

export interface TreeNodeVirtus<T = any>  extends TreeNode<T> {
    node?: TreeNode<T>;
}