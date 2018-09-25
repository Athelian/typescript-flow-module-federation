// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { textInputFactory } from 'modules/form/helpers';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/product/form/validator';
import GridColumn from 'components/GridColumn';
// import { FieldItem, Label, TagsInput, DashedPlusButton } from 'components/Form';
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
            <FormField
              name="name"
              initValue={values.name}
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
                  label: 'NAME',
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
