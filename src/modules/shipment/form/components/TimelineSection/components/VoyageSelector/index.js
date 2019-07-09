// @flow
import * as React from 'react';
import type { ShipmentPayload } from 'generated/graphql';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import emitter from 'utils/emitter';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { injectUid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import { getLatestDate } from 'utils/shipment';
import { getTransportIcon } from '../Timeline/helpers';
import {
  VoyageSelectorWrapperStyle,
  VoyageOptionsWrapperStyle,
  VoyageIconWrapperStyle,
  VoyageIconStyle,
} from './style';

type Props = {
  editable: boolean,
  shipment: ShipmentPayload,
  setFieldDeepValue: (field: string, value: any) => void,
  setShipmentContainers: Function,
  shipmentContainers: Array<Object>,
};

type RenderIconOptions = {
  numOfIcons: number,
  isActive: boolean,
  isOptionsOpen: boolean,
  toggle?: () => void,
  editable: boolean,
};

const generateVoyages = (currentVoyages: Array<Object>, newNumOfVoyages: number) => {
  const currentNumOfVoyages = currentVoyages.length;

  if (newNumOfVoyages === currentNumOfVoyages) {
    return currentVoyages;
  }

  const dischargePort = getByPathWithDefault(
    {},
    'arrivalPort',
    currentVoyages[currentNumOfVoyages - 1]
  );
  const dischargePortArrival = getByPathWithDefault(
    {},
    'arrival',
    currentVoyages[currentNumOfVoyages - 1]
  );

  if (newNumOfVoyages < currentVoyages.length) {
    const newVoyages = cloneDeep(currentVoyages).slice(0, newNumOfVoyages);

    newVoyages[newVoyages.length - 1].arrivalPort = dischargePort;
    newVoyages[newVoyages.length - 1].arrival = dischargePortArrival;

    return newVoyages;
  }

  const newVoyages = cloneDeep(currentVoyages);

  for (let counter = currentNumOfVoyages; counter < newNumOfVoyages; counter += 1) {
    if (counter === newNumOfVoyages - 1) {
      newVoyages[currentNumOfVoyages - 1].arrivalPort = {};
      newVoyages[currentNumOfVoyages - 1].arrival = {};

      newVoyages.push(
        injectUid({
          arrivalPort: dischargePort,
          arrival: dischargePortArrival,
        })
      );
    } else {
      newVoyages.push(injectUid({}));
    }
  }

  return newVoyages;
};

class VoyageSelector extends React.PureComponent<Props> {
  renderIcon = (options: RenderIconOptions) => {
    const { numOfIcons, isActive, toggle, isOptionsOpen, editable } = options;
    const { shipment } = this.props;
    const transportType = getByPathWithDefault('', 'transportType', shipment);

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
    const { shipment, setFieldDeepValue, setShipmentContainers, shipmentContainers } = this.props;

    const voyages = getByPathWithDefault([], 'voyages', shipment);
    if (isOptionsOpen) {
      const newVoyages = generateVoyages(voyages, numOfIcons);
      setFieldDeepValue('voyages', newVoyages);
      setShipmentContainers(
        'containers',
        shipmentContainers.map(container =>
          container.autoCalculatedFreeTimeStartDate
            ? {
                ...container,
                freeTimeStartDate: getLatestDate(newVoyages[newVoyages.length - 1].arrival),
              }
            : container
        )
      );
      setTimeout(() => {
        emitter.emit('AUTO_DATE');
      }, 200);
    }
    if (toggle) toggle();
  };

  render() {
    const { shipment, editable } = this.props;
    const voyages = getByPathWithDefault([], 'voyages', shipment);
    return (
      <BooleanValue>
        {({ value: isOptionsOpen, set: selectorToggle }) =>
          isOptionsOpen ? (
            <OutsideClickHandler
              onOutsideClick={() => (editable ? selectorToggle(false) : () => {})}
            >
              <div data-testid="voyageOptions" className={VoyageOptionsWrapperStyle}>
                {this.renderIcon({
                  numOfIcons: 1,
                  isActive: voyages.length === 1,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable,
                })}
                {this.renderIcon({
                  numOfIcons: 2,
                  isActive: voyages.length === 2,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable,
                })}
                {this.renderIcon({
                  numOfIcons: 3,
                  isActive: voyages.length === 3,
                  isOptionsOpen,
                  toggle: () => selectorToggle(false),
                  editable,
                })}
              </div>
            </OutsideClickHandler>
          ) : (
            <div
              data-testid="voyageSelector"
              className={VoyageSelectorWrapperStyle(editable)}
              onClick={() => (editable ? selectorToggle(true) : () => {})}
              role="presentation"
            >
              <Label align="right">
                <FormattedMessage id="modules.Shipments.ofVoyages" defaultMessage="# OF VOYAGES" />
              </Label>
              {this.renderIcon({
                numOfIcons: voyages.length,
                isActive: true,
                isOptionsOpen,
                editable,
              })}
            </div>
          )
        }
      </BooleanValue>
    );
  }
}

export default VoyageSelector;
