// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { injectUid } from 'utils/id';
import { getTransportIcon } from '../Timeline/helpers';
import {
  VoyageSelectorWrapperStyle,
  VoyageOptionsWrapperStyle,
  VoyageIconWrapperStyle,
  VoyageIconStyle,
} from './style';

type Props = {
  shipment: {
    voyages: Array<{
      arrival?: {
        approvedAt: ?Date,
        approvedBy: ?Object,
        assignedTo: Array<Object>,
        date: ?Date,
        timelineDateRevisions: Array<Object>,
      },
      arrivalPort?: {
        airport: string,
        seaport: string,
      },
      departure?: {
        approvedAt: ?Date,
        approvedBy: ?Object,
        assignedTo: Array<Object>,
        date: ?Date,
        timelineDateRevisions: Array<Object>,
      },
      departurePort?: {
        airport: string,
        seaport: string,
      },
      vesselCode?: string,
      vesselName?: string,
    }>,
    transportType: string,
  },
  setFieldDeepValue: (field: string, value: any) => void,
};

type RenderIconOptions = {
  numOfIcons: number,
  isActive: boolean,
  isOptionsOpen: boolean,
  toggle?: () => void,
};

const voyagesGenerator = (voyages: Array<Object>, total: number) => {
  if (total === voyages.length) return voyages;

  if (voyages.length > total) {
    voyages.splice(total, voyages.length - total + 1);
  } else {
    const {
      arrivalPort = {
        seaport: '',
        airport: '',
      },
    } = voyages[voyages.length - 1] || {};
    for (let counter = 0; counter < total - voyages.length + 1; counter += 1) {
      voyages.push(
        injectUid({
          arrivalPort: {
            seaport: '',
            airport: '',
          },
          departurePort: counter
            ? {
                seaport: '',
                airport: '',
              }
            : arrivalPort,
        })
      );
    }
  }

  return voyages;
};

class VoyageSelector extends React.Component<Props> {
  renderIcon = (options: RenderIconOptions) => {
    const { numOfIcons, isActive, toggle, isOptionsOpen } = options;
    const { shipment } = this.props;
    const { transportType } = shipment;

    const transportIcon = getTransportIcon(transportType);

    if (numOfIcons === 3) {
      return (
        <button
          className={VoyageIconWrapperStyle(isActive)}
          onClick={this.onClick(numOfIcons, isOptionsOpen, toggle)}
          type="button"
        >
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
        <button
          className={VoyageIconWrapperStyle(isActive)}
          onClick={this.onClick(numOfIcons, isOptionsOpen, toggle)}
          type="button"
        >
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
      <button
        className={VoyageIconWrapperStyle(isActive)}
        onClick={this.onClick(numOfIcons, isOptionsOpen, toggle)}
        type="button"
      >
        <div className={VoyageIconStyle('middle')}>
          <Icon icon={transportIcon} />
        </div>
      </button>
    );
  };

  onClick = (numOfIcons: number, isOptionsOpen: boolean, toggle?: () => void) => () => {
    const { shipment, setFieldDeepValue } = this.props;
    const { voyages } = shipment;
    if (isOptionsOpen) {
      setFieldDeepValue('voyages', voyagesGenerator(voyages, numOfIcons));
    }
    if (toggle) toggle();
  };

  render() {
    const {
      shipment: { voyages },
    } = this.props;

    return (
      <BooleanValue>
        {({ value: isOptionsOpen, set: selectorToggle }) =>
          isOptionsOpen ? (
            <OutsideClickHandler onOutsideClick={() => selectorToggle(false)}>
              <div className={VoyageOptionsWrapperStyle}>
                {this.renderIcon({
                  numOfIcons: 1,
                  isActive: voyages.length === 1,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                })}
                {this.renderIcon({
                  numOfIcons: 2,
                  isActive: voyages.length === 2,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                })}
                {this.renderIcon({
                  numOfIcons: 3,
                  isActive: voyages.length === 3,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                })}
              </div>
            </OutsideClickHandler>
          ) : (
            <div
              className={VoyageSelectorWrapperStyle}
              onClick={() => selectorToggle(true)}
              role="presentation"
            >
              <Label align="right">
                # <FormattedMessage id="modules.shipment.ofVoyages" defaultMessage="OF VOYAGES" />
              </Label>
              {this.renderIcon({
                numOfIcons: voyages.length,
                isActive: true,
                isOptionsOpen,
              })}
            </div>
          )
        }
      </BooleanValue>
    );
  }
}

export default VoyageSelector;
