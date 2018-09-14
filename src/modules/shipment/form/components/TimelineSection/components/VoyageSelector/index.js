// @flow
import * as React from 'react';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { getTransportIcon } from '../Timeline/helpers';
import {
  VoyageSelectorWrapperStyle,
  VoyageOptionsWrapperStyle,
  VoyageIconWrapperStyle,
  VoyageIconStyle,
} from './style';

type Props = {
  shipment: any,
};

type State = {
  isOptionsOpen: boolean,
};

class VoyageSelector extends React.Component<Props, State> {
  state = {
    isOptionsOpen: false,
  };

  openOptions = () => {
    this.setState({ isOptionsOpen: true });
  };

  closeOptions = () => {
    this.setState({ isOptionsOpen: false });
  };

  renderIcon = ({ numOfIcons, isActive, onClick }: Object) => {
    const { shipment } = this.props;
    const { transportType } = shipment;

    const transportIcon = getTransportIcon(transportType);

    if (numOfIcons === 3) {
      return (
        <button className={VoyageIconWrapperStyle(isActive)} onClick={onClick} type="button">
          <div className={VoyageIconStyle('bottom')}>
            <Icon icon={transportIcon} />
          </div>
          <div className={VoyageIconStyle('top')}>
            <Icon icon={transportIcon} />
          </div>
          <div className={VoyageIconStyle('bottom')}>
            <Icon icon={transportIcon} />
          </div>
        </button>
      );
    }

    if (numOfIcons === 2) {
      return (
        <button className={VoyageIconWrapperStyle(isActive)} onClick={onClick} type="button">
          <div className={VoyageIconStyle('bottom')}>
            <Icon icon={transportIcon} />
          </div>
          <div className={VoyageIconStyle('top')}>
            <Icon icon={transportIcon} />
          </div>
        </button>
      );
    }

    return (
      <button className={VoyageIconWrapperStyle(isActive)} onClick={onClick} type="button">
        <div className={VoyageIconStyle('middle')}>
          <Icon icon={transportIcon} />
        </div>
      </button>
    );
  };

  render() {
    const { shipment } = this.props;
    const { isOptionsOpen } = this.state;
    const { voyages } = shipment;

    if (isOptionsOpen) {
      return (
        <OutsideClickHandler onOutsideClick={this.closeOptions}>
          <div className={VoyageOptionsWrapperStyle}>
            {this.renderIcon({
              numOfIcons: 1,
              isActive: voyages.length === 1,
              onClick: this.closeOptions,
            })}
            {this.renderIcon({
              numOfIcons: 2,
              isActive: voyages.length === 2,
              onClick: this.closeOptions,
            })}
            {this.renderIcon({
              numOfIcons: 3,
              isActive: voyages.length === 3,
              onClick: this.closeOptions,
            })}
          </div>
        </OutsideClickHandler>
      );
    }

    return (
      <div className={VoyageSelectorWrapperStyle} onClick={this.openOptions} role="presentation">
        <Label align="right"># OF VOYAGES</Label>
        {this.renderIcon({ numOfIcons: voyages.length, isActive: true })}
      </div>
    );
  }
}

export default VoyageSelector;
