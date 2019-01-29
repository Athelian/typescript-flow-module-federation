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
  selectCardId: ?string,
  containerIndex: number,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    selectCardId: null, // 'Batches_Pool' = Batches Pool
    containerIndex: -1,
  };

  setSelected = ({ cardId, containerIndex }: { cardId: string, containerIndex: number }) => {
    const { selectCardId } = this.state;
    if (selectCardId === cardId) {
      this.setState({ selectCardId: null, containerIndex: -1 });
    } else {
      this.setState({ selectCardId: cardId, containerIndex });
    }
  };

  render() {
    const { selectCardId, containerIndex } = this.state;
    return (
      <div className={CargoSectionWrapperStyle}>
        <ContainersArea selectCardId={selectCardId} setSelected={this.setSelected} />
        {isNullOrUndefined(selectCardId) || selectCardId === BATCHES_POOL ? (
          <BatchesArea isSelectedBatchesPool={isSelectedBatchesPool(selectCardId)} />
        ) : (
          <ContainerBatchesArea containerId={selectCardId} containerIndex={containerIndex} />
        )}
      </div>
    );
  }
}

export default CargoSection;
