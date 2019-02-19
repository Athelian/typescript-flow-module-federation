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
  readOnly: boolean,
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
  editable: boolean,
};

const voyagesGenerator = (voyages: Array<Object>, total: number) => {
  if (total === voyages.length) return voyages;
  if (voyages.length > total) {
    return [...voyages.slice(0, total), ...voyages.slice(total + voyages.length - total + 1)];
  }
  const {
    arrivalPort = {
      seaport: '',
      airport: '',
    },
  } = voyages[voyages.length - 1] || {};
  const newVoyages = [];
  for (let counter = 0; counter < total - voyages.length; counter += 1) {
    newVoyages.push(
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
  return [...voyages, ...newVoyages];
};

class VoyageSelector extends React.PureComponent<Props> {
  renderIcon = (options: RenderIconOptions) => {
    const { numOfIcons, isActive, toggle, isOptionsOpen, editable } = options;
    const { shipment } = this.props;
    const { transportType } = shipment;

    const transportIcon = getTransportIcon(transportType);

    if (numOfIcons === 3) {
      return (
        <button
          className={VoyageIconWrapperStyle(isActive, editable)}
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
          className={VoyageIconWrapperStyle(isActive, editable)}
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
        className={VoyageIconWrapperStyle(isActive, editable)}
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
      readOnly,
    } = this.props;
    return (
      <BooleanValue>
        {({ value: isOptionsOpen, set: selectorToggle }) =>
          isOptionsOpen ? (
            <OutsideClickHandler
              onOutsideClick={() => (!readOnly ? selectorToggle(false) : () => {})}
            >
              <div data-testid="voyageOptions" className={VoyageOptionsWrapperStyle}>
                {this.renderIcon({
                  numOfIcons: 1,
                  isActive: voyages.length === 1,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable: !readOnly,
                })}
                {this.renderIcon({
                  numOfIcons: 2,
                  isActive: voyages.length === 2,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable: !readOnly,
                })}
                {this.renderIcon({
                  numOfIcons: 3,
                  isActive: voyages.length === 3,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable: !readOnly,
                })}
              </div>
            </OutsideClickHandler>
          ) : (
            <div
              data-testid="voyageSelector"
              className={VoyageSelectorWrapperStyle(!readOnly)}
              onClick={() => (!readOnly ? selectorToggle(true) : () => {})}
              role="presentation"
            >
              <Label align="right">
                <FormattedMessage id="modules.Shipments.ofVoyages" defaultMessage="# OF VOYAGES" />
              </Label>
              {this.renderIcon({
                numOfIcons: voyages.length,
                isActive: true,
                isOptionsOpen,
                editable: !readOnly,
              })}
            </div>
          )
        }
      </BooleanValue>
    );
  }
}

export default VoyageSelector;
