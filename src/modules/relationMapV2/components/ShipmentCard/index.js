// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import MiniShipmentTimeline from './MiniShipmentTimeline';
import {
  ShipmentCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndPlaceWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  TimelineAndDateWrapperStyle,
} from './style';

type Props = {|
  shipment: Object,
|};

export default function ShipmentCard({ shipment }: Props) {
  const { no, tags = [], todo = {} } = shipment;

  // TODO: Change the data based on user input in shipment navbar
  const place = '';
  const date = '';

  // TODO: Replace with real permissions
  const canViewNo = false;
  const canViewTags = false;
  const canViewPlace = false;
  const canViewTimeline = false;
  const canViewDate = false;
  const canViewTasks = false;

  return (
    <div className={ShipmentCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>{no}</Display>

        <div className={TagsAndPlaceWrapperStyle}>
          {canViewTags ? (
            <div className={TagsWrapperStyle}>
              {tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <Blackout />
          )}

          <Label width="55px">
            <FormattedMessage id="components.cards.place" defaultMessage="PLACE" />
          </Label>
          <Display blackout={!canViewPlace} width="130px">
            {place}
          </Display>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={TimelineAndDateWrapperStyle}>
          {canViewTimeline ? (
            <MiniShipmentTimeline shipment={shipment} />
          ) : (
            <Blackout width="300px" />
          )}

          <Label width="55px">
            <FormattedMessage id="components.cards.date" defaultMessage="DATE" />
          </Label>
          <Display blackout={!canViewDate} width="130px">
            <FormattedDate value={date} />
          </Display>
        </div>

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>
    </div>
  );
}
