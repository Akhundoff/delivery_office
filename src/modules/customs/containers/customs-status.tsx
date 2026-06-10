import { Tag, Tooltip } from 'antd';
import { useCustomsStatus } from '../hooks';

export const CustomsStatus = () => {
    const { title, status, icon, handleMouseEnter } = useCustomsStatus();

    return (
        <span onMouseEnter={handleMouseEnter}>
            <Tooltip title={title}>
                <Tag icon={icon} color={status} style={{ marginInlineEnd: 0 }}>
                    DGK
                </Tag>
            </Tooltip>
        </span>
    );
};
