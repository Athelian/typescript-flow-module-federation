// @flow
import * as React from 'react';
import { CargoSectionWrapperStyle } from './style';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';

type Props = {};

type State = {
  selectedContainerId: ?string,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    selectedContainerId: null, // 'Batches_Pool' = Batches Pool
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
