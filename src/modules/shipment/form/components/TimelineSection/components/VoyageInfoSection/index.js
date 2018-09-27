// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import {
  parseEnumDescription,
  selectSearchEnumInputFactory,
  textInputFactory,
} from 'modules/form/helpers';
import { SectionHeader, Label, FieldItem, Tooltip } from 'components/Form';
import { VoyageInfoSectionWrapperStyle, SelectTransportTypeMessageStyle } from './style';

type OptionalProps = {
  voyage: {
    arrivalPort?: {
      airport: string,
      seaport: string,
    },
    departurePort?: {
      airport: string,
      seaport: string,
    },
    vesselCode?: string,
    vesselName?: string,
  },
  initialVoyage: ?{
    arrivalPort?: {
      airport: string,
      seaport: string,
    },
    departurePort?: {
      airport: string,
      seaport: string,
    },
    vesselCode?: string,
    vesselName?: string,
  },
};

type Props = OptionalProps & {
  isNew: boolean,
  icon: string,
  title: string,
  sourceName: string,
  setFieldDeepValue: Function,
};

const defaultProps = {
  voyage: {},
  initialVoyage: {},
};

class VoyageInfoSection extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      isNew,
      icon,
      title,
      voyage,
      initialVoyage,
      sourceName,
      setFieldDeepValue,
      ...rest
    } = this.props;

    const canSelectPorts = icon === 'SHIPMENT' || icon === 'PLANE';
    const enumType = icon === 'SHIPMENT' ? 'Seaport' : 'Airport';
    const deepField = icon === 'SHIPMENT' ? 'seaport' : 'airport';

    return (
      <div className={VoyageInfoSectionWrapperStyle} {...rest}>
        <GridColumn>
          <SectionHeader icon={icon} title={title} />

          {canSelectPorts ? (
            <FormField
              name={`${sourceName}.departurePort.${deepField}`}
              initValue={parseEnumDescription(
                voyage.departurePort && voyage.departurePort[deepField]
              )}
              setFieldValue={setFieldDeepValue}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType,
                  initValue:
                    initialVoyage &&
                    initialVoyage.departurePort &&
                    initialVoyage.departurePort[deepField],
                  inputHandlers,
                  name,
                  isNew,
                  label: 'DEPARTURE PORT',
                })
              }
            </FormField>
          ) : (
            <FieldItem
              label={<Label>DEPARTURE PORT</Label>}
              tooltip={
                <Tooltip
                  isNew={isNew}
                  infoMessage={`You can select a transport type in the Shipment section under field labeled "TRANSPORTATION"`}
                />
              }
              input={
                <div className={SelectTransportTypeMessageStyle}>
                  Please select a transport type
                </div>
              }
            />
          )}

          {canSelectPorts ? (
            <FormField
              name={`${sourceName}.arrivalPort.${deepField}`}
              initValue={parseEnumDescription(voyage.arrivalPort && voyage.arrivalPort[deepField])}
              setFieldValue={setFieldDeepValue}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType,
                  initValue:
                    initialVoyage &&
                    initialVoyage.arrivalPort &&
                    initialVoyage.arrivalPort[deepField],
                  inputHandlers,
                  name,
                  isNew,
                  label: 'ARRIVAL PORT',
                })
              }
            </FormField>
          ) : (
            <FieldItem
              label={<Label>ARRIVAL PORT</Label>}
              tooltip={
                <Tooltip
                  isNew={isNew}
                  infoMessage={`You can select a transport type in the Shipment section under field labeled "TRANSPORTATION"`}
                />
              }
              input={
                <div className={SelectTransportTypeMessageStyle}>
                  Please select a transport type
                </div>
              }
            />
          )}

          <FormField
            name={`${sourceName}.vesselName`}
            initValue={voyage.vesselName}
            setFieldValue={setFieldDeepValue}
          >
            {({ name, ...inputHandlers }) =>
              textInputFactory({
                initValue:
                  initialVoyage && Object.prototype.hasOwnProperty.call(initialVoyage, name)
                    ? initialVoyage[name]
                    : '',
                inputHandlers,
                name,
                isNew,
                label: 'VESSEL NAME',
              })
            }
          </FormField>

          <FormField
            name={`${sourceName}.vesselCode`}
            initValue={voyage.vesselCode}
            setFieldValue={setFieldDeepValue}
          >
            {({ name, ...inputHandlers }) =>
              textInputFactory({
                initValue:
                  initialVoyage && Object.prototype.hasOwnProperty.call(initialVoyage, name)
                    ? initialVoyage[name]
                    : '',
                inputHandlers,
                name,
                isNew,
                label: 'VESSEL CODE',
              })
            }
          </FormField>
        </GridColumn>
      </div>
    );
  }
}

export default VoyageInfoSection;
