// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { BATCHES_POOL, isSelectedBatchesPool } from 'modules/shipment/helpers';
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

    // TODO: need shipment.container.list && shipment.batches.list && shipment.containerBatches.list to view

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

export default CargoSection;
