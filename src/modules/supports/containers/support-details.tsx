import { ChangeEvent, FC, Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { FormikHelpers, useFormik } from 'formik';
import { useQuery, useQueryClient } from 'react-query';
import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import { SuspenseSpin } from '@shared/styled/spin';
import { StatusesService } from '@modules/statuses/services';
import { SupportInboxUI } from '../components';
import { useSupport, useSupportMessageTemplates } from '../hooks';
import { SupportsService } from '../services';

type MessageForm = { body: string; files: File[] };

const getAvatarText = (value: string) => {
  const [name, surname] = (value || '').split(' ');
  if (!name) return '??';
  if (!surname) return name.substring(0, 2).toUpperCase();
  return (name[0] + surname[0]).toUpperCase();
};

export const SupportDetails: FC = () => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useSupport(id);
  const templates = useSupportMessageTemplates();

  const { data: statusesResult } = useQuery(['statuses-for-support-detail', 9], () => StatusesService.getList({ per_page: 500, model_id: 9 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const initialValues = useMemo<MessageForm>(() => ({ body: '', files: [] }), []);

  const onSubmit = useCallback(
    async (values: MessageForm, helpers: FormikHelpers<MessageForm>) => {
      const result = await SupportsService.createMessage(id!, values.body, values.files);
      if (result.status === 200) {
        helpers.resetForm();
        await queryClient.invalidateQueries(['supports', id]);
      } else {
        message.error(result.data as string);
      }
    },
    [id, queryClient],
  );

  const { handleChange, handleBlur, values, handleSubmit, isSubmitting, setFieldValue } = useFormik<MessageForm>({ initialValues, onSubmit, enableReinitialize: true });

  const deleteMessage = useCallback(
    async (messageId: number) => {
      const result = await SupportsService.deleteMessage(messageId);
      if (result.status === 200) await queryClient.invalidateQueries(['supports', id]);
      else message.error(result.data as string);
    },
    [id, queryClient],
  );

  const updateStatus = useCallback(
    async (statusId: number) => {
      message.loading({ key: 's-status', content: 'Əməliyyat aparılır...', duration: 0 });
      const result = await SupportsService.changeStatus([Number(id)], statusId);
      if (result.status === 200) {
        message.success({ key: 's-status', content: 'Status dəyişdirildi' });
        await queryClient.invalidateQueries(['supports', id]);
      } else {
        message.error({ key: 's-status', content: result.data as string });
      }
    },
    [id, queryClient],
  );

  const toggleRead = useCallback(async () => {
    const result = await SupportsService.toggleRead([Number(id)], !!data?.read);
    if (result.status === 200) await queryClient.invalidateQueries(['supports', id]);
    else message.error(result.data as string);
  }, [data?.read, id, queryClient]);

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Müraciəti silməyə əminsinizmi?',
      onOk: async () => {
        const result = await SupportsService.cancel([Number(id)]);
        if (result.status === 200) navigate('/supports');
        else message.error(result.data as string);
      },
    });
  }, [id, navigate]);

  const handleFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue('files', Array.from(event.target.files || []));
    },
    [setFieldValue],
  );

  const removeFile = useCallback((removedIndex: number) => setFieldValue('files', values.files.filter((_, index) => index !== removedIndex)), [setFieldValue, values.files]);

  const autoResize = useCallback(
    (callback?: (e: ChangeEvent<HTMLTextAreaElement>) => void) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      event.target.style.height = 'auto';
      event.target.style.height = `${event.target.scrollHeight}px`;
      return callback ? callback(event) : undefined;
    },
    [],
  );

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [data]);

  if (isLoading) return <SuspenseSpin />;
  if (!data) return null;

  const statusItems: MenuProps['items'] = statuses.map((s) => ({ key: s.id, label: s.name, onClick: () => updateStatus(s.id) }));
  const templateItems: MenuProps['items'] = (templates.data || []).map((t) => ({ key: t.id, label: t.title, onClick: () => setFieldValue('body', t.body) }));

  return (
    <SupportInboxUI.Wrapper>
      <SupportInboxUI.Header>
        <SupportInboxUI.Title>
          <Icons.LeftCircleOutlined onClick={() => navigate('/supports')} role="icon" /> #{data.id} - {data.category.name} ({data.client.name} #{data.client.id})
        </SupportInboxUI.Title>
        <SupportInboxUI.HeaderExtra>
          <Button onClick={toggleRead} icon={<Icons.ReadOutlined />} type="link">
            {data.read ? 'Oxunmamış et' : 'Oxunmuş et'}
          </Button>
          <Dropdown menu={{ items: statusItems }}>
            <Button icon={<Icons.AppstoreOutlined />} type="link">
              Status dəyiş
            </Button>
          </Dropdown>
          <Button onClick={() => navigate(`/archive-status?object_id=${id}&model_id=9`)} icon={<Icons.HistoryOutlined />} type="link">
            Status tarixçəsi
          </Button>
          <Button onClick={remove} icon={<Icons.DeleteOutlined />} type="link" danger />
        </SupportInboxUI.HeaderExtra>
      </SupportInboxUI.Header>

      <SupportInboxUI.Body ref={bodyRef}>
        <SupportInboxUI.BodyInner>
          {data.messages.map((msg) => (
            <Fragment key={msg.id}>
              <SupportInboxUI.MessageRow $mode={msg.sender.role === 'admin' ? 'rtl' : 'ltr'}>
                {msg.sender.role !== 'admin' && <SupportInboxUI.MessageAvatar>{getAvatarText(msg.sender.name)}</SupportInboxUI.MessageAvatar>}
                <SupportInboxUI.Message $color={msg.sender.role === 'admin' ? '#E5FFD0' : undefined}>
                  <SupportInboxUI.MessageBody>
                    <SupportInboxUI.MessageOwner $mode={msg.sender.role === 'admin' ? 'rtl' : 'ltr'}>{msg.sender.name}</SupportInboxUI.MessageOwner>
                    {msg.sender.role === 'admin' && (
                      <SupportInboxUI.MessageOwner $mode="rtl">
                        <Button onClick={() => deleteMessage(msg.id)} icon={<Icons.DeleteOutlined />} type="link" danger size="small" />
                      </SupportInboxUI.MessageOwner>
                    )}
                    <div>{msg.message}</div>
                  </SupportInboxUI.MessageBody>
                  <SupportInboxUI.MessageTime>{msg.createdAt}</SupportInboxUI.MessageTime>
                </SupportInboxUI.Message>
                {msg.sender.role === 'admin' && <SupportInboxUI.MessageAvatar>{getAvatarText(msg.sender.name)}</SupportInboxUI.MessageAvatar>}
              </SupportInboxUI.MessageRow>
              {!!msg.documents.length && (
                <SupportInboxUI.MessageRow>
                  <SupportInboxUI.MessageFiles $mode={msg.sender.role === 'admin' ? 'rtl' : 'ltr'}>
                    {msg.documents.map((document) => (
                      <SupportInboxUI.MessageFile href={document.url} target="_blank" rel="noreferrer noopener" key={document.url}>
                        <SupportInboxUI.MessageFileIcon>
                          <Icons.FileOutlined />
                        </SupportInboxUI.MessageFileIcon>
                        <SupportInboxUI.MessageFileText>
                          <span>{document.name}</span>
                          <span>{document.extension}</span>
                        </SupportInboxUI.MessageFileText>
                      </SupportInboxUI.MessageFile>
                    ))}
                  </SupportInboxUI.MessageFiles>
                </SupportInboxUI.MessageRow>
              )}
            </Fragment>
          ))}
        </SupportInboxUI.BodyInner>
      </SupportInboxUI.Body>

      <form onSubmit={handleSubmit}>
        <SupportInboxUI.Footer>
          {!!values.files.length && (
            <SupportInboxUI.FooterRow>
              {values.files.map((file, index) => (
                <SupportInboxUI.FileCard key={index}>
                  <SupportInboxUI.FileCardText>{file.name}</SupportInboxUI.FileCardText>
                  <SupportInboxUI.FileCardRemove onClick={() => removeFile(index)}>
                    <Icons.CloseCircleOutlined />
                  </SupportInboxUI.FileCardRemove>
                </SupportInboxUI.FileCard>
              ))}
            </SupportInboxUI.FooterRow>
          )}
          <SupportInboxUI.FooterRow>
            <div style={{ flex: 1 }}>
              <SupportInboxUI.TextArea name="body" rows={1} value={values.body} onBlur={handleBlur} onChange={autoResize(handleChange)} placeholder="Mətni daxil edin..." />
            </div>
            <Dropdown placement="topRight" menu={{ items: templateItems }}>
              <SupportInboxUI.ActionLabel>
                <Icons.BulbOutlined />
              </SupportInboxUI.ActionLabel>
            </Dropdown>
            <SupportInboxUI.ActionLabel>
              <Icons.PaperClipOutlined />
              <SupportInboxUI.Upload name="files" multiple onBlur={handleBlur} onChange={handleFilesChange} />
            </SupportInboxUI.ActionLabel>
            <SupportInboxUI.Action disabled={isSubmitting} type="submit">
              {!isSubmitting ? <Icons.SendOutlined /> : <Icons.LoadingOutlined />}
            </SupportInboxUI.Action>
          </SupportInboxUI.FooterRow>
        </SupportInboxUI.Footer>
      </form>
    </SupportInboxUI.Wrapper>
  );
};
