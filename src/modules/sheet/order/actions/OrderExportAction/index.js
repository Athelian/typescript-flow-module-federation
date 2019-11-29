// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ExportButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { OrderLabelIcon } from 'components/Dialog/ActionDialog';
import { orderExportQuery } from 'modules/order/query';
import messages from '../messages';
import { BodyWrapperStyle } from './style';

const OrderExportAction = ({ entity, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);

  return (
    <ActionDialog
      isOpen={isOpen}
      onCancel={close}
      title={<FormattedMessage {...messages.orderExportTitle} />}
      dialogMessage={
        <FormattedMessage
          {...messages.orderExportMessage}
          values={{ orderLabel: <OrderLabelIcon /> }}
        />
      }
    >
      <div className={BodyWrapperStyle}>
        <ExportButton type="Order" exportQuery={orderExportQuery} variables={{ id: entity.id }} />
      </div>
    </ActionDialog>
  );
};

export default OrderExportAction;
