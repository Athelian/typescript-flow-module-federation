// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import logger from 'utils/logger';
import {
  BackdropFadeInStyle,
  BackdropFadeOutStyle,
  DialogFadeInStyle,
  DialogFadeOutStyle,
} from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: (evt: Event) => void,
  children: React.Node,
  options: { width: number },
  rootElementId?: string,
};

const ANIMATION_FINISHED = 500;

export default class Dialog extends React.Component<Props> {
  static defaultProps = {
    rootElementId: 'dialog-root',
  };

  constructor() {
    super();
    this.dialogContainer = document.createElement('div');
  }

  componentDidUpdate(prevProps: Props) {
    const { rootElementId = 'dialog-root' } = this.props;
    const dialogRoot = document.getElementById(rootElementId);

    if (!dialogRoot) {
      logger.warn('Not found the rootElementId', rootElementId);
      return;
    }

    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      dialogRoot.appendChild(this.dialogContainer);
    }

    if (prevProps.isOpen && !isOpen) {
      if (dialogRoot.contains(this.dialogContainer)) {
        setTimeout(() => dialogRoot.removeChild(this.dialogContainer), ANIMATION_FINISHED);
      }
    }
  }

  dialogContainer: HTMLDivElement;

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
              className={isOpen ? DialogFadeInStyle(width) : DialogFadeOutStyle(width)}
              onClick={e => e.stopPropagation()}
              role="presentation"
            >
              {children}
            </div>
          </div>,
          this.dialogContainer
        )}
      </PreventInitialAnimation>
    );
  }
}
