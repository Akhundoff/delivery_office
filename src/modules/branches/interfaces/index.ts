export type IFlyexLocation = {
  id: number;
  name: string;
  address: string;
  lat: string;
  lng: string;
  mapUrl: string;
  scheduleDescription: string;
};

export type IBranchListItem = {
  id: number;
  name: string;
  descr: string;
  address: string;
  phone: string;
  email: string;
  workinghours: string;
  isBranch: boolean;
  isRegionBranch: boolean;
  hide: boolean;
  sortingLetter: string;
  latitude: string;
  longitude: string;
  mapUrl: string;
  parent: { id: number; name: string } | null;
  status: { id: number; name: string } | null;
  company: { id: number; name: string } | null;
  createdAt: string;
};

export type IBranchDetail = IBranchListItem & {
  mapAddress: string;
  openHour: string;
  closeHour: string;
  openHourSaturday: string;
  closeHourSaturday: string;
  cityName: string;
  provinceName: string;
  postCode: string;
  warehouseMan: string;
};

export type IBranchWithDeliveryPoint = {
  id: number;
  name: string;
  companyId: number;
};

export type IBranchFormValues = {
  name: string;
  descr: string;
  address: string;
  phone: string;
  email: string;
  workinghours: string;
  isBranch: boolean;
  isRegionBranch: boolean;
  hide: boolean;
  latitude: string;
  longitude: string;
  mapUrl: string;
  mapAddress: string;
  parentId: string;
  stateId: string;
  companyId: string;
  sortingLetter: string;
  openHour: string;
  closeHour: string;
  openHourSaturday: string;
  closeHourSaturday: string;
  cityName: string;
  provinceName: string;
  postCode: string;
  warehouseMan: string;
};
