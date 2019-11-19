// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { StatusDisplayWrapperStyle, InfoIconStyle } from './style';

const StatusDisplay = ({ value, entity }: DisplayProps<boolean>) => (
  <div className={StatusDisplayWrapperStyle(value)}>
    <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />
    <FormattedMessage id={`components.form.${value ? 'archived' : 'active'}`} />

    <Tooltip
      message={
        <>
          {entity?.type === 'OrderItem' && (
            <FormattedMessage
              id="modules.OrderItems.order.archived.tooltip.infoMessage"
              defaultMessage="The status is the same as the Order's status"
            />
          )}
          {entity?.type === 'Batch' && (
            <FormattedMessage
              id="modules.Batches.archived.tooltip.infoMessage"
              defaultMessage="The status is controlled by the Order and Shipment this Batch belongs to"
            />
          )}
          {entity?.type === 'Container' && (
            <FormattedMessage
              id="modules.container.archived.tooltip.infoMessage"
              defaultMessage="The status is the same as the Shipment's status"
            />
          )}
        </>
      }
    >
      <div className={InfoIconStyle}>
        <Icon icon="INFO" />
      </div>
    </Tooltip>
  </div>
);

export default StatusDisplay;
