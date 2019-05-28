// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { BooleanValue, ObjectValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { convertValueToFormFieldFormat } from 'components/Form/Factories/helpers';
import SelectExporters from 'modules/order/common/SelectExporters';
import SlideView from 'components/SlideView';
import validator from 'modules/product/form/validator';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { PartnerCard, GrayCard } from 'components/Cards';
import {
  FieldItem,
  Label,
  DashedPlusButton,
  EnumSearchSelectInputFactory,
  NumberInputFactory,
  CustomFieldsFactory,
  DayInputFactory,
  TextInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import { PRODUCT_PROVIDER_UPDATE } from 'modules/permission/constants/product';
import SelectSupplier from '../SelectSupplier';
import { ProductProviderSectionWrapperStyle, DividerStyle } from './style';
import { generateName } from './helper';

type Props = {
  isNew: boolean,
  isExist: boolean,
  isOwner: boolean,
};

const ProductProviderSection = ({ isNew, isOwner, isExist }: Props) => {
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(PRODUCT_PROVIDER_UPDATE);

  return (
    <Subscribe to={[ProductProviderInfoContainer]}>
      {({ originalValues, state, setFieldValue }) => {
        const values = { ...originalValues, ...state };

        return (
          <div className={ProductProviderSectionWrapperStyle}>
            <GridColumn>
              <GridRow>
                <GridColumn gap="10px">
                  <FieldItem
                    label={
                      <Label required>
                        <FormattedMessage
                          id="modules.ProductProviders.exporter"
                          defaultMessage="EXPORTER"
                        />
                      </Label>
                    }
                  />

                  {values.isNew ? (
                    <BooleanValue>
                      {({ value: opened, set: exporterSlideToggle }) => (
                        <>
                          {!values.exporter ? (
                            <DashedPlusButton
                              width="195px"
                              height="215px"
                              onClick={() => exporterSlideToggle(true)}
                              data-testid="selectExportersButton"
                            />
                          ) : (
                            <PartnerCard
                              partner={values.exporter}
                              onClick={() => exporterSlideToggle(true)}
                            />
                          )}
                          <ObjectValue defaultValue={null}>
                            {({ value: currentExporter, set: setExporter }) => (
                              <>
                                <ConfirmDialog
                                  isOpen={!!currentExporter}
                                  onRequestClose={() => setExporter(null)}
                                  onCancel={() => setExporter(null)}
                                  onConfirm={() => {
                                    setExporter(null);
                                    exporterSlideToggle(false);
                                    const existName = getByPathWithDefault('', 'name', values);
                                    const entityName = getByPathWithDefault(
                                      '',
                                      'name',
                                      currentExporter
                                    );
                                    const generatedName = generateName(
                                      {
                                        entityName,
                                        name: existName,
                                        type: 'exporter',
                                      },
                                      {
                                        supplier: getByPath('supplier.name', values),
                                        exporter: getByPath('exporter.name', values),
                                      }
                                    );

                                    setFieldValue('exporter', currentExporter);
                                    if (generatedName !== existName) {
                                      setFieldValue(
                                        'name',
                                        convertValueToFormFieldFormat(generatedName)
                                      );
                                    }
                                  }}
                                  message={
                                    <FormattedMessage
                                      id="modules.Products.changeExporterWarning"
                                      defaultMessage="Changing the Exporter will remove all assigned Staff of the current Exporter from all Tasks?"
                                    />
                                  }
                                />
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => exporterSlideToggle(false)}
                                >
                                  {opened && (
                                    <FormField
                                      name="name"
                                      initValue={values.name}
                                      setFieldValue={setFieldValue}
                                      values={values}
                                      validator={validator}
                                      saveOnChange
                                      validationOnChange
                                    >
                                      {({ onChange }) => (
                                        <>
                                          <SelectExporters
                                            selected={values.exporter}
                                            onCancel={() => exporterSlideToggle(false)}
                                            onSelect={newValue => {
                                              if (!values.exporter) {
                                                exporterSlideToggle(false);
                                                const existName = getByPathWithDefault(
                                                  '',
                                                  'name',
                                                  values
                                                );
                                                const entityName = getByPathWithDefault(
                                                  '',
                                                  'name',
                                                  newValue
                                                );
                                                const generatedName = generateName(
                                                  {
                                                    entityName,
                                                    name: existName,
                                                    type: 'exporter',
                                                  },
                                                  {
                                                    supplier: getByPath('supplier.name', values),
                                                    exporter: getByPath('exporter.name', values),
                                                  }
                                                );

                                                setFieldValue('exporter', newValue);
                                                if (generatedName !== existName) {
                                                  onChange(
                                                    convertValueToFormFieldFormat(generatedName)
                                                  );
                                                }
                                              } else {
                                                setExporter(newValue);
                                              }
                                            }}
                                          />
                                        </>
                                      )}
                                    </FormField>
                                  )}
                                </SlideView>
                              </>
                            )}
                          </ObjectValue>
                        </>
                      )}
                    </BooleanValue>
                  ) : (
                    <>
                      {!values.exporter ? (
                        <GrayCard width="195px" height="215px" />
                      ) : (
                        <PartnerCard partner={values.exporter} readOnly />
                      )}
                    </>
                  )}
                </GridColumn>

                <GridColumn gap="10px">
                  <FieldItem
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.ProductProviders.supplier"
                          defaultMessage="SUPPLIER"
                        />
                      </Label>
                    }
                  />
                  {values.isNew ? (
                    <BooleanValue>
                      {({ value: opened, set: supplierSlideToggle }) => (
                        <>
                          {!values.supplier ? (
                            <DashedPlusButton
                              width="195px"
                              height="215px"
                              onClick={() => supplierSlideToggle(true)}
                            />
                          ) : (
                            <PartnerCard
                              partner={values.supplier}
                              onClick={() => supplierSlideToggle(true)}
                            />
                          )}
                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => supplierSlideToggle(false)}
                          >
                            {opened && (
                              <FormField
                                name="name"
                                initValue={values.name}
                                setFieldValue={setFieldValue}
                                values={values}
                                validator={validator}
                                saveOnChange
                                validationOnChange
                              >
                                {({ onChange }) => (
                                  <SelectSupplier
                                    selected={values.supplier}
                                    onCancel={() => supplierSlideToggle(false)}
                                    onSelect={newValue => {
                                      supplierSlideToggle(false);
                                      const existName = getByPathWithDefault('', 'name', values);
                                      const entityName = getByPathWithDefault('', 'name', newValue);
                                      const generatedName = generateName(
                                        {
                                          entityName,
                                          name: existName,
                                          type: 'supplier',
                                        },
                                        {
                                          supplier: getByPath('supplier.name', values),
                                          exporter: getByPath('exporter.name', values),
                                        }
                                      );

                                      if (generatedName !== existName) {
                                        onChange(convertValueToFormFieldFormat(generatedName));
                                      }
                                      setFieldValue('supplier', newValue);
                                    }}
                                  />
                                )}
                              </FormField>
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  ) : (
                    <>
                      {!values.supplier ? (
                        <GrayCard width="195px" height="215px" />
                      ) : (
                        <PartnerCard partner={values.supplier} readOnly />
                      )}
                    </>
                  )}
                </GridColumn>
              </GridRow>

              <FormField
                name="name"
                initValue={values.name}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <TextInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    required
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage id="modules.ProductProviders.name" defaultMessage="NAME" />
                    }
                    {...(isExist
                      ? {
                          errorMessage: (
                            <FormattedMessage
                              id="modules.productProvider.mustBeUniqueName"
                              defaultMessage="The name of End Product with the same Exporter and Supplier must be unique"
                            />
                          ),
                        }
                      : {})}
                    editable={allowUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="origin"
                initValue={values.origin}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) => (
                  <EnumSearchSelectInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.countryOfOrigin"
                        defaultMessage="COUNTRY OF ORIGIN"
                      />
                    }
                    editable={allowUpdate}
                    enumType="Country"
                  />
                )}
              </FormField>

              <FormField
                name="productionLeadTime"
                initValue={values.productionLeadTime}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <DayInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.productionLeadTime"
                        defaultMessage="PRODUCTION LEAD TIME"
                      />
                    }
                    editable={allowUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="inspectionFee.amount"
                initValue={getByPath('inspectionFee.amount', values)}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <NumberInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('inspectionFee.amount', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.inspectionFee"
                        defaultMessage="INSPECTION FEE"
                      />
                    }
                    editable={allowUpdate}
                  />
                )}
              </FormField>

              <FormField
                name="inspectionFee.currency"
                initValue={getByPath('inspectionFee.currency', values)}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <EnumSearchSelectInputFactory
                    name={name}
                    {...inputHandlers}
                    isNew={isNew}
                    originalValue={getByPath('inspectionFee.currency', originalValues)}
                    label={
                      <FormattedMessage
                        id="modules.ProductProviders.inspectionFeeCurrency"
                        defaultMessage="INSPECTION FEE CURRENCY"
                      />
                    }
                    editable={allowUpdate}
                    enumType="Currency"
                    hideClearButton
                  />
                )}
              </FormField>
              <CustomFieldsFactory
                entityType="ProductProvider"
                customFields={values.customFields}
                setFieldValue={setFieldValue}
                editable={{
                  values: allowUpdate,
                  mask: allowUpdate,
                }}
              />
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
                    editable={allowUpdate}
                    name={name}
                    isNew={isNew}
                    originalValue={originalValues[name]}
                    label={
                      <FormattedMessage id="modules.ProductProviders.memo" defaultMessage="MEMO" />
                    }
                    inputWidth="400px"
                    inputHeight="120px"
                  />
                )}
              </FormField>

              <div className={DividerStyle} />
            </GridColumn>
          </div>
        );
      }}
    </Subscribe>
  );
};

export default ProductProviderSection;
