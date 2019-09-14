// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import logger from 'utils/logger';
import { isDisable } from 'utils/ui';
import SlideViewContext, { type SlideViewContextProps } from './context';
import { BackdropStyle, SlideViewStyle, SlideViewContentStyle } from './style';

type WrapperProps = {
  isOpen: boolean,
  onRequestClose: () => void,
  targetId: string,
  children: React.Node,
  options: {
    width: {
      initialValue: number,
      step: number,
      unit: 'vw' | 'px' | 'em' | '%',
    },
    minWidth: {
      initialValue: number,
      step: number,
      unit: 'vw' | 'px' | 'em' | '%',
    },
  },
};

type Props = WrapperProps & {
  parentContext: SlideViewContextProps,
};

type State = {
  neverOpened: boolean,
  openedDialog: boolean,
};

const defaultProps = {
  isOpen: false,
  options: {
    width: { initialValue: 80, step: 10, unit: 'vw' },
    minWidth: { initialValue: 1030, step: 50, unit: 'px' },
  },
  targetId: 'save_button',
};

class SlideView extends React.Component<Props, State> {
  slideViewContainer: HTMLElement = document.createElement('div');

  constructor(props) {
    super(props);
    this.state = {
      neverOpened: true,
      openedDialog: false,
    };
  }

  componentDidMount() {
    const {
      parentContext: { domElement },
    } = this.props;
    const container = domElement || document.body;
    if (!container) {
      logger.warn('Container not found');
      return;
    }
    container.appendChild(this.slideViewContainer);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isOpen } = nextProps;
    if (prevState) {
      const { neverOpened } = prevState;

      if (isOpen && neverOpened) return { neverOpened: false };
    }
    return null;
  }

  componentWillUnmount() {
    const container = this.slideViewContainer;
    if (container.parentNode && container.parentNode.contains(container)) {
      container.parentNode.removeChild(container);
    }
  }

  getWidths = () => {
    const {
      parentContext: { width: parentWidth, minWidth: parentMinWidth },
      options: { width: optionWidth, minWidth: optionMinWidth },
    } = this.props;

    const width = !parentWidth ? optionWidth.initialValue : parentWidth - optionWidth.step;
    const minWidth = !parentMinWidth
      ? optionMinWidth.initialValue
      : parentMinWidth - optionMinWidth.step;

    return {
      width,
      minWidth,
      widthWithUnit: width + optionWidth.unit,
      minWidthWithUnit: minWidth + optionMinWidth.unit,
    };
  };

  openDialog = () => {
    this.setState({
      openedDialog: true,
    });
  };

  closeDialog = () => {
    this.setState({
      openedDialog: false,
    });
  };

  render() {
    const { children, isOpen, onRequestClose, targetId } = this.props;
    const { neverOpened, openedDialog } = this.state;
    const { width, minWidth, widthWithUnit, minWidthWithUnit } = this.getWidths();

    return (
      <>
        {ReactDOM.createPortal(
          <SlideViewContext.Provider
            value={{ domElement: this.slideViewContainer, width, minWidth }}
          >
            <div
              className={BackdropStyle({ isOpen, neverOpened })}
              onClick={event => {
                event.stopPropagation();
                if (isDisable(targetId)) {
                  onRequestClose();
                } else {
                  this.openDialog();
                }
              }}
              role="presentation"
            >
              <div
                className={SlideViewStyle({
                  isOpen,
                  neverOpened,
                  width: widthWithUnit,
                  minWidth: minWidthWithUnit,
                })}
                onClick={evt => evt.stopPropagation()}
                role="presentation"
              >
                <div className={SlideViewContentStyle}>{children}</div>
              </div>
            </div>
            <ConfirmDialog
              isOpen={openedDialog}
              onRequestClose={this.closeDialog}
              onCancel={this.closeDialog}
              onConfirm={() => {
                this.closeDialog();
                onRequestClose();
              }}
              message={
                <FormattedMessage
                  id="components.form.confirmLeaveMessage"
                  defaultMessage="Are you sure you want to close this view? Your changes will not be saved."
                />
              }
            />
          </SlideViewContext.Provider>,
          this.slideViewContainer
        )}
      </>
    );
  }
}

export default function SlideViewConsumerWrapper(props: WrapperProps) {
  return (
    <SlideViewContext.Consumer>
      {parentContext => <SlideView {...props} parentContext={parentContext} />}
    </SlideViewContext.Consumer>
  );
}

SlideViewConsumerWrapper.defaultProps = defaultProps;
