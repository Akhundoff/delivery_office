import { useCallback } from 'react';
import Handlebars from 'handlebars';
import { message } from 'antd';
import { RefundsService } from '../../services';

export const usePrintSticker = () => {
  return useCallback(async (id: number) => {
    try {
      const templateResponse = await fetch('/src/assets/refund-sticker.hbs');
      if (!templateResponse.ok) {
        message.error('Stiker şablonu yüklənə bilmədi.');
        return;
      }
      const templateSource = await templateResponse.text();

      const result = await RefundsService.getById(id);
      if (result.status !== 200) {
        message.error(result.data as string);
        return;
      }

      const template = Handlebars.compile(templateSource);
      const html = template(result.data);

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch {
      message.error('Stiker çap edilə bilmədi.');
    }
  }, []);
};
