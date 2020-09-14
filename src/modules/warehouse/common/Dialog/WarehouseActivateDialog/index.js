// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateWarehouseMutation } from 'modules/warehouse/form/mutation';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type WarehouseDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const WarehouseActivateDialog = ({
  isOpen,
  onRequestClose,
  warehouse,
  onConfirm,
}: WarehouseDialogProps) => {
  const { id: warehouseId } = warehouse;

  return (
    <ApolloConsumer>
      {client => (
        <ActivateDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateWarehouseMutation,
              variables: {
                id: warehouseId,
                input: {
                  archived: false,
                },
              },
            });
            emitter.emit('CHANGE_WAREHOUSE_STATUS', warehouseId);
            onRequestClose();
            onConfirm();
          }}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage
                  {...messages.confirmMsg}
                  values={{
                    warehouse: spanWithColor(
                      <FormattedMessage {...messages.warehouse} />,
                      'WAREHOUSE'
                    ),
                  }}
                />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

WarehouseActivateDialog.defaultProps = defaultProps;

export default WarehouseActivateDialog;
