import { FC, useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useQuery } from 'react-query';
import { decode } from 'html-entities';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PageContent } from '@shared/styled/page-content';
import { AboutService } from '../services';

export const AboutPage: FC = () => {
    const [body, setBody] = useState('');
    const [saving, setSaving] = useState(false);

    const { data, isLoading } = useQuery(['about'], async () => {
        const result = await AboutService.get();
        if (result.status === 200) return result.data;
        throw new Error(result.data);
    });

    useEffect(() => {
        if (data) setBody(decode(data));
    }, [data]);

    const handleSave = async () => {
        setSaving(true);
        const result = await AboutService.save(body);
        if (result.status === 200) {
            message.success('Dəyişikliklər saxlanıldı');
        } else {
            message.error(result.data || 'Xəta baş verdi');
        }
        setSaving(false);
    };

    return (
        <PageContent $contain={true}>
            {isLoading ? (
                <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
            ) : (
                <>
                    <CKEditor
                        editor={ClassicEditor}
                        data={body}
                        onChange={(_event: any, editor: any) => setBody(editor.getData())}
                    />
                    <Button style={{ width: '100%', marginTop: 16 }} type='primary' loading={saving} onClick={handleSave} block>
                        Yadda saxla
                    </Button>
                </>
            )}
        </PageContent>
    );
};
