export interface Tree {
  id: number;
  name: string;
  children: Tree[];
  state: string;
}