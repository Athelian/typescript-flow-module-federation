// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormField } from 'modules/form';
import { textInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import { ProductInfoContainer, ProductTagsContainer } from 'modules/product/form/containers';
import validator from 'modules/product/form/validator';
import GridColumn from 'components/GridColumn';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import { FieldItem, Label, TagsInput, DashedPlusButton } from 'components/Form';
import {
  ProductSectionWrapperStyle,
  ProductImagesWrapperStyle,
  ProductImageWrapperStyle,
  ProductImageStyle,
  ViewImageButtonStyle,
  DeleteImageButtonStyle,
  SwapImageButtonStyle,
  ScrollFixStyle,
  TagsInputStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const ProductSection = ({ isNew }: Props) => (
  <Subscribe to={[ProductInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values = { ...initialValues, ...state };
      const { files } = values;

      return (
        <div className={ProductSectionWrapperStyle}>
          <div className={ProductImagesWrapperStyle(files.length > 3)}>
            {files.map(
              (image: Object, index: number): React.Node => (
                <div className={ProductImageWrapperStyle} key={image.id}>
                  <img className={ProductImageStyle} src={FALLBACK_IMAGE} alt="product_image" />
                  <button className={ViewImageButtonStyle} type="button">
                    <Icon icon="EXPAND" />
                  </button>
                  <button className={DeleteImageButtonStyle} type="button">
                    <Icon icon="REMOVE" />
                  </button>
                  {index !== 0 && (
                    <button className={SwapImageButtonStyle('left')} type="button">
                      <Icon icon="CHEVRON_DOUBLE_LEFT" />
                    </button>
                  )}
                  {index !== files.length - 1 && (
                    <button className={SwapImageButtonStyle('right')} type="button">
                      <Icon icon="CHEVRON_DOUBLE_RIGHT" />
                    </button>
                  )}
                </div>
              )
            )}
            <DashedPlusButton width="180px" height="180px" />
            {files.length > 3 && <div className={ScrollFixStyle} />}
          </div>
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
                  originalValue: initialValues[name],
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
                  originalValue: initialValues[name],
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
                  originalValue: initialValues[name],
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
                  originalValue: initialValues[name],
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
                  originalValue: initialValues[name],
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
