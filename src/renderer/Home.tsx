import { AboutModal } from '@/components/modals/AboutModal';
import { SplitModal } from '@/components/modals/SplitModal';
import { Footer } from '@/components/sections/Footer';
import { MetadataEditor } from '@/components/sections/MetadataEditor';
import { MigrationList } from '@/components/sections/MigrationList';
import { PaintingList } from '@/components/sections/PaintingList';
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
          <Blocks height={200} width={200} wrapperClass={styles['loader']} />
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
            <VerticalSplitPane>
              <MetadataEditor />
              <MigrationList />
            </VerticalSplitPane>
          ) : (
            <MetadataEditor />
          )}
          <PaintingList />
        </HorizontalSplitPane>
        <Footer className={styles['footer']} />
      </fieldset>
    </>
  );
}
