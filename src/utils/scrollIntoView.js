// @flow
import scroll from 'scroll-into-view-if-needed';

type OptionalProps = {
  boundaryId?: string,
};

type Props = OptionalProps & {
  targetId: string,
};

const defaultProps = {
  boundaryId: null,
};

const scrollIntoView = ({ targetId, boundaryId }: Props) => {
  const node = document.querySelector(`#${targetId}`);
  const boundaryNode = boundaryId ? document.querySelector(`#${boundaryId}`) : null;

  if (node) {
    if (boundaryNode) {
      scroll(node, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
        boundary: boundaryNode,
      });
    } else {
      scroll(node, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }
  }
};

scrollIntoView.defaultProps = defaultProps;

export default scrollIntoView;
