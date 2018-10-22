// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { BooleanValue } from 'react-values';
import {
  selectSearchEnumInputFactory,
  priceInputFactory,
  numberInputFactory,
} from 'modules/form/helpers';
import ProductProviderContainer from 'modules/productProvider/form/container';
import SelectExporters from 'modules/order/common/SelectExporters';
import SlideView from 'components/SlideView';
import validator from 'modules/product/form/validator';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { PartnerCard } from 'components/Cards';
import { Label, DashedPlusButton } from 'components/Form';
import SelectSupplier from '../SelectSupplier';
import { ProductProviderSectionWrapperStyle, DividerStyle } from './style';

type Props = {
  isNew: boolean,
};

const ProductProviderSection = ({ isNew }: Props) => (
  <Subscribe to={[ProductProviderContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values = { ...initialValues, ...state };

      return (
        <div className={ProductProviderSectionWrapperStyle}>
          <GridColumn>
            <GridRow>
              <GridColumn gap="10px">
                <Label required>
                  <FormattedMessage
                    id="modules.ProductProviders.exporter"
                    defaultMessage="EXPORTER"
                  />
                </Label>
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
              </GridColumn>

              <GridColumn gap="10px">
                <Label>
                  <FormattedMessage
                    id="modules.ProductProviders.supplier"
                    defaultMessage="SUPPLIER"
                  />
                </Label>
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
              </GridColumn>
            </GridRow>

            <FormField
              name="origin"
              initValue={values.origin}
              setFieldValue={setFieldValue}
              values={values}
              validator={validator}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType: 'Country',
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: initialValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.countryOfOrigin"
                      defaultMessage="COUNTRY OF ORIGIN"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="productionLeadTime"
              initValue={values.productionLeadTime}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                priceInputFactory({
                  name,
                  isNew,
                  inputHandlers,
                  originalValue: initialValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.productionLeadTime"
                      defaultMessage="PRODUCTION LEAD TIME"
                    />
                  ),
                  currency: 'Days',
                })
              }
            </FormField>

            <FormField
              name="inspectionFee.amount"
              initValue={values.inspectionFee.amount}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  isNew,
                  inputHandlers,
                  originalValue: initialValues.inspectionFee.amount,
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.inspectionFee"
                      defaultMessage="INSPECTION FEE"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="inspectionFee.currency"
              initValue={values.inspectionFee.currency}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                selectSearchEnumInputFactory({
                  enumType: 'Currency',
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: initialValues.inspectionFee.currency,
                  label: (
                    <FormattedMessage
                      id="modules.ProductProviders.inspectionFeeCurrency"
                      defaultMessage="INSPECTION FEE CURRENCY"
                    />
                  ),
                })
              }
            </FormField>
            <div className={DividerStyle} />
          </GridColumn>
        </div>
      );
    }}
  </Subscribe>
);

export default ProductProviderSection;
