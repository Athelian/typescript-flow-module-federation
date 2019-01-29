// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { BATCHES_POOL, isSelectedBatchesPool } from 'modules/shipment/helpers';
import { CargoSectionWrapperStyle } from './style';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';
import ContainerBatchesArea from './ContainerBatchesArea';

type Props = {};

type State = {
  id: ?string,
  index: number,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    id: null, // 'Batches_Pool' = Batches Pool
    index: -1,
  };

  setSelected = ({ id, index }: { id: string, index: number }) => {
    const { id: currentId } = this.state;
    if (currentId === id) {
      this.setState({ id: null, index: -1 });
    } else {
      this.setState({ id, index });
    }
  };

  render() {
    const { id, index } = this.state;
    return (
      <div className={CargoSectionWrapperStyle}>
        <ContainersArea selectedContainerId={id} setSelected={this.setSelected} />
        {isNullOrUndefined(id) || id === BATCHES_POOL ? (
          <BatchesArea isSelectedBatchesPool={isSelectedBatchesPool(id)} />
        ) : (
          <ContainerBatchesArea selectedContainerId={id} selectedContainerIndex={index} />
        )}
      </div>
    );
  }
}

export default CargoSection;
