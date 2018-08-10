// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import Timeline from 'modules/shipment/components/Timeline';
import {
  WrapperStyle,
  ShipmentInfoWrapperStyle,
  InfoWrapperStyle,
  ShipmentIDStyle,
  BLNoStyle,
  BadgeButtonStyle,
  TagsWrapperStyle,
  TagStyle,
  TimelineWrapperStyle,
  EyeIconStyle,
} from './style';

type Props = {
  shipment: any,
};

const ShipmentItem = ({ shipment }: Props) => (
  <div
    className={WrapperStyle}
    // onClick={() => history.push(`/shipment/${encodeId(shipment.id)}`)}
    role="presentation"
  >
    <div className={ShipmentInfoWrapperStyle}>
      <div className={InfoWrapperStyle}>
        <div className={ShipmentIDStyle}>{shipment.no || ''}</div>
        <div className={BLNoStyle}>{shipment.no || ''}</div>
      </div>
      <div className={InfoWrapperStyle}>
        <div className={TagsWrapperStyle}>
          {shipment.tags.map(tag => (
            <div className={TagStyle(tag.color)} key={tag.id}>
              {tag.name}
            </div>
          ))}
        </div>
        <button
          type="button"
          className={BadgeButtonStyle}
          onClick={() => {
            // if (onOpenModal) {
            //   onOpenModal(batchItems);
            // }
          }}
        >
          <div>
            <Icon icon="BATCH" />
            {shipment.batchItems.length}
          </div>
        </button>
      </div>
    </div>
    <div
      className={TimelineWrapperStyle}
      onClick={e => {
        e.stopPropagation();
        // onTimelineClick();
      }}
      role="presentation"
    >
      <div className={EyeIconStyle}>
        <Icon icon="EYE" />
      </div>
      <Timeline shipment={shipment} onStepClick={() => {}} />
    </div>
  </div>
);

export default ShipmentItem;
