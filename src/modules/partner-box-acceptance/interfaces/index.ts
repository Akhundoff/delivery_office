export interface IAcceptanceBarcode {
  barcode: string;
  branch_name?: string;
  flight_name?: string;
}

export interface IAcceptanceDeclaration {
  trackCode: string;
  branch: { id: number; name: string } | null;
  flight: { id: number; name: string } | null;
  requiresDeclaration: boolean;
  isYourBranch: boolean;
  canAccommodate: boolean;
  locationName: string;
}
