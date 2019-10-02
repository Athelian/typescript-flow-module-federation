// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import RelateEntity from 'components/RelateEntity';
import TaskRing from 'components/TaskRing';
import { Tooltip } from 'components/Tooltip';
import { Display, Blackout } from 'components/Form';
import { useHasPermissions } from 'components/Context/Permissions';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import {
  OrderCardWrapperStyle,
  TopRowWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  CreateItemButtonStyle,
  CreateItemIconStyle,
} from './style';

type Props = {|
  order: Object,
  onCreateItem: Event => void,
  organizationId: string,
|};

export default function OrderCard({ order, onCreateItem, organizationId }: Props) {
  const { poNo, tags = [], importer, exporter, todo = {} } = order || {};

  const hasPermissions = useHasPermissions(organizationId);
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
        <Display blackout={!canViewPoNo}>{poNo}</Display>

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
        <RelateEntity
          blackout={!canViewImporter}
          entity="IMPORTER"
          value={importer?.name}
          width="100px"
        />

        <RelateEntity
          blackout={!canViewExporter}
          entity="EXPORTER"
          value={exporter?.name}
          width="100px"
        />

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>

      {allowToCreateItem && (
        <Tooltip
          message={
            <FormattedMessage
              id="modules.RelationMap.order.createItemTooltip"
              defaultMessage="Create Item(s)"
            />
          }
          delay="800"
        >
          <button onClick={onCreateItem} className={CreateItemButtonStyle} type="button">
            <div className={CreateItemIconStyle}>
              <Icon icon="ADD" />
            </div>
            <div className={CreateItemIconStyle}>
              <Icon icon="ORDER_ITEM" />
            </div>
          </button>
        </Tooltip>
      )}
    </div>
  );
}
