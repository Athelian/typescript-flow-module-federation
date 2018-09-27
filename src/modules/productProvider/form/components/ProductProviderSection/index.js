// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { BooleanValue } from 'react-values';
import { textInputFactory, priceInputFactory } from 'modules/form/helpers';
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
      // $FlowFixMe
      const values = { ...initialValues, ...state };

      return (
        <div className={ProductProviderSectionWrapperStyle}>
          <GridColumn>
            <GridRow>
              <GridColumn gap="10px">
                <Label required>EXPORTER</Label>
                <BooleanValue>
                  {({ value: opened, set: exporterSlideToggle }) => (
                    <>
                      {!values.exporter ? (
                        <DashedPlusButton
                          width="200px"
                          height="230px"
                          onClick={() => exporterSlideToggle(true)}
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
                <Label required>SUPPLIER</Label>
                <BooleanValue>
                  {({ value: opened, set: supplierSlideToggle }) => (
                    <>
                      {!values.supplier ? (
                        <DashedPlusButton
                          width="200px"
                          height="230px"
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
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  required: true,
                  initValue: initialValues[name],
                  label: 'COUNTRY OF ORIGIN',
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
                  initValue: initialValues[name],
                  label: 'PRODUCTION LEAD TIME',
                  currency: 'Days',
                })
              }
            </FormField>

            <FormField
              name="inspectionFee"
              initValue={values.inspectionFee.amount}
              setFieldValue={(field, amount) =>
                setFieldValue('inspectionFee', { amount, currency: 'JPY' })
              }
            >
              {({ name, ...inputHandlers }) =>
                priceInputFactory({
                  name,
                  isNew,
                  inputHandlers,
                  initValue: initialValues[name].amount,
                  label: 'INSPECTION FEE',
                  currency: 'JPY',
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
