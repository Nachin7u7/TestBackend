export interface IConfigEntity {
  timelimit: number;
  memorylimit: number;
  difficulty: {
    value: number;
    label: string;
  };
  tags: string[];
}