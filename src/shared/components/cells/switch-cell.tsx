import { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Switch } from 'antd';

export const SwitchCell: FC<{ checked: boolean; onChange?: (value) => any; disabled?: boolean }> = ({ checked: baseChecked, onChange: baseOnChange, disabled }) => {
    const [checked, setChecked] = useState(baseChecked);
    const [loading, setLoading] = useState<boolean>(false);

    const styles = useMemo(
        () => ({
            wrapper: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
        }),
        [],
    );

    const stopPropagation = useCallback((event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    const onChange = useCallback(
        async (checked: boolean) => {
            try {
                setLoading(true);
                await baseOnChange?.(checked);
                setChecked(checked);
            } catch (e) {
                setChecked(!checked);
            } finally {
                setLoading(false);
            }
        },
        [baseOnChange],
    );

    useEffect(() => {
        setChecked(baseChecked);
    }, [baseChecked]);

    return (
        <div onClick={stopPropagation} style={styles.wrapper}>
            <Switch loading={loading} disabled={disabled} checked={checked} onChange={onChange} />
        </div>
    );
};
