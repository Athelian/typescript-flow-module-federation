// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import {
  SHIPMENT_CONTAINER_LIST,
  SHIPMENT_BATCH_LIST,
  SHIPMENT_BATCH_LIST_IN_CONTAINER,
} from 'modules/permission/constants/shipment';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { CargoSectionWrapperStyle } from './style';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';

const UNSELECTED = -2;
const POOL = -1;

type Props = {|
  shipmentIsArchived: boolean,
  importerId: string,
  exporterId: string,
|};

const CargoSection = ({ shipmentIsArchived, importerId, exporterId }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [focusedContainerIndex, setFocusedCardIndex] = React.useState(UNSELECTED);
  const [isSelectBatchesMode, setIsSelectBatchesMode] = React.useState(false);
  const [selectedBatches, setSelectedBatches] = React.useState([]);

  const onSelectBatch = React.useCallback(
    (batch: Object) => {
      if (selectedBatches.map(({ id }) => id).includes(batch.id)) {
        setSelectedBatches(selectedBatches.filter(item => item.id !== batch.id));
      } else {
        setSelectedBatches([...selectedBatches, batch]);
      }
    },
    [selectedBatches]
  );

  const onChangeSelectMode = React.useCallback((isSelectMode: boolean) => {
    setIsSelectBatchesMode(isSelectMode);
    setSelectedBatches([]);
  }, []);

  if (
    !hasPermission(SHIPMENT_CONTAINER_LIST) ||
    !hasPermission(SHIPMENT_BATCH_LIST) ||
    !hasPermission(SHIPMENT_BATCH_LIST_IN_CONTAINER)
  ) {
    return null;
  }

  return (
    <Subscribe to={[ShipmentBatchesContainer]}>
      {batchesContainer => (
        <>
          <SectionHeader
            icon="CARGO"
            title={
              <>
                <FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO " />
                {' ('}
                <FormattedNumber value={batchesContainer.state.batches.length} />
                {')'}
              </>
            }
          />
          <div className={CargoSectionWrapperStyle}>
            <ContainersArea
              isFocusedBatchesPool={focusedContainerIndex === POOL}
              focusedContainerIndex={focusedContainerIndex}
              isSelectBatchesMode={isSelectBatchesMode}
              onChangeSelectMode={onChangeSelectMode}
              onSelect={setFocusedCardIndex}
              onSelectPool={() =>
                focusedContainerIndex === POOL
                  ? setFocusedCardIndex(UNSELECTED)
                  : setFocusedCardIndex(POOL)
              }
              onDeselect={() => setFocusedCardIndex(UNSELECTED)}
              selectedBatches={selectedBatches}
              shipmentIsArchived={shipmentIsArchived}
            />
            <BatchesArea
              importerId={importerId}
              exporterId={exporterId}
              isFocusedBatchesPool={focusedContainerIndex === POOL}
              focusedContainerIndex={focusedContainerIndex}
              isSelectBatchesMode={isSelectBatchesMode}
              onChangeSelectMode={onChangeSelectMode}
              selectedBatches={selectedBatches}
              onSelectBatch={onSelectBatch}
              shipmentIsArchived={shipmentIsArchived}
            />
          </div>
        </>
      )}
    </Subscribe>
  );
};

export default CargoSection;
