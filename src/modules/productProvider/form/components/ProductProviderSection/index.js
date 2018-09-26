// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { textInputFactory, priceInputFactory } from 'modules/form/helpers';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/product/form/validator';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { Label, DashedPlusButton } from 'components/Form';
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
                <Label required>EXPORTER</Label>
                <DashedPlusButton width="200px" height="230px" />
              </GridColumn>

              <GridColumn gap="10px">
                <Label>SUPPLIER</Label>
                <DashedPlusButton width="200px" height="230px" />
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
