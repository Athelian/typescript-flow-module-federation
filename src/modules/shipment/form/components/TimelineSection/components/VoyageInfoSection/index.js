// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import {
  SectionHeader,
  Label,
  FieldItem,
  FormTooltip,
  EnumSearchSelectInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import { VoyageInfoSectionWrapperStyle, SelectTransportTypeMessageStyle } from './style';

const parseEnumValue = (enumValue: ?string | ?{ name: string }) => {
  if (enumValue && enumValue.name) return enumValue.name;
  return enumValue;
};

const parseEnumDescriptionOrValue = (
  enumValue: ?string | ?{ description: string, name: string }
) => {
  if (enumValue && enumValue.description) return enumValue.description;
  return parseEnumValue(enumValue);
};

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
    vesselCode: string,
    vesselName: string,
  },
  initialVoyage: {
    arrivalPort?: {
      airport: string,
      seaport: string,
    },
    departurePort?: {
      airport: string,
      seaport: string,
    },
    vesselCode: string,
    vesselName: string,
  },
};

type Props = OptionalProps & {
  isNew: boolean,
  icon: string,
  title: React.Node,
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
              initValue={parseEnumDescriptionOrValue(
                voyage.departurePort && voyage.departurePort[deepField]
              )}
              setFieldValue={setFieldDeepValue}
            >
              {({ name, ...inputHandlers }) => (
                <EnumSearchSelectInputFactory
                  {...inputHandlers}
                  enumType={enumType}
                  originalValue={
                    initialVoyage &&
                    initialVoyage.departurePort &&
                    initialVoyage.departurePort[deepField]
                  }
                  name={name}
                  isNew={isNew}
                  label={
                    <FormattedMessage
                      id="modules.Voyages.departurePort"
                      defaultMessage="DEPARTURE PORT"
                    />
                  }
                />
              )}
            </FormField>
          ) : (
            <FieldItem
              label={
                <Label>
                  <FormattedMessage
                    id="modules.Voyages.departurePort"
                    defaultMessage="DEPARTURE PORT"
                  />
                </Label>
              }
              tooltip={
                <FormTooltip
                  isNew={isNew}
                  infoMessage={
                    <FormattedMessage
                      id="modules.Shipments.tooltipDeparturePort"
                      defaultMessage={`You can select a transport type in the Shipment section under field labeled "TRANSPORTATION"`}
                    />
                  }
                />
              }
              input={
                <div className={SelectTransportTypeMessageStyle}>
                  <FormattedMessage
                    id="modules.Shipments.selectTransportType"
                    defaultMessage="Please select a transport type"
                  />
                </div>
              }
            />
          )}

          {canSelectPorts ? (
            <FormField
              name={`${sourceName}.arrivalPort.${deepField}`}
              initValue={parseEnumDescriptionOrValue(
                voyage.arrivalPort && voyage.arrivalPort[deepField]
              )}
              setFieldValue={setFieldDeepValue}
            >
              {({ name, ...inputHandlers }) => (
                <EnumSearchSelectInputFactory
                  {...inputHandlers}
                  enumType={enumType}
                  originalValue={
                    initialVoyage &&
                    initialVoyage.arrivalPort &&
                    initialVoyage.arrivalPort[deepField]
                  }
                  name={name}
                  isNew={isNew}
                  label={
                    <FormattedMessage
                      id="modules.Voyages.arrivalPort"
                      defaultMessage="ARRIVAL PORT"
                    />
                  }
                />
              )}
            </FormField>
          ) : (
            <FieldItem
              label={
                <Label>
                  <FormattedMessage
                    id="modules.Voyages.arrivalPort"
                    defaultMessage="ARRIVAL PORT"
                  />
                </Label>
              }
              tooltip={
                <FormTooltip
                  isNew={isNew}
                  infoMessage={
                    <FormattedMessage
                      id="modules.Shipments.tooltipArrivalPort"
                      defaultMessage={`You can select a transport type in the Shipment section under field labeled "TRANSPORTATION"`}
                    />
                  }
                />
              }
              input={
                <div className={SelectTransportTypeMessageStyle}>
                  <FormattedMessage
                    id="modules.Shipments.selectTransportType"
                    defaultMessage="Please select a transport type"
                  />
                </div>
              }
            />
          )}

          <FormField
            name={`${sourceName}.vesselName`}
            initValue={voyage.vesselName}
            setFieldValue={setFieldDeepValue}
          >
            {({ name, ...inputHandlers }) => (
              <TextAreaInputFactory
                {...inputHandlers}
                originalValue={initialVoyage.vesselName}
                name={name}
                isNew={isNew}
                label={
                  <FormattedMessage id="modules.Voyages.vesselName" defaultMessage="VESSEL NAME" />
                }
              />
            )}
          </FormField>

          <FormField
            name={`${sourceName}.vesselCode`}
            initValue={voyage.vesselCode}
            setFieldValue={setFieldDeepValue}
          >
            {({ name, ...inputHandlers }) => (
              <TextAreaInputFactory
                {...inputHandlers}
                originalValue={initialVoyage.vesselCode}
                name={name}
                isNew={isNew}
                label={
                  <FormattedMessage id="modules.Voyages.vesselCode" defaultMessage="VESSEL CODE" />
                }
              />
            )}
          </FormField>
        </GridColumn>
      </div>
    );
  }
}

export default VoyageInfoSection;
