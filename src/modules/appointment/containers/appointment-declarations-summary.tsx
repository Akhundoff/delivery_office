import { useContext, useMemo } from 'react';
import { Typography } from 'antd';
import { TinyDeclarationsTableContext } from '@modules/declarations/context';

export const AppointmentDeclarationsSummary = () => {
  const { state } = useContext(TinyDeclarationsTableContext);

  const totalPrice = useMemo(() => {
    const usd = state.data.reduce((acc: number, item: any) => acc + (item.deliveryPrice || 0), 0);
    const azn = Math.round(usd * 1.7 * 100) / 100;
    return { usd: usd.toFixed(2), azn: azn.toFixed(2) };
  }, [state.data]);

  return (
    <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
      <b>Ümumi məbləğ: </b> ${totalPrice.usd} / ₼{totalPrice.azn}
    </Typography.Paragraph>
  );
};
