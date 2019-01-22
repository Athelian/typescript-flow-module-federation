// @flow
import * as React from 'react';
import { CargoSectionWrapperStyle } from './style';
import ContainersArea from './ContainersArea';
import BatchesArea from './BatchesArea';

type Props = {};

type State = {
  selectedContainer: ?string,
};

class CargoSection extends React.Component<Props, State> {
  state = {
    selectedContainer: null,
  };

  render() {
    const { selectedContainer } = this.state;

    return (
      <div className={CargoSectionWrapperStyle}>
        <ContainersArea selectedContainer={selectedContainer} />
        <BatchesArea selectedContainer={selectedContainer} />
      </div>
    );
  }
}

export default CargoSection;
