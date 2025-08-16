// src/types/primeng-treenode-augmentation.d.ts
declare module 'primeng/api' {
  // Isto MESCLA com a interface TreeNode já existente do PrimeNG.
  export interface TreeNode<T = any> {
    expanded?: boolean;
    parent?: TreeNode<T>;
    children: TreeNode<T>[];
    data: T;
    /** wrapper opcional que alguns eventos usam */
    node?: TreeNode<T>;
  }
}
