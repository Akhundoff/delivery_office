import { useCallback, useContext } from 'react';
import { message } from 'antd';
import * as handlebars from 'handlebars';
import dayjs from 'dayjs';

import { Constants } from '@shared/constants';
import { MeContext } from '@modules/me';
import { DeclarationsService } from '../../services';
import { IDeclaration } from '../../interfaces';
import { waybillTemplate, proformaInvoiceTemplate, handoverTemplate } from '../../templates';

const registerHelpers = () => {
  if ((handlebars as any)._declarationHelpersRegistered) return;
  handlebars.registerHelper('addOne', (value: any) => parseInt(value, 10) + 1);
  handlebars.registerHelper('eq', (a: any, b: any) => a === b);
  (handlebars as any)._declarationHelpersRegistered = true;
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

export const printProformaInvoiceForIds = async (ids: (string | number)[]) => {
  const hide = message.loading('Proforma invoys hazırlanır.', 0);
  const result = await DeclarationsService.getProformaInvoice(ids);
  hide();
  if (result.status !== 200) {
    message.error(result.data as string);
    return;
  }
  registerHelpers();
  const html = handlebars.compile(proformaInvoiceTemplate)({
    ...result.data,
    shipper: {
      name: process.env.REACT_APP_SHIPPER,
      address: process.env.REACT_APP_SHIPPER_ADDRESS,
      phoneNumber: process.env.REACT_APP_SHIPPER_PHONE_NUMBER,
      city: process.env.REACT_APP_SHIPPER_CITY,
      postalCode: process.env.REACT_APP_SHIPPER_POSTAL_CODE,
      country: process.env.REACT_APP_SHIPPER_COUNTRY,
    },
  });
  openPrintWindow(html);
};

export const usePrint = (id: string) => {
  const me = useContext(MeContext);

  const printWaybill = useCallback(async () => {
    const hide = message.loading('Yol vərəqəsi hazırlanır.', 0);
    const result = await DeclarationsService.getWaybills(id);
    hide();
    if (result.status !== 200) {
      message.error(result.data as string);
      return;
    }
    registerHelpers();
    const html = handlebars.compile(waybillTemplate)({
      declarations: result.data.map((elem) => ({
        ...elem,
        oneCol: elem.currency === 'USD',
        trackCode: elem.provider === 2 ? elem.barcode : elem.trackCode,
      })),
      company: process.env.REACT_APP_COMPANY_NAME?.toUpperCase(),
      shipper: process.env.REACT_APP_SHIPPER,
      address: process.env.REACT_APP_SHIPPER_ADDRESS,
    });
    openPrintWindow(html);
  }, [id]);

  const printProformaInvoice = useCallback(() => printProformaInvoiceForIds([id]), [id]);

  const printHandoverCheck = useCallback(
    (declaration?: IDeclaration | null) => {
      if (!declaration) return;
      registerHelpers();
      const user = me.state.user.data;
      const html = handlebars.compile(handoverTemplate)({
        ...declaration,
        warehouseman: user ? `${user.firstName} ${user.lastName}`.trim() : '',
        checkDate: dayjs().format(Constants.DATE_TIME),
      });
      openPrintWindow(html);
    },
    [me.state.user.data],
  );

  return { printWaybill, printProformaInvoice, printHandoverCheck };
};
