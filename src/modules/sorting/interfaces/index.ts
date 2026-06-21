export type ISorting = {
  id: number;
  parcel: { must: number; count: number; lack: number };
  userId: number;
  branchName: string;
  state: { id: number; name: string };
  isDraft: boolean;
  isSendAzeriexpress: boolean;
  createdAt: string;
  accepted: number;
};

export type ISortingDeclaration = {
  id: number;
  trackCode: number;
  user: { id: number; name: string };
  flight: { id: number; name: string };
  branch: { id: number; name: string };
  declarationId: number;
  declarationState: { id: number; name: string };
  sortingState: { id: number; name: string };
};

export type INonSortedDeclaration = {
  id: number;
  declarationId: number;
  trackCode: string;
  user: { id: number; name: string };
  branch: { id: number; name: string } | null;
};

export type ITransferFlight = {
  id: number;
  flightId: number;
  flightName: string;
  totalDeclarations: number;
  notSortingDeclarations: number;
  sortingDeclarations: number;
};

export type ITransferInfo = {
  id: number;
  state: { id: number; name: string };
  branch: { id: number; name: string };
  user: { id: number };
  flights: ITransferFlight[];
  declaration: { all: number; count: number; thisFlight: number; anotherFlight: number; missing: number };
  isSendAzeriExpress: boolean;
};

export type ITransferBarcode = {
  barcode: string;
  parcel_sorting_id: number;
  checked?: boolean;
};

export type SortingDeclarationsView = 'total' | 'another' | 'sorting' | 'missing';

export type IAzeriExpressInfo = {
  senderName: string;
  senderEmail: string;
  formattedSenderMobile: string;
  receiverName: string;
  receiverEmail: string;
  formattedReceiverMobile: string;
  barcodeFullNumber: string;
  statusText: string;
  priorityText: string;
  weight: string;
  distance: string;
  packageContents: string;
  pickupInstructions: string;
  deliveryInstructions: string;
  createdAt: string;
};
