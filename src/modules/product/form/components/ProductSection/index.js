// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { textInputFactory } from 'modules/form/helpers';
import { ProductInfoContainer, ProductTagsContainer } from 'modules/product/form/containers';
import validator from 'modules/product/form/validator';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, TagsInput } from 'components/Form';
import { ProductSectionWrapperStyle, TagsInputStyle, DividerStyle } from './style';

type Props = {
  isNew: boolean,
};

const ProductSection = ({ isNew }: Props) => (
  <Subscribe to={[ProductInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values = { ...initialValues, ...state };

      return (
        <div className={ProductSectionWrapperStyle}>
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
            <FormField
              name="serial"
              initValue={values.serial}
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
                  label: 'SERIAL',
                })
              }
            </FormField>
            <FormField
              name="janCode"
              initValue={values.janCode}
              setFieldValue={setFieldValue}
              values={values}
              validator={validator}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  initValue: initialValues[name],
                  label: 'JAN CODE',
                })
              }
            </FormField>
            <FormField
              name="hsCode"
              initValue={values.hsCode}
              setFieldValue={setFieldValue}
              values={values}
              validator={validator}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  initValue: initialValues[name],
                  label: 'HS CODE',
                })
              }
            </FormField>
            <FormField
              name="material"
              initValue={values.material}
              setFieldValue={setFieldValue}
              values={values}
              validator={validator}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  inputHandlers,
                  name,
                  isNew,
                  initValue: initialValues[name],
                  label: 'MATERIAL',
                })
              }
            </FormField>
            <div className={TagsInputStyle}>
              <Subscribe to={[ProductTagsContainer]}>
                {({ state: { tags }, setFieldValue: changeTags }) => (
                  <FieldItem
                    vertical
                    label={<Label>TAGS</Label>}
                    input={
                      <TagsInput
                        editable={isNew}
                        id="tags"
                        name="tags"
                        tagType="Product"
                        values={tags}
                        onChange={(field, value) => {
                          changeTags(field, value);
                        }}
                      />
                    }
                  />
                )}
              </Subscribe>
            </div>
            <div className={DividerStyle} />
          </GridColumn>
        </div>
      );
    }}
  </Subscribe>
);

export default ProductSection;
