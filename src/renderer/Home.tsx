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
import { useSelector } from '$renderer/utils/store/root';

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

  const overlayClasses =
    'bg-neutral-200/10 fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center z-40';
  const loaderClasses = 'drop-shadow-lg';

  return (
    <>
      {!isLoading ? null : (
        <div className={overlayClasses}>
          <Blocks height={200} width={200} wrapperClass={loaderClasses} />
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

      <fieldset
        disabled={hasOverlay}
        className="flex h-full w-full flex-col rounded-none border-0 p-0"
      >
        <HorizontalSplitPane className="flex-full overflow-hidden">
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
