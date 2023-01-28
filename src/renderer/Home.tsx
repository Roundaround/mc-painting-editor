import { AboutModal } from '@/components/AboutModal';
import { AppFooter } from '@/components/AppFooter';
import { MetadataEditor } from '@/components/MetadataEditor';
import { MigrationList } from '@/components/MigrationList';
import { PaintingList } from '@/components/PaintingList';
import { SplitModal } from '@/components/SplitModal';
import { HorizontalSplitPane, VerticalSplitPane } from '@/components/SplitPane';
import { useSelector } from '@/utils/store';
import { migrationsSelectors } from '@common/store/migrations';
import { Blocks } from 'react-loader-spinner';
import styles from './Home.module.scss';

export default function Home() {
  const hasOverlay = useSelector((state) => !!state.editor.overlay);
  const isLoading = useSelector((state) => state.editor.overlay === 'loading');
  const showSplittingModal = useSelector(
    (state) => state.editor.overlay === 'splitting'
  );
  const showAboutModal = useSelector(
    (state) => state.editor.overlay === 'about'
  );
  const hasMigrations = useSelector(migrationsSelectors.selectTotal) > 0;

  return (
    <>
      {!isLoading ? null : (
        <div className={styles['overlay']}>
          <Blocks height={200} width={200} />
        </div>
      )}

      {!showSplittingModal ? null : (
        <div className={styles['overlay']}>
          <SplitModal />
        </div>
      )}

      {!showAboutModal ? null : (
        <div className={styles['overlay']}>
          <AboutModal />
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
