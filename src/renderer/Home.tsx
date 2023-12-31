import { Blocks } from 'react-loader-spinner';

import { migrationsSelectors } from '$common/store/migrations';
import {
  HorizontalSplitPane,
  VerticalSplitPane,
} from '$renderer/components/SplitPane';
import { AboutModal } from '$renderer/components/modals/AboutModal';
import { SplitModal } from '$renderer/components/modals/SplitModal';
import { Footer } from '$renderer/components/sections/Footer';
import { MetadataEditor } from '$renderer/components/sections/MetadataEditor';
import { MigrationList } from '$renderer/components/sections/MigrationList';
import { PaintingList } from '$renderer/components/sections/PaintingList';
import { clsxm } from '$renderer/utils/clsxm';
import { useSelector } from '$renderer/utils/store';

import styles from './Home.module.scss';

export default function Home() {
  const hasOverlay = useSelector((state) => !!state.editor.overlay);
  const isLoading = useSelector((state) => state.editor.overlay === 'loading');
  const showSplittingModal = useSelector(
    (state) => state.editor.overlay === 'splitting',
  );
  const showAboutModal = useSelector(
    (state) => state.editor.overlay === 'about',
  );
  const hasMigrations = useSelector(migrationsSelectors.selectTotal) > 0;

  const overlayClasses = clsxm(styles['overlay'], 'bg-neutral-200/10');

  return (
    <>
      {!isLoading ? null : (
        <div className={overlayClasses}>
          <Blocks height={200} width={200} wrapperClass={styles['loader']} />
        </div>
      )}

      {!showSplittingModal ? null : (
        <div className={overlayClasses}>
          <SplitModal />
        </div>
      )}

      {!showAboutModal ? null : (
        <div className={overlayClasses}>
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
        <Footer className="flex-fixed" />
      </fieldset>
    </>
  );
}
