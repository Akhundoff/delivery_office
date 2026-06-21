import { message } from 'antd';
import * as handlebars from 'handlebars';
import dayjs from 'dayjs';
import { Constants } from '@shared/constants';
import { IMeUser } from '@modules/me/context/types';
import { IDetailedHandoverQueue } from '../interfaces';
import { handoverTemplate } from '../templates';

const registerHelpers = () => {
  if ((handlebars as any)._warehouseHelpersRegistered) return;
  handlebars.registerHelper('addOne', (value: any) => parseInt(value, 10) + 1);
  handlebars.registerHelper('eq', (a: any, b: any) => a === b);
  (handlebars as any)._warehouseHelpersRegistered = true;
};

const openPrintWindow = (html: string) => {
  const printWindow = window.open();
  if (!printWindow) {
    message.error('Brauzerdə xəta baş verdi.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
};

export const printHandoverCheck = async (user: IMeUser | null, handoverTaskId: number | string, data: IDetailedHandoverQueue) => {
  if (!handoverTaskId || !data) return;

  registerHelpers();
  const hide = message.loading('Çek hazırlanır.', 0);

  try {
    const html = handlebars.compile(handoverTemplate)({
      ...data,
      warehouseman: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      checkDate: dayjs().format(Constants.DATE_TIME),
      handoverTaskId: `HT${handoverTaskId}`,
    });

    hide();
    openPrintWindow(html);
  } catch (e: any) {
    hide();
    message.error(e.message || 'Şablon əldə edilə bilmədi.');
  }
};
