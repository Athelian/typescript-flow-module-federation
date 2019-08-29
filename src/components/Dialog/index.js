// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import Icon from 'components/Icon';
import logger from 'utils/logger';
import {
  BackdropFadeInStyle,
  BackdropFadeOutStyle,
  DialogFadeInStyle,
  DialogFadeOutStyle,
  CancelButtonStyle,
} from './style';

type OptionalProps = {
  rootElementId: string,
  width: string,
  showCancelButton: boolean,
};

type Props = OptionalProps & {
  isOpen: boolean,
  onRequestClose: (evt: Event) => void,
  onCancel?: Function,
  children: React.Node,
};

const ANIMATION_FINISHED = 500;

export default class Dialog extends React.Component<Props> {
  static defaultProps = {
    rootElementId: 'dialog-root',
    width: 'min-content',
    showCancelButton: false,
  };

  dialogContainer: HTMLDivElement = document.createElement('div');

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
      setTimeout(() => {
        if (dialogRoot.contains(this.dialogContainer)) {
          dialogRoot.removeChild(this.dialogContainer);
        }
      }, ANIMATION_FINISHED);
    }
  }

  render() {
    const { children, isOpen, onRequestClose, onCancel, width, showCancelButton } = this.props;

    return (
      <PreventInitialAnimation isChildrenVisible>
        {ReactDOM.createPortal(
          <div
            className={isOpen ? BackdropFadeInStyle : BackdropFadeOutStyle}
            onClick={event => {
              event.stopPropagation();
              onRequestClose();
            }}
            role="presentation"
          >
            <div
              className={isOpen ? DialogFadeInStyle(width) : DialogFadeOutStyle(width)}
              onClick={event => event.stopPropagation()}
              role="presentation"
            >
              {showCancelButton && (
                <button type="button" onClick={onCancel} className={CancelButtonStyle}>
                  <Icon icon="CLEAR" />
                </button>
              )}

              {children}
            </div>
          </div>,
          this.dialogContainer
        )}
      </PreventInitialAnimation>
    );
  }
}
