export type INews = {
  id: number;
  title: string;
  descr: string;
  body: string;
  cover: string;
  image: string;
  createdAt: string;
};

export type INewsFormValues = {
  title: string;
  descr: string;
  body: string;
  image: File | null;
};
