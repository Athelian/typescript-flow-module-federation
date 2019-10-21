// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { StatusDisplayWrapperStyle, InfoIconStyle } from './style';

type Props = {
  value: boolean,
  entity?: string,
};

const StatusDisplay = ({ value, entity }: Props) => {
  return (
    <div className={StatusDisplayWrapperStyle(value)}>
      <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />
      <FormattedMessage id={`components.form.${value ? 'archived' : 'active'}`} />

      <Tooltip
        message={
          <>
            {entity === 'OrderItem' && (
              <FormattedMessage
                id="modules.OrderItems.order.archived.tooltip.infoMessage"
                defaultMessage="The status is the same as the Order's status"
              />
            )}
            {entity === 'Batch' && (
              <FormattedMessage
                id="modules.Batches.archived.tooltip.infoMessage"
                defaultMessage="The status is controlled by the Order and Shipment this Batch belongs to"
              />
            )}
            {entity === 'Container' && (
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
};

export default StatusDisplay;
