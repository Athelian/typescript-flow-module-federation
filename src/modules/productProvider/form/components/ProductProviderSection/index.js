// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { BooleanValue } from 'react-values';
import ProductProviderContainer from 'modules/productProvider/form/container';
import SelectExporters from 'modules/order/common/SelectExporters';
import SlideView from 'components/SlideView';
import validator from 'modules/product/form/validator';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { PartnerCard, GrayCard } from 'components/Cards';
import {
  FieldItem,
  FormTooltip,
  Label,
  DashedPlusButton,
  EnumSearchSelectInputFactory,
  NumberInputFactory,
  CustomFieldsFactory,
  DayInputFactory,
} from 'components/Form';
import { PermissionConsumer } from 'modules/permission';
import SelectSupplier from '../SelectSupplier';
import { ProductProviderSectionWrapperStyle, DividerStyle } from './style';

type Props = {
  isNew: boolean,
  isExist: boolean,
};

const ProductProviderSection = ({ isNew, isExist }: Props) => (
  <PermissionConsumer>
    {hasPermission => {
      const canCreateOrUpdate =
        hasPermission('product.productProviders.create') ||
        hasPermission('product.productProviders.update');

      return (
        <Subscribe to={[ProductProviderContainer]}>
          {({ originalValues: initialValues, state, setFieldValue }) => {
            const values = { ...initialValues, ...state };

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
                        tooltip={
                          isExist ? (
                            <FormTooltip
                              errorMessage={
                                <FormattedMessage
                                  id="modules.productProvider.unique"
                                  defaultMessage="The pair of Exporter and Supplier must be unique"
                                />
                              }
                            />
                          ) : null
                        }
                      />

                      {isNew ? (
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
                                options={{ width: '980px' }}
                                rootElementId="slide-view-root2"
                              >
                                {opened && (
                                  <SelectExporters
                                    selected={values.exporter}
                                    onCancel={() => exporterSlideToggle(false)}
                                    onSelect={newValue => {
                                      exporterSlideToggle(false);
                                      setFieldValue('exporter', newValue);
                                    }}
                                  />
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
                            <PartnerCard partner={values.exporter} />
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
                        tooltip={
                          isExist ? (
                            <FormTooltip
                              errorMessage={
                                <FormattedMessage
                                  id="modules.productProvider.unique"
                                  defaultMessage="The pair of Exporter and Supplier must be unique"
                                />
                              }
                            />
                          ) : null
                        }
                      />
                      {isNew ? (
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
                                options={{ width: '980px' }}
                                rootElementId="slide-view-root2"
                              >
                                {opened && (
                                  <SelectSupplier
                                    selected={values.supplier}
                                    onCancel={() => supplierSlideToggle(false)}
                                    onSelect={newValue => {
                                      supplierSlideToggle(false);
                                      setFieldValue('supplier', newValue);
                                    }}
                                  />
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
                            <PartnerCard partner={values.supplier} />
                          )}
                        </>
                      )}
                    </GridColumn>
                  </GridRow>

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
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.countryOfOrigin"
                            defaultMessage="COUNTRY OF ORIGIN"
                          />
                        }
                        editable={canCreateOrUpdate}
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
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.productionLeadTime"
                            defaultMessage="PRODUCTION LEAD TIME"
                          />
                        }
                        editable={canCreateOrUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="inspectionFee.amount"
                    initValue={values.inspectionFee.amount}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <NumberInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues.inspectionFee.amount}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.inspectionFee"
                            defaultMessage="INSPECTION FEE"
                          />
                        }
                        editable={canCreateOrUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="inspectionFee.currency"
                    initValue={values.inspectionFee.currency}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSearchSelectInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues.inspectionFee.currency}
                        label={
                          <FormattedMessage
                            id="modules.ProductProviders.inspectionFeeCurrency"
                            defaultMessage="INSPECTION FEE CURRENCY"
                          />
                        }
                        editable={canCreateOrUpdate}
                        enumType="Currency"
                      />
                    )}
                  </FormField>
                  <CustomFieldsFactory
                    entityType="ProductProvider"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={canCreateOrUpdate}
                  />
                  <div className={DividerStyle} />
                </GridColumn>
              </div>
            );
          }}
        </Subscribe>
      );
    }}
  </PermissionConsumer>
);

export default ProductProviderSection;
