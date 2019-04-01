// @flow
import scroll from 'scroll-into-view-if-needed';
import logger from 'utils/logger';

type OptionalProps = {
  boundaryId?: string,
  scrollMode?: string,
};

type Props = OptionalProps & {
  targetId: string,
};

const defaultProps = {
  boundaryId: null,
  scrollMode: 'if-needed',
};

const scrollIntoView = ({ targetId, boundaryId, scrollMode }: Props) => {
  const node = document.querySelector(`#${targetId}`);
  const boundaryNode = boundaryId ? document.querySelector(`#${boundaryId}`) : null;

  if (node) {
    logger.warn('scroll to element', targetId, boundaryId);
    if (boundaryNode) {
      scroll(node, {
        scrollMode,
        behavior: 'smooth',
        boundary: boundaryNode,
      });
    } else {
      scroll(node, {
        scrollMode,
        behavior: 'smooth',
      });
    }
  } else {
    // wait for the element is rendering on DOM
    const retryFindElement = () => {
      const foundElement = document.querySelector(`#${targetId}`);
      if (!foundElement) {
        requestAnimationFrame(retryFindElement);
      } else {
        // force to scroll to element
        scrollIntoView({ targetId, boundaryId, scrollMode: 'always' });
      }
    };
    requestAnimationFrame(retryFindElement);
  }
};

scrollIntoView.defaultProps = defaultProps;

export default scrollIntoView;
