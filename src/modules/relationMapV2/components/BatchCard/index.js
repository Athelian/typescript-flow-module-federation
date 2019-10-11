// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { useHasPermissions } from 'contexts/Permissions';
import { BATCH_DELETE } from 'modules/permission/constants/batch';
import {
  BatchCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndDeliveryWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  QuantityVolumeDesiredWrapperStyle,
  DeleteBatchButtonStyle,
} from './style';

type Props = {|
  batch: Object,
  onDeleteBatch: Event => void,
  organizationId: string,
|};

export default function BatchCard({ batch, onDeleteBatch, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToDeleteItem = hasPermissions(BATCH_DELETE);

  const { no, tags = [], deliveredAt, latestQuantity, totalVolume, desiredAt, todo = {} } = batch;

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewDelivery = true;
  const canViewQuantity = true;
  const canViewVolume = true;
  const canViewDesired = true;
  const canViewTasks = true;

  return (
    <div className={BatchCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>{no}</Display>

        <div className={TagsAndDeliveryWrapperStyle}>
          {canViewTags ? (
            <div className={TagsWrapperStyle}>
              {tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <Blackout />
          )}

          <Label width="75px">
            <FormattedMessage id="components.cards.delivery" />
          </Label>
          <Display blackout={!canViewDelivery} width="80px">
            <FormattedDate value={deliveredAt} />
          </Display>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={QuantityVolumeDesiredWrapperStyle}>
          <Label width="40px">
            <FormattedMessage id="components.cards.qty" />
          </Label>
          <Display blackout={!canViewQuantity} width="85px">
            <FormattedNumber value={latestQuantity} />
          </Display>

          <Label width="40px">
            <FormattedMessage id="components.cards.vol" />
          </Label>
          <Display blackout={!canViewVolume} width="95px">
            <FormattedNumber value={totalVolume?.value} suffix={totalVolume?.metric} />
          </Display>

          <Label width="75px">
            <FormattedMessage id="components.cards.desired" />
          </Label>
          <Display blackout={!canViewDesired} width="80px">
            <FormattedDate value={desiredAt} />
          </Display>
        </div>

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>

      {allowToDeleteItem && (
        <button onClick={onDeleteBatch} className={DeleteBatchButtonStyle} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  );
}
