// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { isEnableBetaFeature } from 'utils/env';
import { TimelineDate, TimelineContainerDate } from '../../components';
import {
  HorizontalDatesWrapperStyle,
  SingleDateWrapperStyle,
  DoubleDatesWrapperStyle,
  BlankPlaceholderStyle,
  ArrivalDepartureIconsWrapperStyle,
  ContainerDateWrapperStyle,
  ContainerDateLabelStyle,
  ContainerDatesContainerWrapperStyle,
  ApprovalStyle,
} from './style';

type Props = {
  shipment: any,
};

const HorizontalDates = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, containers } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];
  if (voyages.length > 1) {
    return (
      <div className={HorizontalDatesWrapperStyle}>
        <div className={ArrivalDepartureIconsWrapperStyle}>
          <Icon icon="ARRIVAL_HORIZONTAL" />
          <Icon icon="DEPARTURE_HORIZONTAL" />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={cargoReady} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <div className={BlankPlaceholderStyle} />
          <TimelineDate timelineDate={voyages[0].departure} />
        </div>

        {voyages.length > 1 &&
          voyages.slice(1).map((voyage, voyageIndex) => (
            <div className={DoubleDatesWrapperStyle} key={voyage.id}>
              <TimelineDate timelineDate={voyages[voyageIndex].arrival} />
              <TimelineDate timelineDate={voyage.departure} />
            </div>
          ))}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={customClearance} />
          <div className={BlankPlaceholderStyle} />
        </div>

        {isEnableBetaFeature && containers && containers.length > 0 ? (
          <div className={ContainerDatesContainerWrapperStyle}>
            <div>
              <div className={ContainerDateWrapperStyle}>
                <div className={ContainerDateLabelStyle}>
                  <FormattedMessage
                    id="modules.Shipments.agreedDateLabel"
                    defaultMessage="AGREED"
                  />
                </div>
                <TimelineContainerDate timelineDates={containers} type="Agreed" />
                <div className={ApprovalStyle()}>
                  <Icon icon="CHECKED" />
                </div>
              </div>
              <div className={ContainerDateWrapperStyle}>
                <div className={ContainerDateLabelStyle}>
                  <FormattedMessage
                    id="modules.Shipments.actualDateLabel"
                    defaultMessage="ACTUAL"
                  />
                </div>
                <TimelineContainerDate timelineDates={containers} type="Actual" />
                <div className={ApprovalStyle()}>
                  <Icon icon="CHECKED" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={DoubleDatesWrapperStyle}>
            <TimelineDate timelineDate={warehouseArrival} />
            <div className={BlankPlaceholderStyle} />
          </div>
        )}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={deliveryReady} />
          <div className={BlankPlaceholderStyle} />
        </div>
      </div>
    );
  }

  return (
    <div className={HorizontalDatesWrapperStyle}>
      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={cargoReady} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[0].departure} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={customClearance} />
      </div>

      {isEnableBetaFeature && containers && containers.length > 0 ? (
        <div className={ContainerDatesContainerWrapperStyle}>
          <div>
            <div className={ContainerDateWrapperStyle}>
              <div className={ContainerDateLabelStyle}>AGREED</div>
              <TimelineContainerDate timelineDates={containers} type="Agreed" />
              <div className={ApprovalStyle()}>
                <Icon icon="CHECKED" />
              </div>
            </div>
            <div className={ContainerDateWrapperStyle}>
              <div className={ContainerDateLabelStyle}>ACTUAL</div>
              <TimelineContainerDate timelineDates={containers} type="Actual" />
              <div className={ApprovalStyle()}>
                <Icon icon="CHECKED" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={SingleDateWrapperStyle}>
          <TimelineDate timelineDate={warehouseArrival} />
        </div>
      )}

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} />
      </div>
    </div>
  );
};

export default HorizontalDates;
