// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import { BackdropFadeInStyle, BackdropFadeOutStyle } from 'components/Dialog/style';
import logger from 'utils/logger';
import FadeIn from './FadeIn';
import { SlideInStyle, SlideAwayStyle, SlideViewContentStyle } from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  children: React.Node,
  options: { width: string },
  rootElementId?: string,
};

export default class SlideView extends React.Component<Props> {
  static defaultProps = {
    rootElementId: 'slide-view-root',
  };

  constructor() {
    super();
    this.slideViewContainer = document.createElement('div');
  }

  componentDidUpdate(prevProps: Props) {
    const { rootElementId = 'slide-view-root' } = this.props;
    const slideViewRoot = document.getElementById(rootElementId);

    if (!slideViewRoot) {
      logger.warn('Not found the rootElementId', rootElementId);
      return;
    }

    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      slideViewRoot.appendChild(this.slideViewContainer);
    }
  }

  componentWillUnmount() {
    const container = this.slideViewContainer;
    if (container.parentNode) {
      container.parentNode.removeChild(container);
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
              <div className={SlideViewContentStyle}>
                <FadeIn in={isOpen}>{children} </FadeIn>
              </div>
            </div>
          </div>,
          this.slideViewContainer
        )}
      </PreventInitialAnimation>
    );
  }
}
