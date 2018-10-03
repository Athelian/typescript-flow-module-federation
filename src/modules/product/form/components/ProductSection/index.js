// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { FormField } from 'modules/form';
import { textInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import { ProductInfoContainer, ProductTagsContainer } from 'modules/product/form/containers';
import validator from 'modules/product/form/validator';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, TagsInput, ImagesUploadInput } from 'components/Form';
import ImagePreviewDialog from 'components/Dialog/ImagePreviewDialog';
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

const swapItems = (items: Array<Object>, from: number, to: number) => {
  const cloneItems = items.slice(0);
  const fromItem = cloneItems[from];
  const toItem = cloneItems[to];
  cloneItems.splice(from, 1, toItem);
  cloneItems.splice(to, 1, fromItem);
  return cloneItems;
};

const ProductSection = ({ isNew }: Props) => (
  <Subscribe to={[ProductInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values = { ...initialValues, ...state };
      const { files } = values;

      return (
        <div className={ProductSectionWrapperStyle}>
          <div className={ProductImagesWrapperStyle(files.length)}>
            <ObjectValue>
              {({ value: selectedImage, set: changeSelectedImage }) => (
                <BooleanValue>
                  {({ value: isOpen, set: dialogToggle }) => (
                    <>
                      {files.map(({ path, name, id }, index) => (
                        <div className={ProductImageWrapperStyle} key={id}>
                          <img className={ProductImageStyle} src={path} alt={name} />
                          <button
                            className={ViewImageButtonStyle}
                            type="button"
                            onClick={() => {
                              changeSelectedImage(files[index]);
                              dialogToggle(true);
                            }}
                          >
                            <Icon icon="EXPAND" />
                          </button>
                          <button
                            className={DeleteImageButtonStyle}
                            type="button"
                            onClick={() =>
                              setFieldValue('files', files.filter(item => item.id !== id))
                            }
                          >
                            <Icon icon="REMOVE" />
                          </button>
                          {index !== 0 && (
                            <button
                              className={SwapImageButtonStyle('left')}
                              type="button"
                              onClick={() =>
                                setFieldValue('files', swapItems(files, index, index - 1))
                              }
                            >
                              <Icon icon="CHEVRON_DOUBLE_LEFT" />
                            </button>
                          )}
                          {index !== files.length - 1 && (
                            <button
                              className={SwapImageButtonStyle('right')}
                              type="button"
                              onClick={() =>
                                setFieldValue('files', swapItems(files, index, index + 1))
                              }
                            >
                              <Icon icon="CHEVRON_DOUBLE_RIGHT" />
                            </button>
                          )}
                        </div>
                      ))}
                      <ImagePreviewDialog
                        isOpen={isOpen}
                        onRequestClose={() => dialogToggle(false)}
                        width={800}
                        image={selectedImage}
                      />
                      <ImagesUploadInput
                        id="files"
                        name="files"
                        values={files}
                        onChange={setFieldValue}
                        height="180px"
                        width={files.length > 0 ? '120px' : '180px'}
                      />
                      {files.length > 3 && <div className={ScrollFixStyle} />}
                    </>
                  )}
                </BooleanValue>
              )}
            </ObjectValue>
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
                  label: <FormattedMessage id="modules.product.name" defaultMessage="NAME" />,
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
                  label: <FormattedMessage id="modules.product.serial" defaultMessage="SERIAL" />,
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
                  label: (
                    <FormattedMessage id="modules.product.janCode" defaultMessage="JAN CODE" />
                  ),
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
                  label: <FormattedMessage id="modules.product.hsCode" defaultMessage="HS CODE" />,
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
                  label: (
                    <FormattedMessage id="modules.product.material" defaultMessage="MATERIAL" />
                  ),
                })
              }
            </FormField>
            <div className={TagsInputStyle}>
              <Subscribe to={[ProductTagsContainer]}>
                {({ state: { tags }, setFieldValue: changeTags }) => (
                  <FieldItem
                    vertical
                    label={
                      <Label>
                        <FormattedMessage id="modules.product.tags" defaultMessage="TAGS" />
                      </Label>
                    }
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
