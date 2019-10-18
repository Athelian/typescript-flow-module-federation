// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import DisplayWrapper from '../DisplayWrapper';
import { ArchivedStyle, ActiveStyle, InfoIconStyle } from './style';

type Props = {
  value: boolean,
  entity?: string,
};

const StatusDisplay = ({ value, entity }: Props) => {
  return (
    <DisplayWrapper>
      {value ? (
        <div className={ArchivedStyle}>
          <Icon icon="ARCHIVE" />
          <FormattedMessage id="components.sheet.archived" defaultMessage="Archived" />
        </div>
      ) : (
        <div className={ActiveStyle}>
          <Icon icon="ACTIVE" />
          <FormattedMessage id="components.sheet.active" defaultMessage="Active" />
        </div>
      )}
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
    </DisplayWrapper>
  );
};

export default StatusDisplay;
