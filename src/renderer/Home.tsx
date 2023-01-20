import { AppFooter } from '@/components/AppFooter';
import { MetadataEditor } from '@/components/MetadataEditor';
import { PaintingList } from '@/components/PaintingList';
import { SplitPane } from '@/components/SplitPane';
import { useSelector } from '@/utils/store';
import { Blocks } from 'react-loader-spinner';
import styles from './Home.module.scss';

export default function Home() {
  const loading = useSelector((state) => state.editor.loading);

  return (
    <>
      {!loading ? null : (
        <div className={styles['loading-overlay']}>
          <Blocks height={200} width={200} />
        </div>
      )}

      <div className={styles['page-wrapper']}>
        <SplitPane>
          <MetadataEditor />
          <PaintingList />
        </SplitPane>
        <AppFooter className={styles['footer']} />
      </div>
    </>
  );
}
