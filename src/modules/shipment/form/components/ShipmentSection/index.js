// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { getByPath, getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import { encodeId } from 'utils/id';
import { getUniqueExporters } from 'utils/shipment';
import useUser from 'hooks/useUser';
import usePermission from 'hooks/usePermission';
import { STAFF_LIST } from 'modules/permission/constants/staff';
import {
  SHIPMENT_CREATE,
  SHIPMENT_UPDATE,
  SHIPMENT_SET_ARCHIVED,
  SHIPMENT_SET_IMPORTER,
  SHIPMENT_SET_EXPORTER,
  SHIPMENT_SET_IN_CHARGE,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_CUSTOM_FIELDS_MASK,
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_BOOKED,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_INCOTERM,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_MEMO,
  SHIPMENT_SET_PORT,
} from 'modules/permission/constants/shipment';
import MainSectionPlaceholder from 'components/PlaceHolder/MainSectionPlaceHolder';
import { CloneButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import { FormField } from 'modules/form';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
  ShipmentBatchesContainer,
  ShipmentTagsContainer,
  ShipmentTasksContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import SelectExporter from 'modules/order/common/SelectExporter';
import validator from 'modules/shipment/form/validator';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import {
  FieldItem,
  Label,
  FormTooltip,
  TagsInput,
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
  DashedPlusButton,
  ToggleInput,
} from 'components/Form';
import messages from 'modules/shipment/messages';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import { TAG_LIST } from 'modules/permission/constants/tag';
import SelectPartners from 'components/SelectPartners';
import SelectPartner from 'components/SelectPartner';
import ShipmentSummary from '../ShipmentSummary';
import { renderExporters, renderForwarders } from './helpers';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  DividerStyle,
  BookedInputWrapperStyle,
  BookedStyle,
} from './style';

type Props = {|
  isNew: boolean,
  isClone: boolean,
  shipment: Object,
  isLoading: boolean,
  initDataForSlideView: Object,
|};

const ShipmentSection = ({ isNew, isLoading, isClone, shipment, initDataForSlideView }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { isImporter, isForwarder, isExporter } = useUser();
  const { hasPermission } = usePermission(isOwner);
  const { id: shipmentId, updatedAt, updatedBy, archived } = shipment;
  return (
    <MainSectionPlaceholder height={1766} isLoading={isLoading}>
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
                  readOnly={!hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_ARCHIVED])}
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
          const { forwarders = [], importer, exporter } = values;

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
                  <Subscribe to={[ShipmentTasksContainer]}>
                    {taskContainer => (
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
                            onBlur={evt => {
                              inputHandlers.onBlur(evt);
                              emitter.emit('AUTO_DATE', name, inputHandlers.value);
                              if (!taskContainer.state.hasCalledTasksApiYet) {
                                taskContainer.waitForTasksSectionReady(name, inputHandlers.value);
                              }
                            }}
                            editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BL_DATE])}
                            name={name}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.blDate} />}
                          />
                        )}
                      </FormField>
                    )}
                  </Subscribe>
                  <FormField
                    name="bookingNo"
                    initValue={values.bookingNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...{
                          ...inputHandlers,
                          onBlur: evt => {
                            inputHandlers.onBlur(evt);
                            setFieldValue(name, inputHandlers.value);
                            if (
                              isNullOrUndefined(initialValues[name]) &&
                              inputHandlers.value !== ''
                            ) {
                              setFieldValue('booked', true);
                            }
                          },
                        }}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BOOKING_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.bookingNo} />}
                      />
                    )}
                  </FormField>
                  <div className={BookedInputWrapperStyle}>
                    <ToggleInput
                      name="booked"
                      toggled={values.booked}
                      onToggle={() => {
                        setFieldValue('booked', !values.booked);
                      }}
                      editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BOOKED])}
                    >
                      {values.booked ? (
                        <div className={BookedStyle(true)}>
                          <FormattedMessage id="modules.Shipments.booked" defaultMessage="Booked" />
                        </div>
                      ) : (
                        <div className={BookedStyle(false)}>
                          <FormattedMessage
                            id="modules.Shipments.unbooked"
                            defaultMessage="Unbooked"
                          />
                        </div>
                      )}
                    </ToggleInput>
                  </div>
                  <Subscribe to={[ShipmentTasksContainer]}>
                    {taskContainer => (
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
                            onBlur={evt => {
                              inputHandlers.onBlur(evt);
                              emitter.emit('AUTO_DATE', name, inputHandlers.value);
                              if (!taskContainer.state.hasCalledTasksApiYet) {
                                taskContainer.waitForTasksSectionReady(name, inputHandlers.value);
                              }
                            }}
                            editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_BOOKING_DATE])}
                            name={name}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.bookingDate} />}
                          />
                        )}
                      </FormField>
                    )}
                  </Subscribe>
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
                  <FormField
                    name="contractNo"
                    initValue={values.contractNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_CONTRACT_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.contractNo} />}
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
                          saveOnChange
                        >
                          {({ name, ...inputHandlers }) => (
                            <EnumSelectInputFactory
                              {...inputHandlers}
                              editable={
                                hasPermission(SHIPMENT_UPDATE) ||
                                (hasPermission(SHIPMENT_SET_TRANSPORT_TYPE) &&
                                  hasPermission(SHIPMENT_SET_PORT))
                              }
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
                    saveOnChange
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
                    editable={{
                      values: hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_CUSTOM_FIELDS]),
                      mask: hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_CUSTOM_FIELDS_MASK]),
                    }}
                  />

                  <Subscribe to={[ShipmentTagsContainer]}>
                    {({ state: { tags }, setFieldValue: changeTags }) => (
                      <FieldItem
                        vertical
                        label={
                          <Label height="30px">
                            <FormattedMessage {...messages.tags} />
                          </Label>
                        }
                        input={
                          <TagsInput
                            id="tags"
                            name="tags"
                            tagType="Shipment"
                            values={tags}
                            onChange={(field, value) => {
                              changeTags(field, value);
                            }}
                            editable={{
                              set:
                                hasPermission(TAG_LIST) &&
                                hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TAGS]),
                              remove: hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TAGS]),
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
                    cacheKey="ShipmentUserSelect"
                    name="inCharges"
                    groupIds={[
                      getByPath('importer.id', values),
                      getByPath('exporter.id', values),
                    ].filter(Boolean)}
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
                    editable={
                      hasPermission(STAFF_LIST) &&
                      hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_IN_CHARGE])
                    }
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
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Shipments.tooltipImporter"
                            defaultMessage="The Importer will have access to this Shipment"
                          />
                        }
                      />
                    }
                    input={
                      <>
                        {(isForwarder() || isExporter()) &&
                        // Disable to changed importer if there is data send from RM
                        // base on initDataForSlideView
                        (isNew &&
                          Object.keys(initDataForSlideView).length === 0 &&
                          hasPermission(PARTNER_LIST) &&
                          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_IMPORTER])) ? (
                          <BooleanValue>
                            {({ value: importerSelectorIsOpen, set: importerSelectorToggle }) => (
                              <>
                                {importer && importer.id ? (
                                  <PartnerCard
                                    partner={importer}
                                    onClick={() => importerSelectorToggle(true)}
                                  />
                                ) : (
                                  <DashedPlusButton
                                    width="195px"
                                    height="215px"
                                    onClick={() => importerSelectorToggle(true)}
                                  />
                                )}
                                <SlideView
                                  isOpen={importerSelectorIsOpen}
                                  onRequestClose={() => importerSelectorToggle(false)}
                                >
                                  {importerSelectorIsOpen && (
                                    <>
                                      {isExporter() ? (
                                        <BooleanValue>
                                          {({
                                            value: importerDialogIsOpen,
                                            set: importerDialogToggle,
                                          }) => (
                                            <ObjectValue defaultValue={values.importer}>
                                              {({
                                                value: selectedImporter,
                                                set: setSelectedImporter,
                                              }) => (
                                                <>
                                                  <SelectPartner
                                                    cacheKey="ShipmentSelectImporter"
                                                    partnerTypes={['Importer']}
                                                    selected={values.importer}
                                                    onCancel={() => importerSelectorToggle(false)}
                                                    onSelect={selected => {
                                                      if (selectedImporter) {
                                                        setSelectedImporter(selected);
                                                        importerDialogToggle(true);
                                                      } else {
                                                        setFieldValue('importer', selected);
                                                        importerSelectorToggle(false);
                                                      }
                                                    }}
                                                  />
                                                  <Subscribe
                                                    to={[
                                                      ShipmentBatchesContainer,
                                                      ShipmentTasksContainer,
                                                      ShipmentTimelineContainer,
                                                      ShipmentContainersContainer,
                                                    ]}
                                                  >
                                                    {(
                                                      batchContainer,
                                                      taskContainer,
                                                      timelineContainer,
                                                      containersContainer
                                                    ) => (
                                                      <ConfirmDialog
                                                        isOpen={importerDialogIsOpen}
                                                        onRequestClose={() => {
                                                          importerDialogToggle(false);
                                                        }}
                                                        onCancel={() => {
                                                          importerDialogToggle(false);
                                                        }}
                                                        onConfirm={() => {
                                                          importerDialogToggle(false);
                                                          importerSelectorToggle(false);
                                                          setFieldValue(
                                                            'inCharges',
                                                            values.inCharges.filter(
                                                              user =>
                                                                getByPath('group.id', user) !==
                                                                getByPath('id', importer)
                                                            )
                                                          );
                                                          setFieldValue(
                                                            'importer',
                                                            selectedImporter
                                                          );
                                                          batchContainer.waitForBatchesSectionReadyThenInitDetailValues(
                                                            []
                                                          );
                                                          taskContainer.waitForTasksSectionReadyThenChangePartner(
                                                            importer
                                                          );
                                                          timelineContainer.waitForTimelineSectionReadyThenChangePartner(
                                                            importer
                                                          );
                                                          containersContainer.waitForContainerSectionReadyThenChangePartner(
                                                            importer
                                                          );
                                                        }}
                                                        message={
                                                          <FormattedMessage
                                                            id="modules.Shipment.importerDialogMessage"
                                                            defaultMessage="Changing the Importer will remove all Batches. It will also remove all assigned Staff of the current Importer from all Tasks, In Charge, Timeline Assignments, and Container Dates Assignments. Are you sure you want to change the Importer?"
                                                          />
                                                        }
                                                      />
                                                    )}
                                                  </Subscribe>
                                                </>
                                              )}
                                            </ObjectValue>
                                          )}
                                        </BooleanValue>
                                      ) : (
                                        <SelectPartner
                                          cacheKey="ShipmentSelectImporter"
                                          partnerTypes={['Importer']}
                                          selected={values.importer}
                                          onCancel={() => importerSelectorToggle(false)}
                                          onSelect={selected => {
                                            setFieldValue('importer', selected);
                                            importerSelectorToggle(false);
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                        ) : (
                          <PartnerCard partner={importer} readOnly />
                        )}
                      </>
                    }
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.Shipments.mainExporter"
                          defaultMessage="MAIN EXPORTER"
                        />
                      </Label>
                    }
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Shipments.tooltipMainExporter"
                            defaultMessage="The Exporter chosen here will have access to this Shipment"
                          />
                        }
                      />
                    }
                    input={
                      <>
                        {(isForwarder() || isImporter()) &&
                        (hasPermission(PARTNER_LIST) &&
                          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_EXPORTER])) ? (
                          <BooleanValue>
                            {({ value: exporterSelectorIsOpen, set: exporterSelectorToggle }) => (
                              <>
                                {exporter && exporter.id ? (
                                  <PartnerCard
                                    partner={exporter}
                                    onClick={() => exporterSelectorToggle(true)}
                                  />
                                ) : (
                                  <DashedPlusButton
                                    width="195px"
                                    height="215px"
                                    onClick={() => exporterSelectorToggle(true)}
                                  />
                                )}
                                <SlideView
                                  isOpen={exporterSelectorIsOpen}
                                  onRequestClose={() => exporterSelectorToggle(false)}
                                >
                                  {exporterSelectorIsOpen && (
                                    <Subscribe
                                      to={[
                                        ShipmentTasksContainer,
                                        ShipmentTimelineContainer,
                                        ShipmentContainersContainer,
                                        ShipmentBatchesContainer,
                                      ]}
                                    >
                                      {(
                                        taskContainer,
                                        timelineContainer,
                                        containersContainer,
                                        batchesContainer
                                      ) => (
                                        <SelectExporter
                                          cacheKey="ShipmentSelectExporter"
                                          selected={values.exporter}
                                          onCancel={() => exporterSelectorToggle(false)}
                                          selectMessage={
                                            <FormattedMessage
                                              id="modules.Shipment.mainExporterSelectMessage"
                                              defaultMessage="Selecting a Main Exporter will allow them access to this Shipment. However, it will mean only Batches of the Main Exporter can be used in this Shipment. All Batches that are currently in this Shipment that do not belong to this Main Exporter will be removed. Are you sure you want to select a Main Exporter?"
                                            />
                                          }
                                          changeMessage={
                                            <FormattedMessage
                                              id="modules.Shipment.mainExporterChangeMessage"
                                              defaultMessage="Changing the Main Exporter will remove all Batches of the current Main Exporter and all assigned Staff of the current Main Exporter from all Tasks, In Charge, Timeline Assignments, and Container Dates Assignments. Are you sure you want to change the Main Exporter?"
                                            />
                                          }
                                          warningMessage={
                                            <FormattedMessage
                                              id="modules.Shipment.mainExporterDeselectMessage"
                                              defaultMessage="Changing the Main Exporter will remove all assigned Staff of the current Main Exporter from all Tasks, In Charge, Timeline Assignments, and Container Dates Assignments. Are you sure you want to change the Main Exporter?"
                                            />
                                          }
                                          onSelect={selectedExporter => {
                                            exporterSelectorToggle(false);
                                            setFieldValue(
                                              'inCharges',
                                              values.inCharges.filter(
                                                user =>
                                                  getByPath('group.id', user) !==
                                                  getByPath('id', exporter)
                                              )
                                            );
                                            setFieldValue('exporter', selectedExporter);
                                            batchesContainer.waitForBatchesSectionReadyThenChangeMainExporter(
                                              selectedExporter
                                            );
                                            containersContainer.waitForContainerSectionReadyThenChangeMainExporter(
                                              selectedExporter
                                            );
                                            if (exporter) {
                                              taskContainer.waitForTasksSectionReadyThenChangePartner(
                                                exporter
                                              );

                                              timelineContainer.waitForTimelineSectionReadyThenChangePartner(
                                                exporter
                                              );

                                              containersContainer.waitForContainerSectionReadyThenChangePartner(
                                                exporter
                                              );
                                            }
                                          }}
                                        />
                                      )}
                                    </Subscribe>
                                  )}
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                        ) : (
                          <PartnerCard partner={exporter} readOnly />
                        )}
                      </>
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
                                isImporter() &&
                                hasPermission(PARTNER_LIST) &&
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
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              {opened && (
                                <SelectPartners
                                  cacheKey="ShipmentSelectForwarders"
                                  partnerTypes={['Forwarder']}
                                  selected={getByPathWithDefault([], 'forwarders', values)}
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
                                  id="modules.Shipments.relatedExporters"
                                  defaultMessage="RELATED EXPORTERS"
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

              <ShipmentSummary
                isLoading={isLoading}
                isNewOrClone={isNew || isClone}
                entityId={!isClone && shipment.id ? shipment.id : ''}
              />
            </div>
          );
        }}
      </Subscribe>
    </MainSectionPlaceholder>
  );
};

export default ShipmentSection;
