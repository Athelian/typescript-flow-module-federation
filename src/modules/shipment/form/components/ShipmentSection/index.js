// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  dateInputFactory,
  selectEnumInputFactory,
  textAreaFactory,
} from 'modules/form/helpers';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
  ShipmentBatchesContainer,
  ShipmentTagsContainer,
} from 'modules/shipment/form/containers';
import validator from 'modules/shipment/form/validator';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Tooltip, TagsInput } from 'components/Form';
import messages from 'modules/shipment/messages';
import AssignUsers from 'modules/shipment/form/components/TimelineSection/components/AssignUsers';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';
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
};

const ShipmentSection = ({ isNew }: Props) => (
  <Subscribe to={[ShipmentInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values: Object = { ...initialValues, ...state };
      const { forwarders = [] } = values;

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
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    required: true,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.shipmentId} />,
                  })
                }
              </FormField>
              <FormField
                name="blNo"
                initValue={values.blNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.blNo} />,
                  })
                }
              </FormField>
              <FormField
                name="blDate"
                initValue={values.blDate}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  dateInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.blDate} />,
                  })
                }
              </FormField>
              <FormField
                name="bookingNo"
                initValue={values.bookingNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.bookingNo} />,
                  })
                }
              </FormField>
              <FormField
                name="bookingDate"
                initValue={values.bookingDate}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  dateInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.bookingDate} />,
                  })
                }
              </FormField>
              <FormField
                name="invoiceNo"
                initValue={values.invoiceNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.invoiceNo} />,
                  })
                }
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
                      values={values}
                      validator={validator}
                      saveOnChange
                    >
                      {({ name, ...inputHandlers }) =>
                        selectEnumInputFactory({
                          enumType: 'TransportType',
                          align: 'right',
                          label: (
                            <FormattedMessage
                              id="modules.Shipments.transportation"
                              defaultMessage="TRANSPORTATION"
                            />
                          ),
                          originalValue: transportTypeValues[name],
                          inputHandlers,
                          name,
                          isNew,
                        })
                      }
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
                saveOnChange
              >
                {({ name, ...inputHandlers }) =>
                  selectEnumInputFactory({
                    enumType: 'LoadType',
                    align: 'right',
                    label: (
                      <FormattedMessage
                        id="modules.Shipments.loadType"
                        defaultMessage="LOAD TYPE"
                      />
                    ),
                    originalValue: initialValues[name],
                    inputHandlers,
                    name,
                    isNew,
                  })
                }
              </FormField>
              <FormField
                name="incoterm"
                initValue={values.incoterm}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
                saveOnChange
              >
                {({ name, ...inputHandlers }) =>
                  selectEnumInputFactory({
                    enumType: 'Incoterm',
                    align: 'right',
                    label: (
                      <FormattedMessage
                        id="modules.Shipments.incoterms"
                        defaultMessage="INCOTERMS"
                      />
                    ),
                    originalValue: initialValues[name],
                    inputHandlers,
                    name,
                    isNew,
                  })
                }
              </FormField>
              <FormField
                name="carrier"
                initValue={values.carrier}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    originalValue: initialValues[name],
                    label: <FormattedMessage {...messages.carrier} />,
                  })
                }
              </FormField>
            </GridColumn>

            <GridColumn>
              <GridColumn gap="10px">
                <FieldItem
                  label={
                    <Label>
                      <FormattedMessage
                        id="modules.Shipments.inCharge"
                        defaultMessage="IN CHARGE "
                      />
                      ({values.inCharges.length})
                    </Label>
                  }
                  tooltip={
                    <Tooltip
                      infoMessage={
                        <FormattedMessage
                          id="modules.Shipments.tooltipInCharge"
                          defaultMessage="You can choose up to 5 people in charge."
                        />
                      }
                    />
                  }
                />
                <div className={AssignmentWrapperStyle}>
                  {values &&
                    values.inCharges &&
                    values.inCharges.map(({ id, firstName, lastName }) => (
                      <div className={AssignmentStyle} key={id}>
                        <button
                          className={RemoveAssignmentButtonStyle}
                          onClick={() =>
                            setFieldValue(
                              'inCharges',
                              values.inCharges.filter(({ id: userId }) => id !== userId)
                            )
                          }
                          type="button"
                        >
                          <Icon icon="REMOVE" />
                        </button>
                        <UserAvatar firstName={firstName} lastName={lastName} />
                      </div>
                    ))}
                  {((values && !values.inCharges) ||
                    (values && values.inCharges && values.inCharges.length < 5)) && (
                    <BooleanValue>
                      {({ value: isOpen, set: slideToggle }) => (
                        <>
                          <button
                            className={AddAssignmentButtonStyle}
                            type="button"
                            onClick={() => slideToggle(true)}
                          >
                            <Icon icon="ADD" />
                          </button>
                          <SlideView
                            isOpen={isOpen}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {isOpen && (
                              <AssignUsers
                                selected={values.inCharges}
                                onSelect={selected => {
                                  slideToggle(false);
                                  setFieldValue('inCharges', selected);
                                }}
                                onCancel={() => slideToggle(false)}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
                </div>
                <FieldItem
                  label={
                    <Label>
                      <FormattedMessage
                        id="modules.Shipments.canChooseUp5People"
                        defaultMessage="FORWARDER "
                      />
                      ({forwarders.length})
                    </Label>
                  }
                  tooltip={
                    <Tooltip
                      infoMessage={
                        <FormattedMessage
                          id="modules.Shipments.tooltipForwarder"
                          defaultMessage="You can choose up to 4 Forwarders."
                        />
                      }
                    />
                  }
                />
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      <div onClick={() => slideToggle(true)} role="presentation">
                        {renderForwarders(forwarders)}
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
              </GridColumn>
              <Subscribe to={[ShipmentBatchesContainer]}>
                {({ state: { batches } }) => {
                  const uniqueExporters = getUniqueExporters(batches);
                  return (
                    <GridColumn gap="10px">
                      <FieldItem
                        label={
                          <div className={ExporterLabelStyle}>
                            <Label>
                              <FormattedMessage
                                id="modules.Shipments.exporter"
                                defaultMessage="EXPORTER"
                              />
                              ({uniqueExporters.length})
                            </Label>
                            {uniqueExporters.length > 4 && (
                              <button
                                className={ExporterSeeMoreButtonStyle}
                                type="button"
                                onClick={console.log('Show full list of exporters')}
                              >
                                <Icon icon="HORIZONTAL_ELLIPSIS" />
                              </button>
                            )}
                          </div>
                        }
                        tooltip={
                          <Tooltip
                            infoMessage={
                              <FormattedMessage
                                id="modules.Shipments.tooltipExporter"
                                defaultMessage="Exporters are automatically shown based off of the Batches chosen for the Cargo of this Shipment."
                              />
                            }
                          />
                        }
                      />
                      {renderExporters(uniqueExporters)}
                    </GridColumn>
                  );
                }}
              </Subscribe>
            </GridColumn>
          </div>
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
                    editable={isNew}
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
            {({ name, ...inputHandlers }) =>
              textAreaFactory({
                name,
                inputHandlers,
                isNew,
                originalValue: initialValues[name],
                label: <FormattedMessage {...messages.memo} />,
                vertical: true,
                width: '680px',
                height: '65px',
              })
            }
          </FormField>

          <div className={DividerStyle} />
        </div>
      );
    }}
  </Subscribe>
);

export default ShipmentSection;
