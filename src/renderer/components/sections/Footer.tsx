import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, HTMLProps } from 'react';
import { useMemo } from 'react';

import { paintingsSelectors } from '$common/store/paintings';
import { InlineButton } from '$renderer/components/InlineButton';
import { clsxm } from '$renderer/utils/clsxm';
import { useDispatch, useSelector } from '$renderer/utils/store';
import {
  filtersActions,
  filtersSelectors,
} from '$renderer/utils/store/filters';

const { selectMatchingPaintings } = filtersSelectors;
const { showMissingId, showMissingImage } = filtersActions;

interface FooterProps extends HTMLProps<HTMLDivElement> {}

export const Footer: FC<FooterProps> = ({ className, ...props }) => {
  const paintingCount = useSelector(paintingsSelectors.selectTotal);
  const paintings = useSelector(paintingsSelectors.selectAll);
  const filteredPaintings = useSelector(selectMatchingPaintings);
  const paintingsWithWarnings = useSelector(
    paintingsSelectors.selectWithWarnings,
  );

  const paintingsWithoutImage = useMemo(() => {
    return paintings.filter((painting) => !painting.path).length;
  }, [paintings]);
  const paintingsWithoutId = useMemo(() => {
    return paintings.filter((painting) => !painting.id).length;
  }, [paintings]);

  const dispatch = useDispatch();

  const footerElementClasses =
    'py-0 px-2 flex-fixed leading-relaxed inline-flex items-center';
  const statClasses = clsxm(footerElementClasses, 'justify-center gap-1');
  const errorStatClasses = clsxm(statClasses, 'bg-red-900');

  return (
    <div
      className={clsxm(
        'flex flex-row items-stretch bg-blue-600 px-2 text-sm text-gray-100',
        className,
      )}
      {...props}
    >
      <span className={footerElementClasses}>Made with ❤️ by Roundaround</span>
      <span className="flex-1"></span>
      {!paintingsWithoutId ? null : (
        <InlineButton
          className={errorStatClasses}
          onClick={() => {
            dispatch(showMissingId());
          }}
          tooltip={{
            content:
              `${paintingsWithoutImage} painting(s) are missing an ID. ` +
              `Click to automatically set your filters to see them.`,
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} className="h-3 w-3" />
          <span>Needs ID:</span>
          <span className="font-mono">{paintingsWithoutId}</span>
        </InlineButton>
      )}
      {!paintingsWithoutImage ? null : (
        <InlineButton
          className={errorStatClasses}
          onClick={() => {
            dispatch(showMissingImage());
          }}
          tooltip={{
            content:
              `${paintingsWithoutImage} painting(s) are missing an image. ` +
              `Click to automatically set your filters to see them.`,
          }}
        >
          <FontAwesomeIcon icon={'triangle-exclamation'} className="h-3 w-3" />
          <span>Needs image:</span>
          <span className="font-mono">{paintingsWithoutImage}</span>
        </InlineButton>
      )}
      {paintingsWithWarnings.length === 0 ? null : (
        <span className={statClasses}>
          <FontAwesomeIcon icon={'triangle-exclamation'} className="h-3 w-3" />
          <span>With warnings:</span>
          <span className="font-mono">{paintingsWithWarnings.length}</span>
        </span>
      )}
      {filteredPaintings.length === paintingCount ? null : (
        <span className={statClasses}>
          <span>Matching filters:</span>
          <span className="font-mono">{filteredPaintings.length}</span>
        </span>
      )}
      <span className={statClasses}>
        <span>Total paintings:</span>
        <span className="font-mono">{paintingCount}</span>
      </span>
    </div>
  );
};

export default Footer;
