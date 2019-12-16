// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import emitter from 'utils/emitter';
import { FormattedMessage } from 'react-intl';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

function ConfirmBeforeLeave() {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const pathRef = React.useRef('');
  const hasErrorRef = React.useRef(false);
  const dirtySaveRef = React.useRef(false);
  const dirtyResetRef = React.useRef(false);

  React.useEffect(() => {
    emitter.addListener('VALIDATION_ERROR', isValid => {
      hasErrorRef.current = !isValid;
    });
  }, []);

  React.useEffect(() => {
    emitter.addListener('DIRTY_SAVE', isDirty => {
      dirtySaveRef.current = !isDirty;
    });
  }, []);

  React.useEffect(() => {
    emitter.addListener('DIRTY_RESET', isDirty => {
      dirtyResetRef.current = isDirty;
    });
  }, []);

  React.useEffect(() => {
    emitter.addListener('DIRTY_SAVE', isDirty => {
      dirtySaveRef.current = isDirty;
    });
  }, []);

  React.useEffect(() => {
    emitter.addListener('NAVIGATE_TO', path => {
      if (!isOpen && (hasErrorRef.current || dirtyResetRef.current || dirtySaveRef.current)) {
        setIsOpen(true);
        pathRef.current = path;
      } else {
        navigate(String(path));
      }
    });
    return () => {
      emitter.removeAllListeners('NAVIGATE_TO');
    };
  }, [isOpen]);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onRequestClose={onClose}
      onCancel={onClose}
      onConfirm={() => {
        onClose();
        navigate(String(pathRef.current));
        hasErrorRef.current = false;
        dirtySaveRef.current = false;
        dirtyResetRef.current = false;
      }}
      message={
        <FormattedMessage
          id="components.form.confirmBeforeLeavePageMessage"
          defaultMessage="Are you sure you want to leave this page? Your changes will not be saved."
        />
      }
    />
  );
}

export default ConfirmBeforeLeave;
