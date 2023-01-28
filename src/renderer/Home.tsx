import { AppFooter } from '@/components/AppFooter';
import { MetadataEditor } from '@/components/MetadataEditor';
import { PaintingList } from '@/components/PaintingList';
import { HorizontalSplitPane, VerticalSplitPane } from '@/components/SplitPane';
import { useSelector } from '@/utils/store';
import { migrationsSelectors } from '@common/store/migrations';
import { Blocks } from 'react-loader-spinner';
import { MigrationList } from './components/MigrationList';
import { SplitModal } from './components/SplitModal';
import styles from './Home.module.scss';

export default function Home() {
  const hasOverlay = useSelector((state) => !!state.editor.overlay);
  const loading = useSelector((state) => state.editor.overlay === 'loading');
  const splitting = useSelector(
    (state) => state.editor.overlay === 'splitting'
  );
  const hasMigrations = useSelector(migrationsSelectors.selectTotal) > 0;

  return (
    <>
      {!loading ? null : (
        <div className={styles['overlay']}>
          <Blocks height={200} width={200} />
        </div>
      )}

      {!splitting ? null : (
        <div className={styles['overlay']}>
          <SplitModal />
        </div>
      )}

      <fieldset disabled={hasOverlay} className={styles['page-wrapper']}>
        <HorizontalSplitPane>
          {hasMigrations ? (
            <VerticalSplitPane titles={['Metadata', 'Migrations']}>
              <MetadataEditor />
              <MigrationList />
            </VerticalSplitPane>
          ) : (
            <MetadataEditor />
          )}
          <PaintingList />
        </HorizontalSplitPane>
        <AppFooter className={styles['footer']} />
      </fieldset>
    </>
  );
}
