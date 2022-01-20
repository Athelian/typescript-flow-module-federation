// @flow
import * as React from 'react';
import { useState } from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue, ArrayValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { isNullOrUndefined } from 'utils/fp';
import { encodeId } from 'utils/id';
import { getEntityRelatedOrganizations } from 'utils/entity';
import { getUniqueExporters } from 'utils/shipment';
import useUser from 'hooks/useUser';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_CREATE,
  SHIPMENT_EDIT,
  SHIPMENT_SET_FOLLOWERS,
  SHIPMENT_ARCHIVE,
  SHIPMENT_SET_IMPORTER,
  SHIPMENT_SET_EXPORTER,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_CUSTOM_FIELDS_MASK,
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_HOUSE_BL_NO,
  SHIPMENT_SET_MASTER_BL_NO,
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
} from 'modules/shipment/form/containers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import SelectExporter from 'modules/order/common/SelectExporter';
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
  StatusToggle,
  TextInputFactory,
  DateInputFactory,
  SelectInputFactory,
  EnumSelectInputFactory,
  EnumSearchSelectInputFactory,
  TextAreaInputFactory,
  CustomFieldsFactory,
  DashedPlusButton,
  ToggleInput,
} from 'components/Form';
import messages from 'modules/shipment/messages';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { NAVIGATION_NETWORK_PARTNERS } from 'modules/permission/constants/navigation';
import { TAG_GET } from 'modules/permission/constants/tag';
import SelectPartners from 'components/SelectPartners';
import SelectPartner from 'components/SelectPartner';
import Followers from 'components/Followers';
import ShipmentSummary from '../ShipmentSummary';
import { getValidationByAutoTracking } from '../../validator';
import { renderExporters, renderForwarders, renderPartners } from './helpers';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  DividerStyle,
  BookedInputWrapperStyle,
  BookedStyle,
  ContainerTrackingWrapperStyle,
  ContainerAutoTrackingContainerStyle,
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
  const { isImporter, organization: userOrganization, isForwarder, isExporter } = useUser();
  const { hasPermission } = usePermission(isOwner);
  const { id: shipmentId, archived } = shipment;
  // Remember what the user selected before enabling autoTracking, should they wish to revert to it
  const [transportTypeTempState, setTransportTypeTempState] = useState('');
  const [carrierTempState, setCarrierTempState] = useState('');
  const [autoTrackingByTempState, setAutoTrackingByTempState] = useState('');

  return (
    <Subscribe
      to={[ShipmentInfoContainer, ShipmentTransportTypeContainer, ShipmentTimelineContainer]}
    >
      {(
        {
          originalValues: initialValues,
          state,
          setFieldValue,
          onChangePartner,
          onChangePartners,
          onChangeForwarders,
        },
        {
          originalValues: initialTransportTypeValues,
          state: transportTypeState,
          setFieldValue: transportTypeSetFieldValue,
        },
        { cleanDataAfterChangeTransport }
      ) => {
        const values: Object = { ...initialValues, ...state };
        const transportTypeValues = {
          ...initialTransportTypeValues,
          ...transportTypeState,
        };
        const { forwarders = [], importer, exporter, organizations } = values;
        const { autoTrackingBy } = values;
        const validation = getValidationByAutoTracking({ autoTrackingBy });

        const autoTrackingConcernees = [
          <React.Fragment key="transportType">
            <FormField
              name="transportType"
              initValue={transportTypeValues.transportType}
              setFieldValue={(field, newValue) => {
                transportTypeSetFieldValue(field, newValue);
                if (transportTypeValues.transportType !== newValue) cleanDataAfterChangeTransport();
              }}
              values={transportTypeValues}
              validator={validation}
              saveOnChange
            >
              {({ name, ...inputHandlers }) => (
                <EnumSelectInputFactory
                  {...inputHandlers}
                  allowedValues={values.autoTracking ? ['Sea'] : undefined} // To remove later, see ZEN-1691 (only allow "Sea" 'for now')
                  editable={
                    hasPermission(SHIPMENT_EDIT) ||
                    (hasPermission(SHIPMENT_SET_TRANSPORT_TYPE) && hasPermission(SHIPMENT_SET_PORT))
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
                  labelWidth={values.autoTracking ? '145px' : ''}
                  required={values.autoTracking}
                />
              )}
            </FormField>
          </React.Fragment>,
          <React.Fragment key="carrierType">
            <FormField
              name="carrier"
              initValue={values.carrier}
              setFieldValue={setFieldValue}
              values={values}
              validator={validation}
            >
              {({ name, ...inputHandlers }) =>
                values.autoTracking ? (
                  <SelectInputFactory
                    {...inputHandlers}
                    editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_CARRIER])}
                    enumType="carrier"
                    name={name}
                    isNew={isNew}
                    items={['ONE']}
                    originalValue={initialValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.Shipments.carrier"
                        defaultMessage="TRANSPORTATION"
                      />
                    }
                    labelWidth="145px"
                    required
                  />
                ) : (
                  <TextInputFactory
                    {...inputHandlers}
                    name={name}
                    editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_CARRIER])}
                    isNew={isNew}
                    originalValue={initialValues[name]}
                    label={<FormattedMessage {...messages.carrier} />}
                  />
                )
              }
            </FormField>
          </React.Fragment>,
        ];

        return (
          <MainSectionPlaceholder height={1766} isLoading={isLoading}>
            <SectionHeader
              icon="SHIPMENT"
              title={<FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />}
            >
              <Followers
                followers={values?.followers ?? []}
                setFollowers={value => setFieldValue('followers', value)}
                organizationIds={[
                  values?.importer?.id,
                  values?.exporter?.id,
                  ...(values?.forwarders ?? []).map(forwarder => forwarder?.id),
                ].filter(Boolean)}
                editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_FOLLOWERS])}
              />

              {!isNew && (
                <>
                  <BooleanValue>
                    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                      <StatusToggle
                        readOnly={!hasPermission(SHIPMENT_ARCHIVE)}
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

                  {!isClone && hasPermission(SHIPMENT_CREATE) && (
                    <CloneButton
                      onClick={() => navigate(`/shipment/clone/${encodeId(shipmentId)}`)}
                    />
                  )}
                </>
              )}
            </SectionHeader>

            <div className={ShipmentSectionWrapperStyle}>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
                  <div className={ContainerTrackingWrapperStyle}>
                    <GridColumn>
                      <FieldItem
                        label={
                          <Label width="145px">
                            <FormattedMessage
                              id="modules.Shipments.autoTracking"
                              defaultMessage="AUTO TRACKING"
                            />
                          </Label>
                        }
                        input={
                          <div className={ContainerAutoTrackingContainerStyle}>
                            <ToggleInput
                              name="autoTracking"
                              align="right"
                              toggled={values.autoTracking}
                              onToggle={() => {
                                const shouldAutoTrack = !values.autoTracking;
                                setFieldValue('autoTracking', shouldAutoTrack);

                                if (shouldAutoTrack) {
                                  setTransportTypeTempState(transportTypeValues.transportType);
                                  setCarrierTempState(values.carrier);
                                  transportTypeSetFieldValue('transportType', 'Sea');
                                  cleanDataAfterChangeTransport();
                                  setFieldValue(
                                    'autoTrackingBy',
                                    autoTrackingByTempState ||
                                      initialValues.autoTrackingBy ||
                                      'BookingNo'
                                  );
                                  setFieldValue('carrier', 'ONE');
                                } else {
                                  setAutoTrackingByTempState(values.autoTrackingBy);
                                  transportTypeSetFieldValue(
                                    'transportType',
                                    transportTypeTempState ||
                                      initialTransportTypeValues.transportType
                                  );
                                  cleanDataAfterChangeTransport();
                                  setFieldValue('autoTrackingBy', null);
                                  setFieldValue(
                                    'carrier',
                                    carrierTempState || initialValues.carrier
                                  );
                                }
                              }}
                              editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_BOOKED])}
                            >
                              <Label>
                                {values.autoTracking ? (
                                  <FormattedMessage
                                    id="modules.Shipments.autoTrackingEnabled"
                                    defaultMessage="Enabled"
                                  />
                                ) : (
                                  <FormattedMessage
                                    id="modules.Shipments.autoTrackingDisabled"
                                    defaultMessage="Disabled"
                                  />
                                )}
                              </Label>
                            </ToggleInput>
                          </div>
                        }
                      />
                      {values.autoTracking && (
                        <>
                          <FormField
                            name="autoTrackingBy"
                            initValue={values.autoTrackingBy}
                            setFieldValue={setFieldValue}
                            values={values}
                            saveOnChange
                          >
                            {({ name, ...inputHandlers }) => (
                              <SelectInputFactory
                                name={name}
                                {...inputHandlers}
                                originalValue={initialValues.autoTrackingBy}
                                inputWidth="200px"
                                inputHeight="30px"
                                inputAlign="left"
                                editable
                                items={[
                                  { value: 'HouseBlNo', label: `House B/L no.` },
                                  { value: 'MasterBlNo', label: `Master B/L no.` },
                                  { value: 'BookingNo', label: `Booking no.` },
                                ]}
                                label={
                                  <FormattedMessage
                                    id="modules.Shipments.trackBy"
                                    defaultMessage="TRACK BY"
                                  />
                                }
                                labelWidth="145px"
                                required
                              />
                            )}
                          </FormField>
                          {autoTrackingConcernees}
                        </>
                      )}
                    </GridColumn>
                  </div>
                  <FormField
                    name="no"
                    initValue={values.no}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_NO])}
                        name={name}
                        isNew={isNew}
                        required
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.shipmentId} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="masterBlNo"
                    initValue={values.masterBlNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_MASTER_BL_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.masterBlNo} />}
                        required={values.autoTrackingBy === 'MasterBlNo'}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="blNo"
                    namey="houseNo"
                    initValue={values.blNo}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_HOUSE_BL_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.blNo} />}
                        required={values.autoTrackingBy === 'HouseBlNo'}
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
                        validator={validation}
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
                            editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_BL_DATE])}
                            name={name}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.blDate} />}
                            handleTimezone
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
                    validator={validation}
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
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_BOOKING_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.bookingNo} />}
                        required={values.autoTrackingBy === 'BookingNo'}
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
                      editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_BOOKED])}
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
                  {!values.autoTracking && autoTrackingConcernees}
                  <Subscribe to={[ShipmentTasksContainer]}>
                    {taskContainer => (
                      <FormField
                        name="bookingDate"
                        initValue={values.bookingDate}
                        setFieldValue={setFieldValue}
                        values={values}
                        validator={validation}
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
                            editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_BOOKING_DATE])}
                            name={name}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.bookingDate} />}
                            handleTimezone
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
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_INVOICE_NO])}
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
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_CONTRACT_NO])}
                        name={name}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={<FormattedMessage {...messages.contractNo} />}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="loadType"
                    initValue={values.loadType}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validation}
                    saveOnChange
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSelectInputFactory
                        {...inputHandlers}
                        enumType="LoadType"
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_LOAD_TYPE])}
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
                    validator={validation}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSearchSelectInputFactory
                        {...inputHandlers}
                        enumType="Incoterm"
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_INCOTERM])}
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
                  <CustomFieldsFactory
                    entityType="Shipment"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={{
                      values: hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_CUSTOM_FIELDS]),
                      mask: hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_CUSTOM_FIELDS_MASK]),
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
                            organizationIds={getEntityRelatedOrganizations({
                              entity: shipment,
                              userOrganizationId: userOrganization?.id,
                              formState: values,
                            })}
                            values={tags}
                            onChange={value => {
                              changeTags('tags', value);
                            }}
                            onClickRemove={value => {
                              changeTags(
                                'tags',
                                tags.filter(({ id }) => id !== value.id)
                              );
                            }}
                            editable={{
                              set:
                                hasPermission(TAG_GET) &&
                                hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_TAGS]),
                              remove: hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_TAGS]),
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
                    validator={validation}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextAreaInputFactory
                        {...inputHandlers}
                        editable={hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_MEMO])}
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
                        // Disable to changed importer if there is importer data sent
                        // from RM base on initDataForSlideView
                        isNew &&
                        !initDataForSlideView?.importer &&
                        hasPermission(NAVIGATION_NETWORK_PARTNERS) &&
                        hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_IMPORTER]) ? (
                          <BooleanValue>
                            {({ value: importerSelectorIsOpen, set: importerSelectorToggle }) => (
                              <>
                                {importer?.id ? (
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
                                                partnerTypes={['Importer']}
                                                selected={values.importer?.partner}
                                                onCancel={() => importerSelectorToggle(false)}
                                                onSelect={({ organization, ...partner }) => {
                                                  const assembledOrg = {
                                                    ...organization,
                                                    partner: {
                                                      ...partner,
                                                    },
                                                  };
                                                  if (selectedImporter) {
                                                    setSelectedImporter(assembledOrg);
                                                    importerDialogToggle(true);
                                                  } else {
                                                    onChangePartner('importer', assembledOrg);
                                                    importerSelectorToggle(false);
                                                  }
                                                }}
                                              />
                                              <ConfirmDialog
                                                message={
                                                  <FormattedMessage
                                                    id="modules.Shipment.importerDialogMessage"
                                                    defaultMessage="Changing the Importer will remove all Batches and all Followers of the current Importer from the Shipment. Are you sure you want to change the Importer?"
                                                  />
                                                }
                                                isOpen={importerDialogIsOpen}
                                                onRequestClose={() => {
                                                  importerDialogToggle(false);
                                                }}
                                                onCancel={() => {
                                                  importerDialogToggle(false);
                                                }}
                                                onConfirm={() => {
                                                  onChangePartner('importer', selectedImporter);
                                                  emitter.emit('CLEAN_SHIPMENTS', {
                                                    action: 'CHANGE_IMPORTER',
                                                    payload: {
                                                      importer,
                                                      selectedImporter,
                                                    },
                                                  });
                                                  importerDialogToggle(false);
                                                  importerSelectorToggle(false);
                                                }}
                                              />
                                            </>
                                          )}
                                        </ObjectValue>
                                      )}
                                    </BooleanValue>
                                  ) : (
                                    <SelectPartner
                                      partnerTypes={['Importer']}
                                      selected={values.importer}
                                      onCancel={() => importerSelectorToggle(false)}
                                      onSelect={({ organization, ...partner }) => {
                                        const assembledOrg = {
                                          ...organization,
                                          partner: {
                                            ...partner,
                                          },
                                        };
                                        setFieldValue('importer', assembledOrg);
                                        importerSelectorToggle(false);
                                      }}
                                    />
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
                            defaultMessage="The Exporter chosen here will have access to this Shipment and only Batches from Order with that Exporter will be allowed"
                          />
                        }
                      />
                    }
                    input={
                      <>
                        {(isForwarder() || isImporter()) &&
                        hasPermission(NAVIGATION_NETWORK_PARTNERS) &&
                        hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_EXPORTER]) ? (
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
                                    <SelectExporter
                                      cacheKey="ShipmentSelectExporter"
                                      selected={values.exporter?.partner}
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
                                          defaultMessage="Changing the Main Exporter will remove all Batches and remove all Followers of the current Main Exporter from the Shipment. Are you sure you want to change the Main Exporter?"
                                        />
                                      }
                                      warningMessage={
                                        <FormattedMessage
                                          id="modules.Shipment.mainExporterDeselectMessage"
                                          defaultMessage="Removing the Main Exporter will remove all Followers of the current Main Exporter from the Shipment. Are you sure you want to remove the Main Exporter?"
                                        />
                                      }
                                      onSelect={selectedExporter => {
                                        let assembledOrg = null;

                                        if (selectedExporter) {
                                          const { organization, ...partner } = selectedExporter;

                                          assembledOrg = {
                                            ...organization,
                                            partner: {
                                              ...partner,
                                            },
                                          };
                                        }

                                        onChangePartner('exporter', assembledOrg);

                                        emitter.emit('CLEAN_SHIPMENTS', {
                                          action: 'CHANGE_EXPORTER',
                                          payload: {
                                            exporter,
                                            selectedExporter: assembledOrg,
                                          },
                                        });
                                        exporterSelectorToggle(false);
                                      }}
                                    />
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
                        <FormattedNumber value={forwarders.length} />)
                      </Label>
                    }
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Shipments.tooltipForwarder"
                            defaultMessage="Owners can edit the product information. To add other partners, use end products"
                          />
                        }
                      />
                    }
                    input={
                      <BooleanValue>
                        {({ value: forwardersSelectorIsOpen, set: forwardersSelectorToggle }) => (
                          <>
                            <div
                              onClick={() =>
                                hasPermission(NAVIGATION_NETWORK_PARTNERS) &&
                                hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_FORWARDERS])
                                  ? forwardersSelectorToggle(true)
                                  : () => {}
                              }
                              role="presentation"
                            >
                              {renderForwarders(
                                forwarders,
                                hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_FORWARDERS])
                              )}
                            </div>

                            <SlideView
                              isOpen={forwardersSelectorIsOpen}
                              onRequestClose={() => forwardersSelectorToggle(false)}
                            >
                              <BooleanValue>
                                {({
                                  value: forwardersDialogIsOpen,
                                  set: forwardersDialogToggle,
                                }) => (
                                  <ArrayValue defaultValue={forwarders}>
                                    {({
                                      value: selectedForwarders,
                                      set: setSelectedForwarders,
                                    }) => (
                                      <>
                                        <SelectPartners
                                          partnerTypes={['Forwarder']}
                                          selected={forwarders.map(forwarder => forwarder?.partner)}
                                          onCancel={() => forwardersSelectorToggle(false)}
                                          onSelect={selected => {
                                            const assembledOrgs = selected.map(
                                              ({ organization, ...partner }) => ({
                                                ...organization,
                                                partner: {
                                                  ...partner,
                                                  organization,
                                                },
                                              })
                                            );
                                            const removedForwarders = forwarders.filter(
                                              prevForwarder =>
                                                !assembledOrgs.some(
                                                  newForwarder =>
                                                    newForwarder.id === prevForwarder.id
                                                )
                                            );

                                            if (removedForwarders.length > 0) {
                                              setSelectedForwarders(assembledOrgs);
                                              forwardersDialogToggle(true);
                                            } else {
                                              onChangeForwarders(assembledOrgs);
                                              forwardersSelectorToggle(false);
                                            }
                                          }}
                                        />
                                        <ConfirmDialog
                                          message={
                                            <FormattedMessage
                                              id="modules.Shipment.forwardersDialogMessage"
                                              defaultMessage="Changing the Forwarders will remove all Followers of the removed Forwarders from the Shipment. Are you sure you want to change the Forwarders?"
                                            />
                                          }
                                          isOpen={forwardersDialogIsOpen}
                                          onRequestClose={() => {
                                            forwardersDialogToggle(false);
                                          }}
                                          onCancel={() => {
                                            forwardersDialogToggle(false);
                                          }}
                                          onConfirm={() => {
                                            console.log(
                                              'selectedForwarders on confirm ',
                                              selectedForwarders
                                            );
                                            onChangeForwarders(selectedForwarders);
                                            emitter.emit('CLEAN_SHIPMENTS', {
                                              action: 'CHANGE_FORWARDERS',
                                              payload: {
                                                forwarders,
                                                selectedForwarders,
                                              },
                                            });
                                            forwardersDialogToggle(false);
                                            forwardersSelectorToggle(false);
                                          }}
                                        />
                                      </>
                                    )}
                                  </ArrayValue>
                                )}
                              </BooleanValue>
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    }
                  />
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.Projects.sharedPartners"
                          defaultMessage="Shared Partners"
                        />
                        {' ('}
                        <FormattedNumber value={organizations?.length || 0} />)
                      </Label>
                    }
                    tooltip={
                      <FormTooltip
                        infoMessage={
                          <FormattedMessage
                            id="modules.Shipment.sharedPartners.tooltip"
                            defaultMessage="Shared Partners will have access to this shipment."
                          />
                        }
                      />
                    }
                    input={
                      <BooleanValue>
                        {({ value: partnerSelectorIsOpen, set: partnerSelectorToggle }) => (
                          <>
                            <div
                              onClick={() =>
                                isImporter() &&
                                hasPermission(NAVIGATION_NETWORK_PARTNERS) &&
                                hasPermission(SHIPMENT_EDIT)
                                  ? partnerSelectorToggle(true)
                                  : () => {}
                              }
                              role="presentation"
                            >
                              {renderPartners(
                                organizations,
                                hasPermission(NAVIGATION_NETWORK_PARTNERS) &&
                                  hasPermission(SHIPMENT_EDIT)
                              )}
                            </div>

                            <SlideView
                              isOpen={partnerSelectorIsOpen}
                              onRequestClose={() => partnerSelectorToggle(false)}
                            >
                              <>
                                <SelectPartners
                                  partnerTypes={[]}
                                  selected={organizations?.map(org => org?.partner) || []}
                                  onCancel={() => partnerSelectorToggle(false)}
                                  onSelect={selected => {
                                    const assembledOrgs = selected.map(
                                      ({ organization, ...partner }) => ({
                                        ...organization,
                                        partner: {
                                          ...partner,
                                          organization,
                                        },
                                      })
                                    );

                                    onChangePartners(assembledOrgs, forwarders, exporter, importer);

                                    emitter.emit('CLEAN_SHIPMENTS', {
                                      action: 'CHANGE_SHARED_PARTNERS',
                                      payload: {
                                        selectedOrganizations: assembledOrgs,
                                      },
                                    });
                                    partnerSelectorToggle(false);
                                  }}
                                />
                              </>
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
                                <FormattedNumber value={uniqueExporters.length} />)
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
          </MainSectionPlaceholder>
        );
      }}
    </Subscribe>
  );
};

export default ShipmentSection;
