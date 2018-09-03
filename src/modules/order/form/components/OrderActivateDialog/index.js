// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ActivateDialog from 'components/Dialog/ActivateDialog';

import type { OrderDialogProps } from './type';

import messages from './messages';
import { SpanStyle, MessageStyle } from './style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function OrderActivateDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onConfirm,

  totalBatches,
  unshippedBatches,
  shippedBatches,
}: OrderDialogProps) {
  const total = spanWithColor(<FormattedNumber value={totalBatches} />, 'GRAY');
  const unshipped = spanWithColor(<FormattedNumber value={unshippedBatches} />, 'BATCH');
  const shipped = spanWithColor(<FormattedNumber value={shippedBatches} />, 'BATCH');

  const order = spanWithColor(<FormattedMessage {...messages.order} />, 'RED');
  const batches = spanWithColor(<FormattedMessage {...messages.batches} />, 'BATCH');
  const shipments = spanWithColor(<FormattedMessage {...messages.shipments} />, 'SHIPMENT');

  return (
    <ActivateDialog
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      width={360}
      message={
        <div className={MessageStyle}>
          <div>
            <FormattedMessage {...messages.confirmMsg} values={{ order }} />
          </div>
          <div>
            <FormattedMessage {...messages.unshippedMsg} values={{ unshipped, total, batches }} />
          </div>
          <div>
            <FormattedMessage
              {...messages.shippedMsg}
              values={{ shipped, total, batches, shipments }}
            />
          </div>
        </div>
      }
    />
  );
}
