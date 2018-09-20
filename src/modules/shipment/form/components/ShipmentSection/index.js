// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { uniqBy } from 'lodash';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { FormContainer, FormField } from 'modules/form';
import { selectSearchEnumInputFactory } from 'modules/form/helpers';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentBatchesContainer,
  ShipmentTagsContainer,
} from 'modules/shipment/form/containers';
import { ShipmentExporterCard, ShipmentForwarderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  DashedPlusButton,
  TextInput,
  DateInput,
  TagsInput,
} from 'components/Form';
import messages from 'modules/shipment/messages';
import SelectForwarders from '../SelectForwarders';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  TagsInputStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  ExporterEmptyCardStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const getUniqueExporters = (batches: Array<Object>) => {
  const uniqueExporters = uniqBy(
    batches.map(batch => batch.orderItem.productProvider.exporter),
    'id'
  );

  return uniqueExporters;
};

const renderExporters = (exporters: Array<Object>) => {
  const numOfExporters = exporters.length;

  if (numOfExporters === 0) {
    return <div className={ExporterEmptyCardStyle} />;
  }
  if (numOfExporters === 1) {
    return <ShipmentExporterCard exporter={exporters[0]} />;
  }
  if (numOfExporters === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <ShipmentExporterCard exporter={exporters[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfExporters === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfExporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[0]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

const renderForwarders = (forwarders: Array<Object>) => {
  const numOfForwarders = forwarders.length;

  if (numOfForwarders === 0) {
    return <DashedPlusButton width="200px" height="230px" />;
  }
  if (numOfForwarders === 1) {
    return <ShipmentForwarderCard forwarder={forwarders[0]} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <ShipmentForwarderCard forwarder={forwarders[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[0]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

const ShipmentSection = ({ isNew }: Props) => (
  <Subscribe to={[ShipmentInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue, validationRules }) => {
      const values = { ...initialValues, ...state };
      const { forwarders = [] } = values;

      return (
        <div className={ShipmentSectionWrapperStyle}>
          <div className={MainFieldsWrapperStyle}>
            <Subscribe to={[FormContainer]}>
              {({ state: { touched, errors, activeField }, ...formHelper }) => (
                <GridColumn>
                  <FormField
                    name="no"
                    initValue={values.no}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label required>
                            <FormattedMessage {...messages.shipmentId} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <TextInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="blNo"
                    initValue={values.blNo}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.blNo} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <TextInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="blDate"
                    initValue={values.blDate}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.blDate} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <DateInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="bookingNo"
                    initValue={values.bookingNo}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.bookingNo} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <TextInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="bookingDate"
                    initValue={values.bookingDate}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.bookingDate} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <DateInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <FormField
                    name="invoiceNo"
                    initValue={values.invoiceNo}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.invoiceNo} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <TextInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                  <Subscribe to={[ShipmentTransportTypeContainer]}>
                    {({
                      originalValues: initialTransportTypeValues,
                      state: transportTypeState,
                      setFieldValue: transportTypeSetFieldValue,
                    }) => {
                      const transportTypeValues = {
                        ...initialTransportTypeValues,
                        ...transportTypeState,
                      };

                      return (
                        <FormField
                          name="transportType"
                          initValue={values.transportType}
                          setFieldValue={transportTypeSetFieldValue}
                          validationOnChange
                          onValidate={newValue =>
                            formHelper.onValidation({ ...values, ...newValue }, validationRules())
                          }
                          {...formHelper}
                        >
                          {({ name, ...inputHandlers }) =>
                            selectSearchEnumInputFactory({
                              enumType: 'TransportType',
                              inputHandlers,
                              name,
                              isNew,
                              label: <Label>TRANSPORTATION</Label>,
                              initValue: transportTypeValues[name],
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
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) =>
                      selectSearchEnumInputFactory({
                        enumType: 'LoadType',
                        inputHandlers,
                        name,
                        isNew,
                        label: <Label>Load Type</Label>,
                        initValue: initialValues[name],
                      })
                    }
                  </FormField>
                  <FormField
                    name="carrier"
                    initValue={values.carrier}
                    validationOnChange
                    onValidate={newValue =>
                      formHelper.onValidation({ ...values, ...newValue }, validationRules())
                    }
                    setFieldValue={setFieldValue}
                    {...formHelper}
                  >
                    {({ name, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage {...messages.carrier} />
                          </Label>
                        }
                        tooltip={
                          <Tooltip
                            isNew={isNew}
                            errorMessage={touched[name] && errors[name]}
                            changedValues={{
                              oldValue: initialValues[name],
                              newValue: values[name],
                            }}
                          />
                        }
                        input={
                          <DefaultStyle
                            isFocused={activeField === name}
                            hasError={touched[name] && errors[name]}
                            forceHoverStyle={isNew}
                            width="200px"
                          >
                            <TextInput name={name} {...inputHandlers} />
                          </DefaultStyle>
                        }
                      />
                    )}
                  </FormField>
                </GridColumn>
              )}
            </Subscribe>
            <GridColumn>
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <div onClick={toggle} role="presentation">
                      <FieldItem
                        vertical
                        label={<Label>FORWARDER ({forwarders.length})</Label>}
                        tooltip={<Tooltip infoMessage="You can choose up to 4 Forwarders." />}
                        input={renderForwarders(forwarders)}
                      />
                    </div>
                    <SlideView
                      isOpen={opened}
                      onRequestClose={toggle}
                      options={{ width: '1030px' }}
                    >
                      {opened && (
                        <Subscribe to={[FormContainer]}>
                          {({ onValidation, setFieldTouched }) => (
                            <SelectForwarders
                              selected={values.forwarders}
                              onCancel={toggle}
                              onSelect={newValue => {
                                const selectedForwarders = newValue.map(item => ({
                                  id: item.group.id,
                                  name: item.name || item.group.name,
                                }));
                                toggle();
                                setFieldTouched('forwarders');
                                setFieldValue('forwarders', selectedForwarders);
                                onValidation(
                                  {
                                    ...values,
                                    forwarders: selectedForwarders,
                                  },
                                  validationRules()
                                );
                              }}
                            />
                          )}
                        </Subscribe>
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
              <Subscribe to={[ShipmentBatchesContainer]}>
                {({ state: { batches } }) => {
                  const uniqueExporters = getUniqueExporters(batches);
                  return (
                    <FieldItem
                      vertical
                      label={
                        <div className={ExporterLabelStyle}>
                          <Label>EXPORTER ({uniqueExporters.length})</Label>
                          {uniqueExporters.length > 4 && (
                            <button className={ExporterSeeMoreButtonStyle} type="button">
                              <Icon icon="HORIZONTAL_ELLIPSIS" />
                            </button>
                          )}
                        </div>
                      }
                      tooltip={
                        <Tooltip infoMessage="Exporters are automatically shown based off of the Batches chosen for the Cargo of this Shipment." />
                      }
                      input={renderExporters(uniqueExporters)}
                    />
                  );
                }}
              </Subscribe>
            </GridColumn>
          </div>
          <div className={TagsInputStyle}>
            <Subscribe to={[FormContainer, ShipmentTagsContainer]}>
              {(
                { setFieldTouched, onValidation },
                { state: { tags }, setFieldValue: changeTags }
              ) => (
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
                        setFieldTouched('tags');
                        onValidation(
                          {
                            ...values,
                          },
                          validationRules()
                        );
                      }}
                    />
                  }
                />
              )}
            </Subscribe>

            <div className={DividerStyle} />
          </div>
        </div>
      );
    }}
  </Subscribe>
);

export default ShipmentSection;
