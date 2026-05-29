export interface IBranchPartner {
  id: number;
  name: string;
}

export interface IPartnerDeclarationStatistic {
  id: string;
  count: number;
  productPrice: number;
  deliveryPrice: number;
  updatedAt: string;
}

export interface IPartnerStatisticsTotal {
  count: number;
  deliveryPrice: number;
  productPrice: number;
}
