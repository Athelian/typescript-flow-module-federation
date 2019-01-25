// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { CargoSectionWrapperStyle } from './style';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';

type Props = {};

type State = {
  selectedContainerId: ?string,
};

export const getUsefulBatches = (
  batches: Array<Object>,
  selectedContainerId: ?string
): {
  usefulBatch: Array<Object>,
  leftCardIsSelected: boolean,
  containerIsSelected: boolean,
} => {
  let usefulBatch = batches.slice(0);

  const leftCardIsSelected = !isNullOrUndefined(selectedContainerId);

  const containerIsSelected = leftCardIsSelected && selectedContainerId !== 'Pool';

  if (leftCardIsSelected) {
    if (containerIsSelected) {
      usefulBatch = usefulBatch.filter(batch =>
        !isNullOrUndefined(batch.container) ? batch.container.id === selectedContainerId : false
      );
    } else {
      usefulBatch = usefulBatch.filter(batch => isNullOrUndefined(batch.container));
    }
  }
  return { usefulBatch, leftCardIsSelected, containerIsSelected };
};

class CargoSection extends React.Component<Props, State> {
  state = {
    selectedContainerId: null, // 'Pool' = Batches Pool
  };

  setSelectedContainerId = (id: string) => {
    const { selectedContainerId } = this.state;
    if (selectedContainerId === id) {
      this.setState({ selectedContainerId: null });
    } else {
      this.setState({ selectedContainerId: id });
    }
  };

  render() {
    const { selectedContainerId } = this.state;

    return (
      <div className={CargoSectionWrapperStyle}>
        <ContainersArea
          selectedContainerId={selectedContainerId}
          setSelectedContainerId={this.setSelectedContainerId}
        />
        <BatchesArea selectedContainerId={selectedContainerId} />
      </div>
    );
  }
}

export default CargoSection;
