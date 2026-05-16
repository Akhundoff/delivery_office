export enum PopupTarget {
  MOBILE = "mobil",
  WEBSITE = "web",
  BOTH = "both",
}

export enum PopupType {
  STANDART = "standart",
  SUCCESS = "success",
  WARNING = "warning",
}

export type IPopup = {
  id: number;
  title: string;
  message: string;
  startDate: string;
  endDate: string;
  buttonLink: string;
  buttonName: string;
  buttonLinkMobile: string;
  target: PopupTarget;
  type: PopupType;
  maxShowCount: number;
  createdAt: string;
};

export type IPopupFormValues = {
  title: string;
  message: string;
  startDate: string;
  endDate: string;
  buttonLink: string;
  buttonName: string;
  buttonLinkMobile: string;
  target: PopupTarget;
  type: PopupType;
  maxShowCount: string;
};
