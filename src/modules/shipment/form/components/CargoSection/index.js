// @flow
import * as React from 'react';
import { isFocusedBatchesPool, isFocusedContainerCard } from 'modules/shipment/helpers';
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
  focusedCardIndex: string | number | null,
  isSelectBatchesMode: boolean,
  selectedBatches: Array<Object>,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    focusedCardIndex: null, // 'Batches_Pool' = Batches Pool
    isSelectBatchesMode: false,
    selectedBatches: [],
  };

  setIsSelectBatchesMode = (isSelectBatchesMode: boolean) =>
    this.setState({ isSelectBatchesMode, selectedBatches: [] });

  setSelected = (cardIndex: string | number | null) => {
    const { focusedCardIndex } = this.state;
    if (focusedCardIndex === cardIndex) {
      this.setState({ focusedCardIndex: null });
    } else {
      this.setState({ focusedCardIndex: cardIndex });
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
    const { focusedCardIndex, isSelectBatchesMode, selectedBatches } = this.state;

    return (
      <div className={CargoSectionWrapperStyle}>
        {isSelectBatchesMode ? (
          <ContainersAreaReadOnly
            focusedCardIndex={focusedCardIndex}
            setIsSelectBatchesMode={this.setIsSelectBatchesMode}
            selectedBatches={selectedBatches}
          />
        ) : (
          <ContainersArea focusedCardIndex={focusedCardIndex} setSelected={this.setSelected} />
        )}

        {isFocusedContainerCard(focusedCardIndex) ? (
          <ContainerBatchesArea
            // $FlowFixMe
            focusedContainerIndex={focusedCardIndex}
            isSelectBatchesMode={isSelectBatchesMode}
            setIsSelectBatchesMode={this.setIsSelectBatchesMode}
            selectedBatches={selectedBatches}
            setSelectedBatches={this.setSelectedBatches}
          />
        ) : (
          <BatchesArea
            isFocusedBatchesPool={isFocusedBatchesPool(focusedCardIndex)}
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
