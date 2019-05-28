// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { encodeId } from 'utils/id';
import usePermission from 'hooks/usePermission';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { CloneButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import {
  ProductInfoContainer,
  ProductFilesContainer,
  ProductTagsContainer,
} from 'modules/product/form/containers';
import validator from 'modules/product/form/validator';
import GridColumn from 'components/GridColumn';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { PRODUCT_CREATE, PRODUCT_UPDATE } from 'modules/permission/constants/product';
import {
  SectionHeader,
  LastModified,
  StatusToggle,
  FieldItem,
  Label,
  TagsInput,
  ImagesUploadInput,
  TextInputFactory,
  CustomFieldsFactory,
  TextAreaInputFactory,
} from 'components/Form';
import ImagePreviewDialog from 'components/Dialog/ImagePreviewDialog';
import {
  ProductSectionWrapperStyle,
  ProductImagesWrapperStyle,
  ProductImageWrapperStyle,
  ProductImageStyle,
  ViewImageButtonStyle,
  MainFieldsWrapperStyle,
  DeleteImageButtonStyle,
  SwapImageButtonStyle,
  ScrollFixStyle,
  TagsInputStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
  isOwner: boolean,
  product: Object,
};

const swapItems = (items: Array<Object>, from: number, to: number) => {
  const cloneItems = items.slice(0);
  const fromItem = cloneItems[from];
  const toItem = cloneItems[to];
  cloneItems.splice(from, 1, toItem);
  cloneItems.splice(to, 1, fromItem);
  return cloneItems;
};

const ProductSection = ({ isNew, isOwner, product }: Props) => {
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(PRODUCT_UPDATE);
  const { updatedAt, updatedBy, archived } = product;
  return (
    <>
      <SectionHeader
        icon="PRODUCT"
        title={<FormattedMessage id="modules.Products.product" defaultMessage="PRODUCT" />}
      >
        {!isNew && (
          <>
            <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
            <BooleanValue>
              {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                <StatusToggle
                  readOnly={!hasPermission(PRODUCT_UPDATE)}
                  archived={archived}
                  openStatusDialog={() => dialogToggle(true)}
                  activateDialog={
                    <ProductActivateDialog
                      product={product}
                      isOpen={statusDialogIsOpen && !!archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                  archiveDialog={
                    <ProductArchiveDialog
                      product={product}
                      isOpen={statusDialogIsOpen && !archived}
                      onRequestClose={() => dialogToggle(false)}
                    />
                  }
                />
              )}
            </BooleanValue>
            {hasPermission(PRODUCT_CREATE) && (
              <CloneButton onClick={() => navigate(`/product/clone/${encodeId(product.id)}`)} />
            )}
          </>
        )}
      </SectionHeader>
      <Subscribe to={[ProductInfoContainer]}>
        {({ originalValues: initialValues, state, setFieldValue }) => {
          const values = { ...initialValues, ...state };
          const { importer } = values;
          return (
            <div className={ProductSectionWrapperStyle}>
              <Subscribe to={[ProductFilesContainer]}>
                {({ state: { files }, setFieldValue: changeFiles }) => (
                  <div className={ProductImagesWrapperStyle(files.length)}>
                    <ObjectValue>
                      {({ value: selectedImage, set: changeSelectedImage }) => (
                        <BooleanValue>
                          {({ value: isOpen, set: dialogToggle }) => (
                            <>
                              {files.map(({ path, pathMedium, name, id }, index) => (
                                <div className={ProductImageWrapperStyle} key={id}>
                                  <img
                                    className={ProductImageStyle}
                                    src={pathMedium || path}
                                    alt={name}
                                  />
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
                                  <ImagePreviewDialog
                                    isOpen={isOpen}
                                    onRequestClose={() => dialogToggle(false)}
                                    image={selectedImage}
                                  />
                                  {allowUpdate && (
                                    <>
                                      <button
                                        className={DeleteImageButtonStyle}
                                        type="button"
                                        onClick={() =>
                                          changeFiles('files', files.filter(item => item.id !== id))
                                        }
                                      >
                                        <Icon icon="REMOVE" />
                                      </button>
                                      {index !== 0 && (
                                        <button
                                          className={SwapImageButtonStyle('left')}
                                          type="button"
                                          onClick={() =>
                                            changeFiles('files', swapItems(files, index, index - 1))
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
                                            changeFiles('files', swapItems(files, index, index + 1))
                                          }
                                        >
                                          <Icon icon="CHEVRON_DOUBLE_RIGHT" />
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                              {allowUpdate && (
                                <ImagesUploadInput
                                  id="files"
                                  name="files"
                                  values={files}
                                  onChange={changeFiles}
                                  height="180px"
                                  width={files.length > 0 ? '120px' : '180px'}
                                />
                              )}
                              {files.length > 3 && <div className={ScrollFixStyle} />}
                            </>
                          )}
                        </BooleanValue>
                      )}
                    </ObjectValue>
                  </div>
                )}
              </Subscribe>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
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
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="serial"
                    initValue={values.serial}
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
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="janCode"
                    initValue={values.janCode}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.Products.janCode"
                            defaultMessage="JAN CODE"
                          />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="hsCode"
                    initValue={values.hsCode}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage id="modules.Products.hsCode" defaultMessage="HS CODE" />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="material"
                    initValue={values.material}
                    setFieldValue={setFieldValue}
                    values={values}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={initialValues[name]}
                        label={
                          <FormattedMessage
                            id="modules.Products.material"
                            defaultMessage="MATERIAL"
                          />
                        }
                        editable={allowUpdate}
                      />
                    )}
                  </FormField>
                  <CustomFieldsFactory
                    entityType="Product"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={{
                      values: allowUpdate,
                      mask: allowUpdate,
                    }}
                  />
                  <div className={TagsInputStyle}>
                    <Subscribe to={[ProductTagsContainer]}>
                      {({ state: { tags }, setFieldValue: changeTags }) => (
                        <FieldItem
                          vertical
                          label={
                            <Label height="30px">
                              <FormattedMessage id="modules.Products.tags" defaultMessage="TAGS" />
                            </Label>
                          }
                          input={
                            <TagsInput
                              id="tags"
                              name="tags"
                              tagType="Product"
                              values={tags}
                              onChange={(field, value) => {
                                changeTags(field, value);
                              }}
                              editable={{
                                set: hasPermission(TAG_LIST) && hasPermission(PRODUCT_UPDATE),
                                remove: hasPermission(PRODUCT_UPDATE),
                              }}
                            />
                          }
                        />
                      )}
                    </Subscribe>
                  </div>

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
                        originalValue={initialValues[name]}
                        label={<FormattedMessage id="modules.Product.memo" defaultMessage="MEMO" />}
                        inputWidth="400px"
                        inputHeight="120px"
                      />
                    )}
                  </FormField>
                </GridColumn>
                <GridColumn>
                  <FieldItem
                    vertical
                    label={
                      <Label required>
                        <FormattedMessage
                          id="modules.Products.importer"
                          defaultMessage="IMPORTER"
                        />
                      </Label>
                    }
                    input={<PartnerCard partner={importer} readOnly />}
                  />
                </GridColumn>
              </div>
              <div className={DividerStyle} />
            </div>
          );
        }}
      </Subscribe>
    </>
  );
};

export default ProductSection;
