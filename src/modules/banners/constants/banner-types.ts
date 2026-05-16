import { IBannerType } from "../interfaces";

export const bannerTypes: IBannerType[] = [
  { type: 1, title: "Ana səhifə (Masaüstü)", info: "Ölçü: 1920x600. Format: JPG, JPEG, PNG" },
  { type: 2, title: "Ana səhifə (Mobil)", info: "Ölçü: 750x1024. Format: JPG, JPEG, PNG" },
  { type: 3, title: "Xəbərlər", info: "Ölçü: 1000x500 - 2000x1000. Format: JPG, JPEG, PNG" },
  { type: 4, title: "Diqqət", info: "Format: SVG" },
  { type: 5, title: "Xidmətlər", info: "Format: SVG" },
  { type: 6, title: "Qeydiyyat", info: "Format: SVG" },
];
