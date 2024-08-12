export type Book = {
  id?: string
  name: string;
  // author?: string
  coverImg?: string;
  size?: number;
  files?: Book[];
  createAt?: Date;
  prefix?: string;
};