// @flow
import * as React from 'react';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import SheetActionDialog from 'components/Sheet/SheetAction/SheetActionDialog';

const Action1 = ({ entity, onDone }: ActionComponentProps) => {
  return (
    <SheetActionDialog onDone={onDone}>
      {({ onClose }) => (
        <div>
          {entity.type}
          <button type="button" onClick={() => onClose()}>
            OK
          </button>
        </div>
      )}
    </SheetActionDialog>
  );
};

export default Action1;
