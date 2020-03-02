// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { BooleanValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import SelectPartner from 'components/SelectPartner';
import {
  ProductProviderInfoContainer,
  ProductProviderTasksContainer,
} from 'modules/productProvider/form/containers';
import { convertValueToFormFieldFormat } from 'components/Form/Factories/helpers';
import SelectExporter from 'modules/order/common/SelectExporter';
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
  CustomFieldsFactory,
  TextInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_EXPORTER,
  PRODUCT_PROVIDER_SET_SUPPLIER,
  PRODUCT_PROVIDER_SET_NAME,
  PRODUCT_PROVIDER_SET_ORIGIN,
  PRODUCT_PROVIDER_SET_CUSTOM_FIELDS,
  PRODUCT_PROVIDER_SET_CUSTOM_FIELDS_MASK,
  PRODUCT_PROVIDER_SET_MEMO,
} from 'modules/permission/constants/product';
import { ProductProviderSectionWrapperStyle, DividerStyle } from './style';
import { generateName } from './helper';

type Props = {
  isNew: boolean,
  isExist: boolean,
  isOwner: boolean,
};

const ProductProviderSection = ({ isNew, isOwner, isExist }: Props) => {
  const { hasPermission } = usePermission(isOwner);
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

                  {values.isNew &&
                  hasPermission(PARTNER_LIST) &&
                  hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_EXPORTER]) ? (
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

                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => exporterSlideToggle(false)}
                          >
                            {opened && (
                              <Subscribe to={[ProductProviderTasksContainer]}>
                                {({ onChangeExporter }) => (
                                  <SelectExporter
                                    cacheKey="EndProductSelectExporter"
                                    isRequired
                                    selected={values.exporter}
                                    onCancel={() => exporterSlideToggle(false)}
                                    warningMessage={
                                      <FormattedMessage
                                        id="modules.ProductProviders.changeExporterWarning"
                                        defaultMessage="Changing the Exporter will remove all assigned Staff of the current Exporter from all Tasks. Are you sure you want to change the Exporter?"
                                      />
                                    }
                                    onSelect={newValue => {
                                      exporterSlideToggle(false);
                                      const existName = values?.name || '';
                                      const entityName =
                                        newValue?.name || newValue?.organization?.name || '';
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
                                      if (generatedName !== existName) {
                                        setFieldValue('name', generatedName);
                                      }
                                      setFieldValue('exporter', newValue);
                                      onChangeExporter(values.exporter);
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
                  {values.isNew &&
                  hasPermission(PARTNER_LIST) &&
                  hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_SUPPLIER]) ? (
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
                                  <SelectPartner
                                    partnerTypes={['Supplier']}
                                    selected={values.supplier}
                                    onCancel={() => supplierSlideToggle(false)}
                                    onSelect={newValue => {
                                      supplierSlideToggle(false);
                                      const existName = getByPathWithDefault('', 'name', values);
                                      const entityName =
                                        newValue?.name || newValue?.organization?.name || '';
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
                          isTouched: true,
                        }
                      : {})}
                    editable={hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_NAME])}
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
                    editable={hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_ORIGIN])}
                    enumType="Country"
                  />
                )}
              </FormField>

              <CustomFieldsFactory
                entityType="ProductProvider"
                customFields={values.customFields}
                setFieldValue={setFieldValue}
                editable={{
                  values: hasPermission([
                    PRODUCT_PROVIDER_UPDATE,
                    PRODUCT_PROVIDER_SET_CUSTOM_FIELDS,
                  ]),
                  mask: hasPermission([
                    PRODUCT_PROVIDER_UPDATE,
                    PRODUCT_PROVIDER_SET_CUSTOM_FIELDS_MASK,
                  ]),
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
                    editable={hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_MEMO])}
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
