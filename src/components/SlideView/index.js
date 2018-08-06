// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import { BackdropFadeInStyle, BackdropFadeOutStyle } from 'components/Dialog/style';
import { SlideInStyle, SlideAwayStyle } from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  children: ({ openSlideView: (options: Object) => void }) => React.Node,
  options: { width: number },
  rootElementId?: string,
};

const ANIMATION_FINISHED = 500;

export default class SlideView extends React.Component<Props> {
  static defaultProps = {
    rootElementId: 'slide-view-root',
  };

  constructor() {
    super();
    this.slideViewContainer = document.createElement('div');
  }

  componentDidUpdate(prevProps: Props) {
    const { rootElementId } = this.props;
    const slideViewRoot = document.getElementById(rootElementId || 'root');

    if (!slideViewRoot) return;

    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      slideViewRoot.appendChild(this.slideViewContainer);
    }

    if (prevProps.isOpen && !isOpen) {
      setTimeout(() => slideViewRoot.removeChild(this.slideViewContainer), ANIMATION_FINISHED);
    }
  }

  slideViewContainer: HTMLDivElement;

  render() {
    const {
      children,
      isOpen,
      onRequestClose,
      options: { width },
    } = this.props;

    return (
      <PreventInitialAnimation isChildrenVisible>
        {ReactDOM.createPortal(
          <div
            className={isOpen ? BackdropFadeInStyle : BackdropFadeOutStyle}
            onClick={onRequestClose}
            role="presentation"
          >
            <div
              className={isOpen ? SlideInStyle(width) : SlideAwayStyle(width)}
              onClick={e => e.stopPropagation()}
              role="presentation"
            >
              {children}
            </div>
          </div>,
          this.slideViewContainer
        )}
      </PreventInitialAnimation>
    );
  }
}
