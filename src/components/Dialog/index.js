// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from 'components/Icon';
import usePortalSlot from 'hooks/usePortalSlot';
import { useFocusFallback } from 'contexts/FocusFallback';
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

export const DIALOG_PORTAL_NAME = 'dialog';

const DialogRender = (props: Props) => {
  const { isOpen, onRequestClose, onCancel, width, showCancelButton, children } = {
    ...defaultProps,
    ...props,
  };
  const slot = usePortalSlot(DIALOG_PORTAL_NAME);

  const focusFallback = useFocusFallback();
  const activeElemRef = React.useRef<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      activeElemRef.current = document.activeElement;
      if (containerRef.current) {
        const elemToFocus =
          containerRef.current.querySelector('[data-focus-first]:not([disabled])') ||
          containerRef.current;
        elemToFocus.focus();
      }
    } else if (focusFallback.element.current) {
      focusFallback.element.current.focus();
    } else if (activeElemRef.current) {
      activeElemRef.current.focus();
    }
  }, [isOpen, focusFallback]);

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
        ref={containerRef}
        className={isOpen ? DialogFadeInStyle(width) : DialogFadeOutStyle(width)}
        onClick={event => event.stopPropagation()}
        role="presentation"
      >
        {showCancelButton && isOpen && (
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
