// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';

type Props = {
  onDone: () => void,
  children: ({ onClose: () => void }) => React.Node,
};

const SheetActionDialog = ({ onDone, children }: Props) => {
  const [open, setOpen] = React.useState(true);
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      return () => {};
    }

    const handler = setTimeout(() => onDone(), 300);

    return () => clearTimeout(handler);
  }, [open, onDone]);

  return (
    <Dialog isOpen={open} onRequestClose={handleClose}>
      {children({ onClose: handleClose })}
    </Dialog>
  );
};

export default SheetActionDialog;
