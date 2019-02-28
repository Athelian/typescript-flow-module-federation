// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import {
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_UPDATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
} from 'modules/permission/constants/container';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import { ShipmentContainerCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import { GridViewWrapperStyle } from './style';

type Props = {
  containers: Array<Object>,
  setDeepFieldValue: Function,
};

export default function ContainerList({ containers, setDeepFieldValue }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <div className={GridViewWrapperStyle}>
      {containers.map((container, index) => (
        <BooleanValue key={container.id}>
          {({ value: isOpenSelectWarehouse, set: toggleSelectWarehouse }) => (
            <>
              <ShipmentContainerCard
                container={container}
                update={newContainer => {
                  setDeepFieldValue(`containers.${index}`, newContainer);
                }}
                onSelectWarehouse={() => toggleSelectWarehouse(true)}
                editable={{
                  no: hasPermission([SHIPMENT_UPDATE, CONTAINER_UPDATE, CONTAINER_SET_NO]),
                  warehouse: hasPermission([
                    SHIPMENT_UPDATE,
                    CONTAINER_UPDATE,
                    CONTAINER_SET_WAREHOUSE,
                  ]),
                  warehouseArrivalAgreedDate: hasPermission([
                    SHIPMENT_UPDATE,
                    CONTAINER_UPDATE,
                    CONTAINER_SET_AGREE_ARRIVAL_DATE,
                  ]),
                  warehouseArrivalAgreedDateApprovedBy: hasPermission([
                    SHIPMENT_UPDATE,
                    CONTAINER_UPDATE,
                    CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
                  ]),
                  warehouseArrivalActualDate: hasPermission([
                    SHIPMENT_UPDATE,
                    CONTAINER_UPDATE,
                    CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
                  ]),
                  warehouseArrivalActualDateApprovedBy: hasPermission([
                    SHIPMENT_UPDATE,
                    CONTAINER_UPDATE,
                    CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
                  ]),
                }}
              />
              <SlideView
                isOpen={isOpenSelectWarehouse}
                onRequestClose={() => toggleSelectWarehouse(false)}
                options={{ width: '1030px' }}
              >
                {isOpenSelectWarehouse && (
                  <SelectWareHouse
                    selected={container.warehouse}
                    onCancel={() => toggleSelectWarehouse(false)}
                    onSelect={newValue => {
                      toggleSelectWarehouse(false);
                      setDeepFieldValue(`containers.${index}`, {
                        ...container,
                        warehouse: newValue,
                      });
                    }}
                  />
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      ))}
    </div>
  );
}
