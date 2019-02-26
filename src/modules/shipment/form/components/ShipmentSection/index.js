// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_CREATE,
  SHIPMENT_UPDATE,
  SHIPMENT_SET_IMPORTER,
  SHIPMENT_SET_IN_CHARGE,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_INCOTERM,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_MEMO,
} from 'modules/permission/constants/shipment';
import { CloneButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import { FormField } from 'modules/form';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
  ShipmentBatchesContainer,
  ShipmentTagsContainer,
} from 'modules/shipment/form/containers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import validator from 'modules/shipment/form/validator';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import { UserConsumer } from 'modules/user';
import {
  FieldItem,
  Label,
  FormTooltip,
  TagsInput,
  SectionWrapper,
  SectionHeader,
  LastModified,
  StatusToggle,
  TextInputFactory,
  DateInputFactory,
  EnumSelectInputFactory,
  EnumSearchSelectInputFactory,
  TextAreaInputFactory,
  CustomFieldsFactory,
  UserAssignmentInputFactory,
} from 'components/Form';
import messages from 'modules/shipment/messages';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';
import SelectForwarders from '../SelectForwarders';
import { getUniqueExporters, renderExporters, renderForwarders } from './helpers';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
  isClone: boolean,
  shipment: Object,
};

const ShipmentSection = ({ isNew, isClone, shipment }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { id: shipmentId, updatedAt, updatedBy, archived } = shipment;
  const allowToUpdate = hasPermission(SHIPMENT_UPDATE);
  const allowSetImporter = hasPermission(SHIPMENT_SET_IMPORTER);
  return (
    <SectionWrapper id="shipment_shipmentSection">
      <SectionHeader
        icon="SHIPMENT"
        title={<FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />}
      >
        {!isNew && (
          <>
            <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
            {!isClone && hasPermission(SHIPMENT_CREATE) && (
              <CloneButton onClick={() => navigate(`/shipment/clone/${encodeId(shipmentId)}`)} />
            )}
            <BooleanValue>
              {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                <StatusToggle
                  readOnly={!allowToUpdate}
                  archived={archived}
                  openStatusDialog={() => dialogToggle(true)}
                  activateDialog={
                    <ShipmentActivateDialog
                      shipment={shipment}
                      isOpen={statusDialogIsOpen && !!archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                  archiveDialog={
                    <ShipmentArchiveDialog
                      shipment={shipment}
                      isOpen={statusDialogIsOpen && !archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                />
              )}
            </BooleanValue>
          </>
        )}
      </SectionHeader>
      <Subscribe to={[ShipmentInfoContainer]}>
        {({ originalValues: initialValues, state, setFieldValue }) => {
          const values: Object = { ...initialValues, ...state };
          const { forwarders = [], importer } = values;

          return (
            <div className={ShipmentSectionWrapperStyle}>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
                  <FormField
                    name="no"
                    initValue={values.no}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_NO])}
                        name={name}
                        isNew={isNew}
                        required
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.shipmentId} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="blNo"
                    initValue={values.blNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BL_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.blNo} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="blDate"
                    initValue={values.blDate}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <DateInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BL_DATE])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.blDate} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="bookingNo"
                    initValue={values.bookingNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BOOKING_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.bookingNo} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="bookingDate"
                    initValue={values.bookingDate}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <DateInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BOOKING_DATE])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.bookingDate} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="invoiceNo"
                    initValue={values.invoiceNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_INVOICE_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.invoiceNo} />}
                      />
                    )}
                  </FormField>
                  <Subscribe to={[ShipmentTransportTypeContainer, ShipmentTimelineContainer]}>
                    {(
                      {
                        originalValues: initialTransportTypeValues,
                        state: transportTypeState,
                        setFieldValue: transportTypeSetFieldValue,
                      },
                      { cleanDataAfterChangeTransport }
                    ) => {
                      const transportTypeValues = {
                        ...initialTransportTypeValues,
                        ...transportTypeState,
                      };

                      return (
                        <FormField
                          name="transportType"
                          initValue={transportTypeValues.transportType}
                          setFieldValue={(field, newValue) => {
                            transportTypeSetFieldValue(field, newValue);
                            if (transportTypeValues.transportType !== newValue)
                              cleanDataAfterChangeTransport();
                          }}
                          values={transportTypeValues}
                          validator={validator}
                        >
                          {({ name, ...inputHandlers }) => (
                            <EnumSelectInputFactory
                              {...inputHandlers}
                              editable={hasPermission([
                                SHIPMENT_UPDATE,
                                SHIPMENT_SET_TRANSPORT_TYPE,
                              ])}
                              enumType="TransportType"
                              name={name}
                              isNew={isNew}
                              originalValue={initialTransportTypeValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.transportation"
                                  defaultMessage="TRANSPORTATION"
                                />
                              }
                            />
                          )}
                        </FormField>
                      );
                    }}
                  </Subscribe>
                  <FormField
                    name="loadType"
                    initValue={values.loadType}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSelectInputFactory
                        {...inputHandlers}
                        enumType="LoadType"
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_LOAD_TYPE])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.Shipments.loadType"
                            defaultMessage="LOAD TYPE"
                          />
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="incoterm"
                    initValue={values.incoterm}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSearchSelectInputFactory
                        {...inputHandlers}
                        enumType="Incoterm"
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_INCOTERM])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.Shipments.incoterms"
                            defaultMessage="INCOTERMS"
                          />
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="carrier"
                    initValue={values.carrier}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        name={name}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_CARRIER])}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.carrier} />}
                      />
                    )}
                  </FormField>

                  <CustomFieldsFactory
                    entityType="Shipment"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_CUSTOM_FIELDS])}
                  />

                  <Subscribe to={[ShipmentTagsContainer]}>
                    {({ state: { tags }, setFieldValue: changeTags }) => (
                      <FieldItem
                        vertical
                        label={
                          <Label>
                            <FormattedMessage {...messages.tags} />
                          </Label>
                        }
                        input={
                          <TagsInput
                            editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TAGS])}
                            id="tags"
                            name="tags"
                            tagType="Shipment"
                            values={tags}
                            onChange={(field, value) => {
                              changeTags(field, value);
                            }}
                          />
                        }
                      />
                    )}
                  </Subscribe>

                  <FormField
                    name="memo"
                    initValue={values.memo}
                    values={values}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextAreaInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_MEMO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.memo} />}
                        inputWidth="400px"
                        inputHeight="120px"
                      />
                    )}
                  </FormField>
                </GridColumn>

                <GridColumn>
                  <UserAssignmentInputFactory
                    name="inCharges"
                    values={values.inCharges}
                    onChange={(name: string, assignments: Array<Object>) =>
                      setFieldValue(name, assignments)
                    }
                    label={
                      <>
                        <FormattedMessage
                          id="modules.Shipments.inCharge"
                          defaultMessage="IN CHARGE"
                        />
                        {' ('}
                        <FormattedNumber value={values.inCharges.length} />
                        {')'}
                      </>
                    }
                    infoMessage={
                      <FormattedMessage
                        id="modules.Shipments.tooltipInCharge"
                        defaultMessage="You can choose up to 5 people in charge."
                      />
                    }
                    editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_IN_CHARGE])}
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label required>
                        <FormattedMessage
                          id="modules.Shipments.importer"
                          defaultMessage="IMPORTER"
                        />
                      </Label>
                    }
                    input={
                      <UserConsumer>
                        {({ user }) => {
                          const { group } = user;
                          const { types = [] } = group;
                          if (types.includes('Importer')) {
                            if (isNew) {
                              return <PartnerCard partner={group} readOnly />;
                            }
                            return <PartnerCard partner={importer} readOnly />;
                          }
                          if (types.includes('Forwarder') && allowSetImporter) {
                            return 'Forwarder logic';
                          }
                          return 'TODO';
                        }}
                      </UserConsumer>
                    }
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.Shipments.forwarder"
                          defaultMessage="FORWARDER"
                        />
                        {' ('}
                        <FormattedNumber value={forwarders.length} />
                        {')'}
                      </Label>
                    }
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Shipments.tooltipForwarder"
                            defaultMessage="You can choose up to 4 Forwarders."
                          />
                        }
                      />
                    }
                    input={
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) => (
                          <>
                            <div
                              onClick={() =>
                                hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_FORWARDERS])
                                  ? slideToggle(true)
                                  : () => {}
                              }
                              role="presentation"
                            >
                              {renderForwarders(
                                forwarders,
                                hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_FORWARDERS])
                              )}
                            </div>
                            <SlideView
                              isOpen={opened}
                              onRequestClose={() => slideToggle(false)}
                              options={{ width: '1030px' }}
                            >
                              {opened && (
                                <SelectForwarders
                                  selected={values.forwarders}
                                  onCancel={() => slideToggle(false)}
                                  onSelect={selected => {
                                    slideToggle(false);
                                    setFieldValue('forwarders', selected);
                                  }}
                                />
                              )}
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    }
                  />

                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ state: { batches } }) => {
                      const uniqueExporters = getUniqueExporters(batches);
                      return (
                        <FieldItem
                          vertical
                          label={
                            <div className={ExporterLabelStyle}>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.exporter"
                                  defaultMessage="EXPORTER"
                                />
                                {' ('}
                                <FormattedNumber value={uniqueExporters.length} />
                                {')'}
                              </Label>
                              {uniqueExporters.length > 4 && (
                                <button
                                  className={ExporterSeeMoreButtonStyle}
                                  type="button"
                                  onClick={() => {}}
                                >
                                  <Icon icon="HORIZONTAL_ELLIPSIS" />
                                </button>
                              )}
                            </div>
                          }
                          tooltip={
                            <FormTooltip
                              infoMessage={
                                <FormattedMessage
                                  id="modules.Shipments.tooltipExporter"
                                  defaultMessage="Exporters are automatically shown based off of the Batches chosen for the Cargo of this Shipment."
                                />
                              }
                            />
                          }
                          input={renderExporters(uniqueExporters)}
                        />
                      );
                    }}
                  </Subscribe>
                </GridColumn>
              </div>

              <div className={DividerStyle} />
            </div>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
};

export default ShipmentSection;
