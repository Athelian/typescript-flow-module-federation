// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import usePortalSlot from 'hooks/usePortalSlot';
import { BackdropStyle, SlideViewStyle, SlideViewContentStyle } from './style';

const StartWidth = 80; // vw
const WidthStep = 10; // vw

const StartMinWidth = 1030; // px
const MinWidthStep = 50; // px

type Props = {|
  isOpen: boolean,
  onRequestClose: () => void,
  shouldConfirm: Function,
  children: React.Node,
|};

const defaultProps = {
  isOpen: false,
  shouldConfirm: () => {
    const button = document.getElementById('save_button');
    // $FlowFixMe: Cannot get button.disabled because property disabled is missing in HTMLElement [1].
    return button && !button.disabled;
  },
};

type Context = {
  width: number,
  minWidth: number,
};

const SlideViewContext = React.createContext<Context>({
  width: StartWidth + WidthStep,
  minWidth: StartMinWidth + MinWidthStep,
});

const ANIMATION_FINISHED = 300; // 0.3s

export const SLIDEVIEW_PORTAL_NAME = 'slideview';

const SlideViewRender = ({ isOpen, onRequestClose, shouldConfirm, children }: Props) => {
  const slot = usePortalSlot(SLIDEVIEW_PORTAL_NAME);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const parentContext = React.useContext(SlideViewContext);

  const handleCloseConfirmDialog = () => setConfirmDialogOpen(false);

  const width = parentContext.width - WidthStep;
  const minWidth = parentContext.minWidth - MinWidthStep;

  return ReactDOM.createPortal(
    <SlideViewContext.Provider value={{ width, minWidth }}>
      <div
        className={BackdropStyle(isOpen)}
        onClick={event => {
          event.stopPropagation();
          if (shouldConfirm()) {
            setConfirmDialogOpen(true);
          } else {
            onRequestClose();
          }
        }}
        role="presentation"
      >
        <div
          className={SlideViewStyle(isOpen, width, minWidth)}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <div className={SlideViewContentStyle}>{children}</div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onRequestClose={handleCloseConfirmDialog}
        onCancel={handleCloseConfirmDialog}
        onConfirm={() => {
          handleCloseConfirmDialog();
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
    slot
  );
};

const SlideView = ({ isOpen, onRequestClose, shouldConfirm, children }: Props) => {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRender(true);
      return () => {};
    }

    const handler = setTimeout(() => {
      setRender(false);
    }, ANIMATION_FINISHED);

    return () => {
      clearTimeout(handler);
    };
  }, [isOpen]);

  return render ? (
    <SlideViewRender isOpen={isOpen} onRequestClose={onRequestClose} shouldConfirm={shouldConfirm}>
      {children}
    </SlideViewRender>
  ) : null;
};

SlideView.defaultProps = defaultProps;

export default SlideView;
