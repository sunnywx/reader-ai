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

export type OnlineBook ={
  id: string
  title: string
  authors?: string
  download_url: string
  extension?: string  // ext name
  language?: string
  pages?: string
  publisher?: string
  size?: string
  year?: string
}