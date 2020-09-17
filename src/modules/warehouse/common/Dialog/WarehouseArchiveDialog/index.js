// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateWarehouseMutation } from 'modules/warehouse/form/mutation';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type WarehouseDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const WarehouseArchiveDialog = ({
  isOpen,
  onRequestClose,
  warehouse,
  onConfirm,
}: WarehouseDialogProps) => {
  const { id: warehouseId = '' } = warehouse || {};

  return (
    <ApolloConsumer>
      {client => (
        <ArchiveDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateWarehouseMutation,
              variables: {
                id: warehouseId,
                input: {
                  archived: true,
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

WarehouseArchiveDialog.defaultProps = defaultProps;

export default WarehouseArchiveDialog;
