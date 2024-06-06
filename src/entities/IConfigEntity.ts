export interface ITag {
  value: string;
  label: string;
}

export interface IConfigEntity {
  timelimit: number;
  memorylimit: number;
  difficulty: {
    value: number;
    label: string;
  };
  tags: ITag[];
}
