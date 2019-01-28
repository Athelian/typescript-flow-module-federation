// @flow
import * as React from 'react';
import { injectIntl, type IntlShape, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { injectUid } from 'utils/id';
import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
} from 'modules/shipment/form/containers';
import { ShipmentContainerCard, CardAction, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import messages from 'modules/shipment/messages';
import { BATCHES_POOL, isSelectedBatchesPool, getBatchesInPool } from 'modules/shipment/helpers';

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
  SelectContainerCardBackgroundStyle,
  EyeballIconStyle,
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  intl: IntlShape,
  selectedContainerId: ?string,
  setSelectedContainerId: string => void,
};

function ContainersArea({ intl, selectedContainerId, setSelectedContainerId }: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {({ state: { containers }, setFieldValue, setFieldArrayValue }, { state: { batches } }) => {
        const batchesInPool = getBatchesInPool(batches);

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
                <button
                  className={SelectBatchesPoolCardWrapperStyle(
                    isSelectedBatchesPool(selectedContainerId)
                  )}
                  type="button"
                  onClick={() => setSelectedContainerId(BATCHES_POOL)}
                >
                  <div className={EyeballIconStyle}>
                    <Icon
                      icon={isSelectedBatchesPool(selectedContainerId) ? 'INVISIBLE' : 'VISIBLE'}
                    />
                  </div>
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                    setSelectedContainerId={setSelectedContainerId}
                  />
                </button>
                {containers.map((container, position) => {
                  const isSelected = selectedContainerId === container.id;

                  return (
                    <div className={SelectContainerCardWrapperStyle}>
                      <button
                        className={SelectContainerCardBackgroundStyle(isSelected)}
                        type="button"
                        onClick={() => setSelectedContainerId(container.id)}
                      >
                        <div className={EyeballIconStyle}>
                          <Icon icon={isSelected ? 'INVISIBLE' : 'VISIBLE'} />
                        </div>
                      </button>
                      <ShipmentContainerCard
                        key={container.id}
                        container={container}
                        saveOnBlur={updateContainer => {
                          setFieldArrayValue(position, updateContainer);
                        }}
                        // onClick={() => containerSlideToggle(true)}
                        actions={[
                          <CardAction
                            icon="REMOVE"
                            hoverColor="RED"
                            onClick={() => {
                              setFieldValue(
                                'containers',
                                containers.filter(
                                  ({ id: containerId }) => container.id !== containerId
                                )
                              );
                            }}
                          />,
                        ]}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={ContainersFooterWrapperStyle}>
              <NewButton
                label={intl.formatMessage(messages.newContainer)}
                onClick={() => {
                  const clonedContainers = containers.slice(0);
                  clonedContainers.push(
                    injectUid({
                      no: `container no ${containers.length + 1}`,
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
                    })
                  );
                  setFieldValue('containers', clonedContainers);
                }}
              />
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default injectIntl(ContainersArea);
