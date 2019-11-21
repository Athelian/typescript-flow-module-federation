// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from 'components/Icon';
import usePortalSlot from 'hooks/usePortalSlot';
import {
  BackdropFadeInStyle,
  BackdropFadeOutStyle,
  DialogFadeInStyle,
  DialogFadeOutStyle,
  CancelButtonStyle,
} from './style';

type Props = {|
  width?: string,
  showCancelButton?: boolean,
  isOpen?: boolean,
  onCancel?: Function,
  onRequestClose?: Function,
  children: React.Node,
|};

const defaultProps = {
  width: 'min-content',
  showCancelButton: false,
  onRequestClose: () => {},
};

export const ANIMATION_FINISHED = 300; // 0.3s

const DialogRender = (props: Props) => {
  const { isOpen, onRequestClose, onCancel, width, showCancelButton, children } = {
    ...defaultProps,
    ...props,
  };
  const slot = usePortalSlot();

  return ReactDOM.createPortal(
    <div
      className={isOpen ? BackdropFadeInStyle : BackdropFadeOutStyle}
      onClick={event => {
        event.stopPropagation();
        onRequestClose();
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onRequestClose();
        }
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
    slot
  );
};

const Dialog = ({ isOpen, onRequestClose, onCancel, width, showCancelButton, children }: Props) => {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRender(true);
      return () => {};
    }

    const handler = setTimeout(() => {
      setRender(false);
    }, ANIMATION_FINISHED);

    return () => clearTimeout(handler);
  }, [isOpen]);

  return render ? (
    <DialogRender
      width={width}
      showCancelButton={showCancelButton}
      onCancel={onCancel}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      {children}
    </DialogRender>
  ) : null;
};

export default Dialog;
