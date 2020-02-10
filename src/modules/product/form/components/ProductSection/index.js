// @flow
import * as React from 'react';
import type { ProductPayload } from 'generated/graphql';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { encodeId } from 'utils/id';
import { getByPath } from 'utils/fp';
import { isForbidden } from 'utils/data';
import usePermission from 'hooks/usePermission';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import Followers from 'components/Followers';
import ProductImage from 'components/ProductImage';
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
import { DOCUMENT_CREATE, DOCUMENT_DELETE } from 'modules/permission/constants/file';
import {
  PRODUCT_CREATE,
  PRODUCT_UPDATE,
  PRODUCT_SET_ARCHIVED,
  PRODUCT_SET_NAME,
  PRODUCT_SET_SERIAL,
  PRODUCT_SET_JAN_CODE,
  PRODUCT_SET_HS_CODE,
  PRODUCT_SET_MATERIAL,
  PRODUCT_SET_CUSTOM_FIELDS,
  PRODUCT_SET_CUSTOM_FIELDS_MASK,
  PRODUCT_SET_TAGS,
  PRODUCT_SET_MEMO,
  PRODUCT_SET_DOCUMENTS,
  PRODUCT_SET_FOLLOWERS,
  PRODUCT_DOCUMENT_CREATE,
  PRODUCT_DOCUMENT_DELETE,
} from 'modules/permission/constants/product';
import {
  SectionHeader,
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
} from './style';

type Props = {
  isNew: boolean,
  isOwner: boolean,
  product: ProductPayload,
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
  const archived = getByPath('archived', product);
  return (
    <>
      <SectionHeader
        icon="PRODUCT"
        title={<FormattedMessage id="modules.Products.product" defaultMessage="PRODUCT" />}
      >
        <Subscribe to={[ProductInfoContainer]}>
          {({ originalValues: initialValues, state, setFieldValue }) => {
            const values = { ...initialValues, ...state };
            return (
              <Followers
                followers={values?.followers ?? []}
                setFollowers={value => setFieldValue('followers', value)}
                organizationIds={[values?.importer?.id].filter(Boolean)}
                editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_FOLLOWERS])}
              />
            );
          }}
        </Subscribe>

        {!isNew && (
          <>
            <BooleanValue>
              {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                <StatusToggle
                  readOnly={!hasPermission(PRODUCT_UPDATE) && !hasPermission(PRODUCT_SET_ARCHIVED)}
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
              <CloneButton
                onClick={() => navigate(`/product/clone/${encodeId(getByPath('id', product))}`)}
              />
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
                              {files.map((file, index) => (
                                <div
                                  className={ProductImageWrapperStyle}
                                  key={getByPath('id', file)}
                                >
                                  <ProductImage
                                    file={file}
                                    className={ProductImageStyle}
                                    height="180px"
                                  />
                                  {!isForbidden(file) && (
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
                                  )}
                                  <ImagePreviewDialog
                                    isOpen={isOpen}
                                    onRequestClose={() => dialogToggle(false)}
                                    image={selectedImage}
                                  />
                                  {hasPermission([
                                    PRODUCT_DOCUMENT_DELETE,
                                    DOCUMENT_DELETE,
                                    PRODUCT_SET_DOCUMENTS,
                                  ]) && (
                                    <>
                                      {!isForbidden(file) && (
                                        <button
                                          className={DeleteImageButtonStyle}
                                          type="button"
                                          onClick={() =>
                                            changeFiles(
                                              'files',
                                              files.filter(
                                                item => item.id !== getByPath('id', file)
                                              )
                                            )
                                          }
                                        >
                                          <Icon icon="REMOVE" />
                                        </button>
                                      )}
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
                              {hasPermission([
                                PRODUCT_DOCUMENT_CREATE,
                                DOCUMENT_CREATE,
                                PRODUCT_SET_DOCUMENTS,
                              ]) && (
                                <ImagesUploadInput
                                  files={files}
                                  onSave={updateFiles => changeFiles('files', updateFiles)}
                                  height="180px"
                                  width="180px"
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
                          <FormattedMessage id="modules.Products.name" defaultMessage="Name" />
                        }
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_NAME])}
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
                          <FormattedMessage id="modules.Products.serial" defaultMessage="Serial" />
                        }
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_SERIAL])}
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
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_JAN_CODE])}
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
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_HS_CODE])}
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
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_MATERIAL])}
                      />
                    )}
                  </FormField>
                  <CustomFieldsFactory
                    entityType="Product"
                    customFields={values.customFields}
                    setFieldValue={setFieldValue}
                    editable={{
                      values: hasPermission([PRODUCT_UPDATE, PRODUCT_SET_CUSTOM_FIELDS]),
                      mask: hasPermission([PRODUCT_UPDATE, PRODUCT_SET_CUSTOM_FIELDS_MASK]),
                    }}
                  />

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
                            onChange={value => {
                              changeTags('tags', value);
                            }}
                            onClickRemove={value => {
                              changeTags(
                                'tags',
                                tags.filter(({ id }) => id !== value.id)
                              );
                            }}
                            editable={{
                              set:
                                hasPermission(TAG_LIST) &&
                                hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TAGS]),
                              remove: hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TAGS]),
                            }}
                          />
                        }
                      />
                    )}
                  </Subscribe>

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
                        editable={hasPermission([PRODUCT_UPDATE, PRODUCT_SET_MEMO])}
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
            </div>
          );
        }}
      </Subscribe>
    </>
  );
};

export default ProductSection;
