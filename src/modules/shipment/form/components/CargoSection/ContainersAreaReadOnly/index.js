// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { injectUid } from 'utils/id';

import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';

import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
} from 'modules/shipment/form/containers';
import { ShipmentContainerCard, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import {
  isSelectedBatchesPool,
  isSelectedContainer,
  getBatchesInPool,
} from 'modules/shipment/helpers';
import Action from 'modules/shipment/form/components/Action';

import {
  ContainersWrapperStyle,
  ContainersNavbarWrapperStyle,
  ContainersBodyWrapperStyle,
  ContainersHeaderWrapperStyle,
  IconStyle,
  TitleStyle,
  ContainersGridStyle,
  SelectBatchesPoolCardWrapperStyle,
  SelectContainerCardWrapperStyle,
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  selectCardId: ?string,
  selectedBatches: Array<Object>,
};

function ContainersArea({ selectCardId, selectedBatches }: Props) {
  console.log(selectedBatches);
  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {({ state: { containers }, setFieldValue }, { state: { batches } }) => {
        const batchesInPool = getBatchesInPool(batches);
        const isSelectedContainerCard = isSelectedContainer(selectCardId);
        return (
          <div className={ContainersWrapperStyle}>
            <div className={ContainersNavbarWrapperStyle} />
            <div className={ContainersBodyWrapperStyle}>
              <div className={ContainersHeaderWrapperStyle}>
                <div className={IconStyle}>
                  <Icon icon="CONTAINER" />
                </div>
                <div className={TitleStyle}>
                  <FormattedMessage id="modules.Shipments.containers" defaultMessage="CONTAINERS" />{' '}
                  (
                  <FormattedNumber value={containers.length} />)
                </div>
              </div>
              <div className={ContainersGridStyle}>
                <div className={SelectBatchesPoolCardWrapperStyle(isSelectedBatchesPool(batches))}>
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                  />
                  {isSelectedContainerCard ? (
                    <Action
                      onClick={() => console.log('action')}
                      message={
                        <FormattedMessage
                          id="modules.shipment.moveToBatchesPool"
                          defaultMessage="MOVE TO BATCHES POOL"
                        />
                      }
                    />
                  ) : (
                    <Action
                      disabled
                      message={
                        <FormattedMessage
                          id="modules.shipment.cantMove"
                          defaultMessage="CAN NOT MOVE TO HERE"
                        />
                      }
                    />
                  )}
                </div>

                <>
                  {containers.map(container => {
                    return (
                      <div key={container.id} className={SelectContainerCardWrapperStyle}>
                        <ShipmentContainerCard container={container} />
                        {isSelectedContainerCard && selectCardId === container.id ? (
                          <Action
                            disabled
                            message={
                              <FormattedMessage
                                id="modules.shipment.cantMove"
                                defaultMessage="CAN NOT MOVE TO HERE"
                              />
                            }
                          />
                        ) : (
                          <Action
                            onClick={() => console.log('action')}
                            message={
                              <FormattedMessage
                                id="modules.shipment.moveToContainer"
                                defaultMessage="MOVE TO CONTAINER"
                              />
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
            <div className={ContainersFooterWrapperStyle}>
              <NewButton
                label={
                  <FormattedMessage
                    id="modules.shipment.newContainer"
                    defaultMessage="NEW CONTAINER"
                  />
                }
                onClick={() => {
                  const clonedContainers = containers.slice(0);
                  setFieldValue('containers', [
                    ...clonedContainers,
                    injectUid({
                      no: `container no ${containers.length + 1}`,
                      isNew: true,
                      batches: [],
                      tags: [],
                      totalVolume: {
                        metric: 'm³',
                        value: 0,
                      },
                      totalWeight: {
                        metric: 'kg',
                        value: 0,
                      },
                      totalBatchQuantity: 0,
                      totalBatchPackages: 0,
                      totalNumberOfUniqueOrderItems: 0,
                      warehouseArrivalActualDateAssignedTo: [],
                      warehouseArrivalAgreedDateAssignedTo: [],
                    }),
                  ]);
                }}
              />
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default ContainersArea;
