// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_PORT,
  SHIPMENT_SET_VOYAGE_NO,
  SHIPMENT_SET_VESSEL_NAME,
  SHIPMENT_SET_VESSEL_CODE,
} from 'modules/permission/constants/shipment';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import { SectionHeader, Label, FieldItem, FormTooltip, TextInputFactory } from 'components/Form';
import PortSelect from '../PortSelect';
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
    no: string,
    vesselCode: string,
    vesselName: string,
  },
  initialVoyage: {
    no: string,
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
  voyage: {
    vesselCode: '',
    vesselName: '',
  },
  initialVoyage: {
    vesselCode: '',
    vesselName: '',
  },
};

const PortSearchSelectInputFactory = ({
  name,
  label,
  required,
  isNew,
  isTouched,
  errorMessage,
  originalValue,
  value,
  readOnly,
  onChange,
  transportType,
}: {|
  name: string,
  transportType: string,
  label: React$Node,
  errorMessage: React$Node,
  required: boolean,
  isTouched: boolean,
  isNew: boolean,
  originalValue: any,
  value: any,
  readOnly: boolean,
  onChange: Function,
|}) => {
  const parsedValue = transportType === 'Sea' ? { seaport: value } : { airport: value };
  return (
    <FieldItem
      label={
        <Label required={required} width="210px" height="30px">
          {label}
        </Label>
      }
      tooltip={
        <FormTooltip
          isNew={isNew}
          errorMessage={isTouched && errorMessage}
          changedValues={{
            oldValue: originalValue,
            newValue: value,
          }}
        />
      }
      input={
        <PortSelect
          name={name}
          type={transportType}
          onChange={selectedValue =>
            onChange({
              target: {
                name,
                value: selectedValue?.airport || selectedValue?.seaport,
              },
            })
          }
          readonly={readOnly}
          value={parsedValue}
        />
      }
    />
  );
};

const VoyageInfoSection = ({
  isNew,
  icon,
  title,
  voyage,
  initialVoyage,
  sourceName,
  setFieldDeepValue,
  ...rest
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canSelectPorts = icon === 'SHIPMENT' || icon === 'PLANE';
  const deepField = icon === 'SHIPMENT' ? 'seaport' : 'airport';
  const transportType = icon === 'SHIPMENT' ? 'Sea' : 'Air';

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
            saveOnChange
            values={voyage}
          >
            {({ name, ...inputHandlers }) => (
              <PortSearchSelectInputFactory
                {...inputHandlers}
                transportType={transportType}
                readOnly={!hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_PORT])}
                originalValue={initialVoyage?.departurePort?.[deepField]}
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
            initValue={voyage?.arrivalPort?.[deepField]}
            setFieldValue={setFieldDeepValue}
            values={voyage}
            saveOnChange
          >
            {({ name, ...inputHandlers }) => (
              <PortSearchSelectInputFactory
                {...inputHandlers}
                transportType={transportType}
                readOnly={!hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_PORT])}
                originalValue={initialVoyage?.arrivalPort?.[deepField]}
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
                <FormattedMessage id="modules.Voyages.arrivalPort" defaultMessage="ARRIVAL PORT" />
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
          name={`${sourceName}.no`}
          initValue={voyage.no}
          setFieldValue={setFieldDeepValue}
        >
          {({ name, ...inputHandlers }) => (
            <TextInputFactory
              {...inputHandlers}
              editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_VOYAGE_NO])}
              originalValue={initialVoyage.no}
              name={name}
              isNew={isNew}
              label={<FormattedMessage id="modules.Voyages.voyageNo" defaultMessage="VESSEL NO" />}
            />
          )}
        </FormField>

        <FormField
          name={`${sourceName}.vesselName`}
          initValue={voyage.vesselName}
          setFieldValue={setFieldDeepValue}
        >
          {({ name, ...inputHandlers }) => (
            <TextInputFactory
              {...inputHandlers}
              editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_VESSEL_NAME])}
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
            <TextInputFactory
              {...inputHandlers}
              editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_VESSEL_CODE])}
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
};

VoyageInfoSection.defaultProps = defaultProps;

export default VoyageInfoSection;
