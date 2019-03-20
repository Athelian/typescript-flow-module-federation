// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { SHIPMENT_CONTAINER_LIST } from 'modules/permission/constants/shipment';
import { earliest, latest } from 'utils/date';
import GridColumn from 'components/GridColumn';
import { SectionHeader } from 'components/Form';
import { EditButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import {
  getAgreedArrivalDates,
  getActualArrivalDates,
  numAgreedArrivalDateApproved,
  numActualArrivalDateApproved,
} from 'modules/shipment/helpers';
import {
  ContainersAmountSummary,
  ContainersDatesSummary,
} from 'modules/shipment/form/components/ContainersSummary';
import { ContainersSlideView } from 'modules/shipment/form/components';
import {
  ShipmentContainersContainer,
  ContainersInSlideViewContainer,
} from 'modules/shipment/form/containers';
import { ContainerWarehouseArrivalSectionWrapperStyle } from './style';

const ContainerWarehouseArrivalSection = () => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <Subscribe to={[ShipmentContainersContainer]}>
      {({ state: { containers }, setFieldValue }) => {
        const agreedArrivalDates = getAgreedArrivalDates(containers);
        const actualArrivalDates = getActualArrivalDates(containers);
        const agreedArrivalDateFrom = earliest(agreedArrivalDates);
        const agreedArrivalDateTo = latest(agreedArrivalDates);
        const actualArrivalDateFrom = earliest(actualArrivalDates);
        const actualArrivalDateTo = latest(actualArrivalDates);
        const numOfContainers = containers.length;
        const numOfApprovedAgreed = numAgreedArrivalDateApproved(containers);
        const numOfApprovedActual = numActualArrivalDateApproved(containers);

        return (
          <div
            id="containersWarehouseArrival"
            className={ContainerWarehouseArrivalSectionWrapperStyle}
          >
            <GridColumn>
              <SectionHeader
                icon="WAREHOUSE"
                title={
                  <FormattedMessage
                    id="modules.Shipments.warehouseArrival"
                    defaultMessage="WAREHOUSE ARRIVAL"
                  />
                }
              >
                {hasPermission(SHIPMENT_CONTAINER_LIST) && (
                  <BooleanValue>
                    {({ value: isOpen, set: slideToggle }) => (
                      <>
                        <EditButton
                          label={
                            <FormattedMessage
                              id="modules.Shipments.editDates"
                              defaultMessage="EDIT DATES"
                            />
                          }
                          onClick={() => slideToggle(true)}
                        />
                        <SlideView
                          isOpen={isOpen}
                          onRequestClose={() => slideToggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {isOpen && (
                            <Subscribe to={[ContainersInSlideViewContainer]}>
                              {({ initDetailValues }) => (
                                <ContainersSlideView
                                  containers={containers}
                                  onFormReady={() => {
                                    initDetailValues(containers);
                                  }}
                                  onSave={newContainers => {
                                    slideToggle(false);
                                    setFieldValue('containers', newContainers);
                                  }}
                                />
                              )}
                            </Subscribe>
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}
              </SectionHeader>
              <ContainersDatesSummary
                agreedArrivalDateFrom={agreedArrivalDateFrom}
                agreedArrivalDateTo={agreedArrivalDateTo}
                actualArrivalDateFrom={actualArrivalDateFrom}
                actualArrivalDateTo={actualArrivalDateTo}
              />
              <ContainersAmountSummary
                numOfContainers={numOfContainers}
                numOfApprovedAgreed={numOfApprovedAgreed}
                numOfApprovedActual={numOfApprovedActual}
              />
            </GridColumn>
          </div>
        );
      }}
    </Subscribe>
  );
};
export default ContainerWarehouseArrivalSection;
