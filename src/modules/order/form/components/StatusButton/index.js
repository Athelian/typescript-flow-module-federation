// @flow
import * as React from 'react';

import { SectionHeader, LastModified } from 'components/Form';
import Icon from 'components/Icon';
import OrderActivateDialog from '../OrderActivateDialog';
import OrderArchiveDialog from '../OrderArchiveDialog';
import { ToggleButtonStyle, StatusStyle } from './style';

type Props = {
  order: Object,
  onChangeStatus: Function,
};

type State = {
  isOpen: boolean,
};

function getBatchesSummary(order: any) {
  let totalBatches = 0;
  let shippedBatches = 0;
  if (order.orderItems) {
    order.orderItems.forEach(item => {
      if (item.batches) {
        totalBatches += item.batches.length;
        item.batches.forEach(batche => {
          if (batche.shipment) {
            shippedBatches += 1;
          }
        });
      }
    });
  }
  return { totalBatches, shippedBatches, unshippedBatches: totalBatches - shippedBatches };
}

export default class StatusButton extends React.PureComponent<Props, State> {
  state = {
    isOpen: false,
  };

  openDialog = () => {
    this.setState({
      isOpen: true,
    });
  };

  closeDialog = () => {
    this.setState({
      isOpen: false,
    });
  };

  confirm = (archived: boolean) => {
    const { onChangeStatus } = this.props;
    onChangeStatus(archived);
    this.closeDialog();
  };

  confirmActivate = () => {
    this.confirm(false);
  };

  confirmArchive = () => {
    this.confirm(true);
  };

  render() {
    const { order } = this.props;
    const { isOpen } = this.state;

    const { totalBatches, unshippedBatches, shippedBatches } = getBatchesSummary(order);

    return (
      <SectionHeader icon="ORDER" title="ORDER">
        {isOpen && (
          <>
            <OrderActivateDialog
              isOpen={isOpen && order.archived}
              onRequestClose={this.closeDialog}
              onCancel={this.closeDialog}
              onConfirm={this.confirmActivate}
              totalBatches={totalBatches}
              unshippedBatches={unshippedBatches}
              shippedBatches={shippedBatches}
            />
            <OrderArchiveDialog
              isOpen={isOpen && !order.archived}
              onRequestClose={this.closeDialog}
              onCancel={this.closeDialog}
              onConfirm={this.confirmArchive}
              totalBatches={totalBatches}
              unshippedBatches={unshippedBatches}
              shippedBatches={shippedBatches}
            />
          </>
        )}
        <LastModified updatedAt={order.updatedAt} />

        <div className={StatusStyle(order.archived)}>
          <Icon icon={order.archived ? 'ARCHIVED' : 'ACTIVE'} />
          {order.archived ? 'Archived' : 'Active'}
          <button
            type="button"
            className={ToggleButtonStyle}
            tabIndex={-1}
            onClick={this.openDialog}
          >
            {order.archived ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
          </button>
        </div>
      </SectionHeader>
    );
  }
}
