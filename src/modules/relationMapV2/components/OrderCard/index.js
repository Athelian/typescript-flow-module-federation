// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import RelateEntity from 'components/RelateEntity';
import TaskRing from 'components/TaskRing';
import { Display, Blackout } from 'components/Form';
import { FullValueTooltip } from 'components/Tooltip';
import { useHasPermissions } from 'contexts/Permissions';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import CardActions from 'modules/relationMapV2/components/CardActions';
import { FocusedView } from 'modules/relationMapV2/store';
import {
  OrderCardWrapperStyle,
  TopRowWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
} from './style';

type Props = {|
  order: Object,
  onViewForm: Event => void,
  onCreateItem: Event => void,
  organizationId: string,
|};

export default function OrderCard({ order, onViewForm, onCreateItem, organizationId }: Props) {
  const { selectors } = FocusedView.useContainer();
  const { poNo, tags = [], importer, exporter, todo = {} } = order || {};

  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(ORDER_FORM);
  const allowToCreateItem = hasPermissions(ORDER_ITEMS_CREATE);

  // TODO: Replace with real permissions
  const canViewPoNo = true;
  const canViewTags = true;
  const canViewImporter = true;
  const canViewExporter = true;
  const canViewTasks = true;

  return (
    <div className={OrderCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewPoNo}>
          <FullValueTooltip message={poNo}>
            <span>{poNo}</span>
          </FullValueTooltip>
        </Display>

        {canViewTags ? (
          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : (
          <Blackout />
        )}
      </div>

      <div className={BottomRowWrapperStyle}>
        <FullValueTooltip message={importer?.name}>
          <div>
            <RelateEntity
              blackout={!canViewImporter}
              entity="IMPORTER"
              value={importer?.name}
              width="100px"
            />
          </div>
        </FullValueTooltip>

        <FullValueTooltip message={exporter?.name}>
          <div>
            <RelateEntity
              blackout={!canViewExporter}
              entity="EXPORTER"
              value={exporter?.name}
              width="100px"
            />
          </div>
        </FullValueTooltip>

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>

      <CardActions
        actions={[
          allowToViewForm
            ? {
                label: (
                  <FormattedMessage
                    id="modules.RelationMap.cards.viewForm"
                    defaultMessage="View Form"
                  />
                ),
                onClick: onViewForm,
              }
            : null,
          allowToCreateItem && selectors.isOrderFocus
            ? {
                label: (
                  <FormattedMessage
                    id="modules.RelationMap.order.createItems"
                    defaultMessage="Create Item(s)"
                  />
                ),
                onClick: onCreateItem,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
