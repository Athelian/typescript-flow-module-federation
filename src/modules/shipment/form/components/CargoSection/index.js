// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { BATCHES_POOL, isSelectedBatchesPool } from 'modules/shipment/helpers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_CONTAINER_LIST,
  SHIPMENT_BATCH_LIST,
  SHIPMENT_BATCH_LIST_IN_CONTAINER,
} from 'modules/permission/constants/shipment';
import { CargoSectionWrapperStyle } from './style';
import ContainersAreaReadOnly from './ContainersAreaReadOnly';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';
import ContainerBatchesArea from './ContainerBatchesArea';

type Props = {};

type State = {
  selectCardId: ?string,
  containerIndex: number,
  isSelectBatchesMode: boolean,
  selectedBatches: Array<Object>,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    selectCardId: null, // 'Batches_Pool' = Batches Pool
    containerIndex: -1,
    isSelectBatchesMode: false,
    selectedBatches: [],
  };

  setIsSelectBatchesMode = (isSelectBatchesMode: boolean) =>
    this.setState({ isSelectBatchesMode, selectedBatches: [] });

  setSelected = ({ cardId, containerIndex }: { cardId: string, containerIndex: number }) => {
    const { selectCardId } = this.state;
    if (selectCardId === cardId) {
      this.setState({ selectCardId: null, containerIndex: -1 });
    } else {
      this.setState({ selectCardId: cardId, containerIndex });
    }
  };

  setSelectedBatches = (batch: Object) => {
    const { selectedBatches } = this.state;
    if (selectedBatches.includes(batch)) {
      this.setState({
        selectedBatches: selectedBatches.filter(({ id }) => id !== batch.id),
      });
    } else {
      this.setState({
        selectedBatches: [...selectedBatches, batch],
      });
    }
  };

  render() {
    const { selectCardId, containerIndex, isSelectBatchesMode, selectedBatches } = this.state;

    return (
      <div className={CargoSectionWrapperStyle}>
        {isSelectBatchesMode ? (
          <ContainersAreaReadOnly
            selectCardId={selectCardId}
            setSelected={this.setSelected}
            setIsSelectBatchesMode={this.setIsSelectBatchesMode}
            selectedBatches={selectedBatches}
          />
        ) : (
          <ContainersArea selectCardId={selectCardId} setSelected={this.setSelected} />
        )}

        {isNullOrUndefined(selectCardId) || selectCardId === BATCHES_POOL ? (
          <BatchesArea
            isSelectedBatchesPool={isSelectedBatchesPool(selectCardId)}
            isSelectBatchesMode={isSelectBatchesMode}
            setIsSelectBatchesMode={this.setIsSelectBatchesMode}
            selectedBatches={selectedBatches}
            setSelectedBatches={this.setSelectedBatches}
          />
        ) : (
          <ContainerBatchesArea
            containerId={selectCardId}
            containerIndex={containerIndex}
            isSelectBatchesMode={isSelectBatchesMode}
            setIsSelectBatchesMode={this.setIsSelectBatchesMode}
            selectedBatches={selectedBatches}
            setSelectedBatches={this.setSelectedBatches}
          />
        )}
      </div>
    );
  }
}

const CargoSectionPermissionWrapper = () => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  if (
    !hasPermission(SHIPMENT_CONTAINER_LIST) ||
    !hasPermission(SHIPMENT_BATCH_LIST) ||
    !hasPermission(SHIPMENT_BATCH_LIST_IN_CONTAINER)
  )
    return null;
  return <CargoSection />;
};

export default CargoSectionPermissionWrapper;
