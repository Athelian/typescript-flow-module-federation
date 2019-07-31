// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { FormTooltip, ToggleInput } from 'components/Form';
import { StatusStyle } from 'components/Form/SectionHeader/StatusToggle/style';
import emitter from 'utils/emitter';

type OptionalProps = {
  editable: boolean,
};

type Entity = 'Order' | 'OrderItem' | 'Batch' | 'Product' | 'Shipment' | 'Container';

type Props = OptionalProps & {
  name: string,
  toggled: boolean,
  id: string,
  entity: Entity,
};

const defaultProps = {
  editable: false,
};

const renderTooltip = (entity: Entity) => {
  switch (entity) {
    case 'Container':
      return (
        <FormTooltip
          infoMessage={
            <FormattedMessage
              id="modules.container.archived.tooltip.infoMessage"
              defaultMessage="The status is the same as the Shipment's status"
            />
          }
          position="bottom"
        />
      );

    case 'Batch':
      return (
        <FormTooltip
          infoMessage={
            <FormattedMessage
              id="modules.Batches.archived.tooltip.infoMessage"
              defaultMessage="The status is controlled by the Order and Shipment this Batch belongs to"
            />
          }
          position="bottom"
        />
      );

    case 'OrderItem':
      return (
        <FormTooltip
          infoMessage={
            <FormattedMessage
              id="modules.OrderItems.order.archived.tooltip.infoMessage"
              defaultMessage="The status is the same as the Order's status"
            />
          }
          position="bottom"
        />
      );

    default:
      return '';
  }
};

export default function InlineStatusButton({ name, toggled, id, editable, entity }: Props) {
  return (
    <div className={StatusStyle(toggled)}>
      <Icon icon={toggled ? 'ARCHIVE' : 'ACTIVE'} />
      {toggled ? (
        <FormattedMessage id="components.form.archived" defaultMessage="Archived" />
      ) : (
        <FormattedMessage id="components.form.active" defaultMessage="Active" />
      )}
      {editable && (
        <ToggleInput
          editable
          id={`input-${id}`}
          toggled={!toggled}
          onToggle={() => {
            emitter.emit('INLINE_CHANGE', {
              name,
              hasError: false,
              value: !toggled,
            });
          }}
        />
      )}
      {renderTooltip(entity)}
    </div>
  );
}

InlineStatusButton.defaultProps = defaultProps;
