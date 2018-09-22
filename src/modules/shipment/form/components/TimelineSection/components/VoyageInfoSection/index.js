// @flow
import * as React from 'react';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import { selectSearchEnumInputFactory, textInputFactory } from 'modules/form/helpers';
import { SectionHeader, Label, FieldItem, Tooltip } from 'components/Form';
import { VoyageInfoSectionWrapperStyle, SelectTransportTypeMessageStyle } from './style';

type Props = {
  isNew: boolean,
  icon: string,
  title: string,
  voyage: Object,
  initialVoyage: Object,
  sourceName: string,
  setFieldDeepValue: Function,
};

class VoyageInfoSection extends React.PureComponent<Props> {
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

    let nextVoyageSourceName = null;
    let prevVoyageSourceName = null;
    if (title === 'FIRST VOYAGE') {
      nextVoyageSourceName = 'voyages.1';
    }
    if (title === 'SECOND VOYAGE') {
      prevVoyageSourceName = 'voyages.0';
      nextVoyageSourceName = 'voyages.2';
    }
    if (title === 'THIRD VOYAGE') {
      prevVoyageSourceName = 'voyages.1';
    }

    return (
      <div className={VoyageInfoSectionWrapperStyle} {...rest}>
        <GridColumn>
          <SectionHeader icon={icon} title={title} />

          {canSelectPorts ? (
            <FormField
              name={`${sourceName}.departurePort.${deepField}`}
              initValue={initialVoyage.departurePort[deepField]}
              setFieldValue={(name, value) => {
                setFieldDeepValue(name, value);
                if (prevVoyageSourceName) {
                  setFieldDeepValue(`${prevVoyageSourceName}.arrivalPort.${deepField}`, value);
                }
              }}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType,
                  initValue: initialVoyage.departurePort[deepField],
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
              initValue={initialVoyage.arrivalPort[deepField]}
              setFieldValue={(name, value) => {
                setFieldDeepValue(name, value);
                if (nextVoyageSourceName) {
                  setFieldDeepValue(`${nextVoyageSourceName}.departurePort.${deepField}`, value);
                }
              }}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType,
                  initValue: initialVoyage.arrivalPort[deepField],
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
                initValue: initialVoyage[name],
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
                initValue: initialVoyage[name],
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
