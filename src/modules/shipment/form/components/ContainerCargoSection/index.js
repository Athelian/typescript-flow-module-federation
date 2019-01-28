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
  usefulBatches: Array<Object>,
  leftCardIsSelected: boolean,
  containerIsSelected: boolean,
} => {
  let usefulBatches = batches.slice(0);

  const leftCardIsSelected = !isNullOrUndefined(selectedContainerId);

  const containerIsSelected = leftCardIsSelected && selectedContainerId !== 'Pool';

  if (leftCardIsSelected) {
    if (containerIsSelected) {
      usefulBatches = usefulBatches.filter(batch =>
        !isNullOrUndefined(batch.container) ? batch.container.id === selectedContainerId : false
      );
    } else {
      usefulBatches = usefulBatches.filter(batch => isNullOrUndefined(batch.container));
    }
  }
  return { usefulBatches, leftCardIsSelected, containerIsSelected };
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
