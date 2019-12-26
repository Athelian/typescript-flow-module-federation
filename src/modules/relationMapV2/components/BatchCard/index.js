// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { useHasPermissions } from 'contexts/Permissions';
import { BATCH_DELETE, BATCH_FORM } from 'modules/permission/constants/batch';
import CardActions from 'modules/relationMapV2/components/CardActions';
import {
  BatchCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndDeliveryWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  QuantityVolumeDesiredWrapperStyle,
} from './style';

type Props = {|
  batch: Object,
  onViewForm: Event => void,
  onDeleteBatch: Event => void,
  organizationId: string,
|};

export default function BatchCard({ batch, onViewForm, onDeleteBatch, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(BATCH_FORM);
  const allowToDeleteBatch = hasPermissions(BATCH_DELETE);

  const { no, tags = [], deliveredAt, latestQuantity, totalVolume, desiredAt, todo = {} } = batch;

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewDelivery = true;
  const canViewQuantity = true;
  const canViewVolume = true;
  const canViewDesired = true;
  const canViewTasks = true;

  // TODO: calculate the diff
  const desiredAtDiff = 10;
  const deliveredAtDiff = -2;

  return (
    <div className={BatchCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo} width="100px">
          {no}
        </Display>

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

          <Label width="45px">
            <FormattedMessage id="components.cards.abbreviateForDelivery" defaultMessage="DLV" />
          </Label>
          <Display blackout={!canViewDelivery} width="85px">
            <FormattedDate value={deliveredAt} />
          </Display>

          <Label width="80px">
            <FormattedMessage
              id="components.cards.abbreviateForDeliveryDifference"
              defaultMessage="DLV Diff"
            />
          </Label>
          <Display blackout={!canViewDelivery} width="35px">
            <FormattedNumber value={deliveredAtDiff} />
          </Display>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={QuantityVolumeDesiredWrapperStyle}>
          <Label width="45px">
            <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
          </Label>
          <Display blackout={!canViewQuantity} width="35px">
            <FormattedNumber value={latestQuantity} />
          </Display>

          <Label width="45px">
            <FormattedMessage id="components.cards.vol" defaultMessage="VOL" />
          </Label>
          <Display blackout={!canViewVolume} width="50px">
            <FormattedNumber value={totalVolume?.value} suffix={totalVolume?.metric} />
          </Display>

          <Label width="45px">
            <FormattedMessage id="components.cards.abbreviateForDesiredAt" defaultMessage="DES" />
          </Label>
          <Display blackout={!canViewDesired} width="85px">
            <FormattedDate value={desiredAt} />
          </Display>

          <Label width="80px">
            <FormattedMessage
              id="components.cards.abbreviateForDesiredDifference"
              defaultMessage="DES Diff"
            />
          </Label>
          <Display blackout={!canViewDesired} width="35px">
            <FormattedNumber value={desiredAtDiff} />
          </Display>
        </div>

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
          allowToDeleteBatch
            ? {
                label: (
                  <FormattedMessage id="modules.RelationMap.cards.delete" defaultMessage="Delete" />
                ),
                onClick: onDeleteBatch,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
