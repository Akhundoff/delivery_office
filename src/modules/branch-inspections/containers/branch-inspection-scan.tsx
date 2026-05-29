import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Spin, message } from 'antd';
import * as Icons from '@ant-design/icons';
import styled from 'styled-components';
import { BarcodeScan } from '@shared/components/barcode-scan';
import { BranchInspectionsService } from '../services';
import { useBranchInspectionById } from '../hooks';
import { IScanItem } from '../interfaces';

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #f5f5f5;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Btn = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: ${(props) => (props.$primary || props.$danger ? 'none' : '1px solid #d9d9d9')};
  background-color: ${(props) => (props.$primary ? '#1890ff' : props.$danger ? '#ff4d4f' : '#fff')};
  color: ${(props) => (props.$primary || props.$danger ? '#fff' : '#262626')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  display: flex;
  height: calc(100vh - 137px);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  width: 50%;
  padding: 24px;
  overflow: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightPanel = styled.div`
  width: 50%;
  background-color: #fff;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e8e8e8;
    min-height: 500px;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 24px;
  margin-bottom: 24px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }
`;

const LastScanned = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StatValue = styled.p<{ $color?: string }>`
  font-size: 32px;
  font-weight: 600;
  color: ${(props) => props.$color || '#262626'};
  margin: 0;
`;

const ScanList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const ScanItem = styled.div<{ $status: 'pending' | 'success' | 'error' }>`
  padding: 9px;
  border-radius: 6px;
  border: 2px solid ${(props) => (props.$status === 'success' ? '#b7eb8f' : props.$status === 'error' ? '#ffa39e' : '#d9d9d9')};
  background-color: ${(props) => (props.$status === 'success' ? '#f6ffed' : props.$status === 'error' ? '#fff1f0' : '#fafafa')};
  margin-bottom: 8px;
`;

const ScanCodeText = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  word-break: break-all;
`;

const RightHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #bfbfbf;
`;

export const BranchInspectionScan: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [trackCode, setTrackCode] = useState('');
  const [scanData, setScanData] = useState<IScanItem[]>([]);
  const [lastScanned, setLastScanned] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [scanQueue, setScanQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: inspectionData, isFetching: inspectionLoading } = useBranchInspectionById(id);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [scanData]);

  useEffect(() => {
    const loadScans = async () => {
      setInitialLoading(true);
      const result = await BranchInspectionsService.getScans(id!);
      if (result.status === 200) {
        setScanData(result.data.map((scan) => ({ ...scan, status: 'success' as const })));
      } else {
        message.error(result.data as string);
      }
      setInitialLoading(false);
    };
    loadScans();
  }, [id]);

  useEffect(() => {
    const processScanQueue = async () => {
      if (scanQueue.length === 0 || isProcessing) return;
      setIsProcessing(true);
      const currentTrackCode = scanQueue[0];
      const tempId = Date.now();

      const newScan: IScanItem = {
        id: tempId,
        inspectionId: parseInt(id!, 10),
        declarationId: 0,
        trackCode: currentTrackCode,
        trendyol: 0,
        barcode: currentTrackCode,
        partnerId: null,
        scannedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      setScanData((prev) => [newScan, ...prev]);

      const result = await BranchInspectionsService.scanTrackingCode(id!, currentTrackCode);
      setScanData((prev) =>
        prev.map((item) => {
          if (item.id !== tempId) return item;
          if (result.status === 200) return { ...result.data, status: 'success' as const };
          return { ...item, status: 'error' as const, errorMessage: result.data as string };
        }),
      );
      setScanQueue((prev) => prev.slice(1));
      setIsProcessing(false);
    };
    processScanQueue();
  }, [scanQueue, isProcessing, id]);

  const handleScan = useCallback(() => {
    if (!trackCode.trim()) return;
    setScanQueue((prev) => [...prev, trackCode]);
    setLastScanned(trackCode);
    setTrackCode('');
  }, [trackCode]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan();
  };

  const handleReset = () => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Bütün scan məlumatları silinəcək və proses yenidən başlayacaq. Əminsiniz?',
      okText: 'Bəli',
      cancelText: 'Xeyr',
      onOk: () => {
        setScanData([]);
        setTrackCode('');
        setLastScanned('');
        message.success('Məlumatlar sıfırlandı');
      },
    });
  };

  const handleFinish = () => {
    if (scanData.length === 0) {
      message.warning('Heç bir bağlama scan olunmayıb!');
      return;
    }
    Modal.confirm({
      title: 'Yoxlanışı bitirmək',
      content: `Yoxlanış tamamlanacaq. Cəmi ${scanData.length} bağlama scan olundu. Əminsiniz?`,
      okText: 'Bitir',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await BranchInspectionsService.changeStatus(id!, 157);
        if (result.status === 200) {
          message.success('Yoxlanış tamamlandı!');
          navigate(-1);
        } else {
          message.error(result.data as string);
        }
      },
    });
  };

  const handleRetry = useCallback((scan: IScanItem) => {
    setScanData((prev) => prev.filter((item) => item.id !== scan.id));
    setScanQueue((prev) => [...prev, scan.trackCode?.toString() || '']);
  }, []);

  const successCount = scanData.filter((item) => item.status === 'success').length;
  const errorCount = scanData.filter((item) => item.status === 'error').length;
  const canScan = inspectionData?.stateId === 155 || inspectionData?.stateId === 156;

  const getDisplayCode = (scan: IScanItem) => (scan.trendyol && scan.trendyol > 0 && scan.barcode ? scan.barcode : scan.trackCode?.toString() || '');

  if (initialLoading || inspectionLoading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <Btn onClick={() => navigate(-1)}>
            <Icons.ArrowLeftOutlined />
          </Btn>
          <HeaderTitle>
            #{inspectionData?.id} - {inspectionData?.branch.name}
          </HeaderTitle>
        </HeaderLeft>
        <HeaderButtons>
          <Btn onClick={handleReset} disabled={scanData.length === 0}>
            <Icons.ReloadOutlined />
            Sıfırla
          </Btn>
          <Btn $primary onClick={handleFinish}>
            <Icons.CheckCircleOutlined />
            Yoxlanışı bitir
          </Btn>
        </HeaderButtons>
      </Header>

      <Content>
        <LeftPanel>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <BarcodeScan barcode={lastScanned || 'Scan et'} />
            </div>
            <TextInput
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={canScan ? 'İzləmə kodunu daxil edin və ya scan edin...' : 'Yoxlanış statusu düzgün deyil'}
              autoFocus
              disabled={!canScan}
            />
            <Btn $primary onClick={handleScan} disabled={!trackCode.trim() || !canScan} style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
              Scan et
            </Btn>
            {!canScan && (
              <div style={{ marginTop: 12, padding: 12, backgroundColor: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 6, color: '#cf1322' }}>
                <Icons.ExclamationCircleOutlined style={{ marginRight: 8 }} />
                Yoxlanış statusu düzgün deyil. Yalnız 155 və ya 156 statusunda scan edilə bilər.
              </div>
            )}
            {lastScanned && (
              <LastScanned>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>Son oxudulan:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{lastScanned}</span>
              </LastScanned>
            )}
          </Card>

          <StatGrid>
            <Card>
              <p style={{ color: '#8c8c8c', margin: 0 }}>Uğurlu</p>
              <StatValue $color="#52c41a">{successCount}</StatValue>
            </Card>
            <Card>
              <p style={{ color: '#8c8c8c', margin: 0 }}>Xəta</p>
              <StatValue $color="#ff4d4f">{errorCount}</StatValue>
            </Card>
          </StatGrid>
        </LeftPanel>

        <RightPanel>
          <RightHeader>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Scan olunmuş bağlamalar</h2>
            <p style={{ fontSize: 14, color: '#8c8c8c', margin: 0 }}>Ən yeni bağlamalar yuxarıda göstərilir</p>
          </RightHeader>

          {scanData.length === 0 ? (
            <EmptyState>
              <Icons.InboxOutlined style={{ fontSize: 48 }} />
              <p style={{ fontSize: 16, color: '#595959', marginTop: 16 }}>Hələ heç bir bağlama scan olunmayıb</p>
            </EmptyState>
          ) : (
            <ScanList ref={scrollRef}>
              {scanData.map((item) => (
                <ScanItem key={item.id} $status={item.status}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                      <div>
                        {item.status === 'success' && <Icons.CheckCircleOutlined style={{ fontSize: 18, color: '#389e0d' }} />}
                        {item.status === 'error' && <Icons.CloseCircleOutlined style={{ fontSize: 18, color: '#cf1322' }} />}
                        {item.status === 'pending' && <Icons.LoadingOutlined style={{ fontSize: 18 }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <ScanCodeText>{getDisplayCode(item)}</ScanCodeText>
                        <p style={{ fontSize: 11, color: '#8c8c8c', margin: 0 }}>{new Date(item.scannedAt).toLocaleTimeString('az-AZ')}</p>
                        {item.status === 'error' && item.errorMessage && (
                          <div style={{ marginTop: 6, padding: 6, backgroundColor: '#ffccc7', borderRadius: 4, fontSize: 11, color: '#a8071a' }}>{item.errorMessage}</div>
                        )}
                      </div>
                    </div>
                    {item.status === 'error' && (
                      <button onClick={() => handleRetry(item)} style={{ border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff', fontSize: 11, padding: '3px 6px', cursor: 'pointer' }}>
                        <Icons.ReloadOutlined /> Yenidən
                      </button>
                    )}
                  </div>
                </ScanItem>
              ))}
            </ScanList>
          )}
        </RightPanel>
      </Content>
    </PageContainer>
  );
};
