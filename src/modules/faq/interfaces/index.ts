export type IFaq = {
  id: number;
  question: string;
  answer: string;
  sort: string;
  createdAt: string;
};

export type IFaqFormValues = {
  question: string;
  answer: string;
  sort: string;
};
