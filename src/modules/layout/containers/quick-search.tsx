import { Input, Switch, Tooltip, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { StyledHeaderButton } from '../styled';
import { useQuickSearch } from '../hooks';

export const QuickSearch = () => {
    const { isInputShown, searchInput, isTrendyol, isLoading, inputRef, onSubmit, onInputChange, handleBlur, onButtonClick, onClear, setIsTrendyol, checkDeclaration } = useQuickSearch();

    const inputPrefix = isLoading ? <Icons.LoadingOutlined /> : <Icons.SearchOutlined />;
    const inputSuffix = (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {searchInput.length > 0 && (
                <Icons.CloseCircleFilled
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    style={{ color: '#bfbfbf', fontSize: 14, cursor: 'pointer' }}
                />
            )}
            <span onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                <Tooltip
                    mouseEnterDelay={0.2}
                    placement='bottomRight'
                    overlayInnerStyle={{ background: '#fff', color: '#262626', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}
                    title={
                        <div style={{ maxWidth: 280 }}>
                            <Typography.Text strong style={{ color: '#262626' }}>
                                Trendyol axtarışı
                            </Typography.Text>
                            <br />
                            <Typography.Text style={{ fontSize: 12, color: '#595959', lineHeight: 1.6 }}>Yanılı olduqda yalnız Trendyol izləmə kodu (FDX000000001) ilə axtarılır.</Typography.Text>
                            <br />
                            <Typography.Text style={{ fontSize: 12, color: '#595959', lineHeight: 1.6 }}>Sönülü olduqda əvvəlcə bağlamanın izləmə kodu, tapılmazsa qlobal izləmə kodu ilə axtarılır.</Typography.Text>
                        </div>
                    }
                >
                    <Switch size='small' checked={isTrendyol} onChange={setIsTrendyol} style={{ marginRight: 0 }} />
                </Tooltip>
            </span>
        </span>
    );

    return (
        <form onSubmit={onSubmit} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 10px' }}>
            {isInputShown && (
                <Input
                    ref={inputRef}
                    disabled={isLoading}
                    prefix={inputPrefix}
                    suffix={inputSuffix}
                    autoFocus
                    placeholder='İzləmə kodu'
                    value={searchInput}
                    onChange={onInputChange}
                    onBlur={handleBlur}
                    onPressEnter={() => checkDeclaration(searchInput)}
                    style={{ borderRadius: 9999, height: 36, paddingLeft: 12, paddingRight: 12 }}
                />
            )}
            {!isInputShown && <StyledHeaderButton type='text' icon={<Icons.SearchOutlined />} onClick={onButtonClick} />}
        </form>
    );
};
