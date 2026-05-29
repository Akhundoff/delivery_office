import styled, { css } from 'styled-components';

const PRIMARY = '#1da57a';
const PRIMARY_DARK = '#178a66';
const GRAY = '#f0f2f5';

const BaseButton = styled.button`
  background: transparent;
  box-shadow: none;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;

  &:focus {
    outline: 0;
  }
`;

const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 64px - 24px);
  min-height: 400px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
`;

const HeaderExtra = styled.div`
  padding: 0 8px;
`;

const Title = styled.h4`
  color: ${PRIMARY};
  margin: 0;
  padding: 12px;
  flex: 1;

  & > [role='icon'] {
    margin-right: 4px;
    cursor: pointer;
  }
`;

const Body = styled.div`
  flex: 1;
  background-color: #d6e3ee;
  overflow: auto;
  padding: 12px;
`;

const BodyInner = styled.div`
  display: grid;
  grid-gap: 12px;
`;

const MessageRow = styled.div<{ $mode?: 'ltr' | 'rtl' }>`
  display: flex;
  justify-content: ${({ $mode }) => ($mode === 'rtl' ? 'flex-end' : 'flex-start')};

  & > *:not(:last-child) {
    margin-right: 8px;
  }
`;

const Message = styled.div<{ $color?: string }>`
  max-width: 60%;
  padding: 4px 8px;
  background-color: ${({ $color }) => $color || GRAY};
  border-radius: 4px;
`;

const MessageAvatar = styled.div`
  border-radius: 50%;
  height: 42px;
  width: 42px;
  flex-shrink: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
`;

const MessageBody = styled.div`
  margin-bottom: 4px;
`;

const MessageOwner = styled.div<{ $mode?: 'ltr' | 'rtl' }>`
  text-align: ${({ $mode }) => ($mode === 'rtl' ? 'right' : 'left')};
  font-weight: 500;
`;

const MessageTime = styled.div`
  font-size: 12px;
  text-align: right;
`;

const Footer = styled.div`
  padding: 12px;
  display: grid;
  grid-gap: 12px;
  border-top: 1px solid #eee;
`;

const FooterRow = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 12px;
  }
`;

const TextArea = styled.textarea`
  border: none;
  background-color: ${GRAY};
  width: 100%;
  padding: 12px;
  outline: none;
  box-sizing: border-box;
  max-height: calc(21px * 3 + 24px);
  border-radius: 4px;
`;

const ActionStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: ${PRIMARY};
  height: 45px;
  width: 45px;
  border-radius: 50%;
  transition: background-color 0.2s;
  font-size: 18px;

  &:hover {
    background-color: ${PRIMARY_DARK};
    color: #fff;
  }
`;

const ActionLabel = styled.label`
  ${ActionStyle};
  cursor: pointer;
`;

const Action = styled(BaseButton)`
  ${ActionStyle};
  &:disabled {
    background-color: ${PRIMARY}b0;
  }
`;

const Upload = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const FileCard = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
`;

const FileCardText = styled.div`
  padding: 0 12px;
  font-size: 13px;
`;

const FileCardRemove = styled.div`
  cursor: pointer;
  display: flex;
  background-color: ${GRAY};
  padding: 7px 12px;
`;

const MessageFiles = styled.div<{ $mode?: 'ltr' | 'rtl' }>`
  display: flex;
  width: 100%;
  justify-content: ${({ $mode }) => ($mode === 'rtl' ? 'flex-end' : 'flex-start')};
  padding: ${({ $mode }) => ($mode === 'rtl' ? '0 50px 0 0' : '0 0 0 50px')};

  & > *:not(:last-child) {
    margin-right: 12px;
  }
`;

const MessageFile = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 8px;
  text-decoration: none;

  &:hover {
    color: #fff;
  }
`;

const MessageFileIcon = styled.div`
  height: 42px;
  width: 42px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageFileText = styled.div`
  line-height: 11px;
  font-size: 13px;
  margin-top: 4px;
  display: flex;

  & > span:first-child {
    display: block;
    max-width: 43px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SupportInboxUI = {
  Wrapper,
  Header,
  HeaderExtra,
  Title,
  Body,
  BodyInner,
  MessageRow,
  Footer,
  FooterRow,
  TextArea,
  Action,
  ActionLabel,
  Upload,
  FileCard,
  FileCardText,
  FileCardRemove,
  Message,
  MessageBody,
  MessageTime,
  MessageOwner,
  MessageAvatar,
  MessageFiles,
  MessageFile,
  MessageFileIcon,
  MessageFileText,
};
