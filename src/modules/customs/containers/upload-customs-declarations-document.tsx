import { FC, useContext, useState } from 'react';
import { Modal, Upload, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { StyledHeaderButton } from '@modules/layout/styled';
import { CustomsDeclarationsTableContext } from '../context';
import { CustomsDeclarationsService } from '../services';

export const UploadCustomsDeclarationsDocument: FC = () => {
  const { handleFetch } = useContext(CustomsDeclarationsTableContext);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const result = await CustomsDeclarationsService.uploadDocument(file);
    setLoading(false);

    if (result.status === 200) {
      message.success('Sənəd uğurla yükləndi.');
      handleFetch();
      const { counts } = result.data;
      Modal.info({
        title: 'Nəticə',
        content: (
          <div>
            <p>Bəyan edilmiş: {counts.declared}</p>
            <p>Bəyan edilməmiş: {counts.undeclared}</p>
            <p>Mövcud olmayan müştərilər: {counts.nonExistUsers}</p>
          </div>
        ),
      });
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Upload
      accept="application/json"
      beforeUpload={(file) => {
        handleUpload(file);
        return false;
      }}
      showUploadList={false}
    >
      <StyledHeaderButton type="text" icon={<Icons.UploadOutlined />} loading={loading}>
        Yüklə
      </StyledHeaderButton>
    </Upload>
  );
};
