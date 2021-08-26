// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEntityHasPermissions } from 'contexts/Permissions';
import {
  DOCUMENT_UPDATE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_SET_TAGS,
  DOCUMENT_SET_MEMO,
  DOCUMENT_DOWNLOAD,
} from 'modules/permission/constants/file';
import { ORDER_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/order';
import { ORDER_ITEMS_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/orderItem';
import { SHIPMENT_DOCUMENT_DOWNLOAD } from 'modules/permission/constants/shipment';
import { PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/product';
import { MILESTONE_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/milestone';
import { TAG_GET } from 'modules/permission/constants/tag';
import validator from 'modules/tableTemplate/form/validator';
import { FormField } from 'modules/form';
import {
  SelectInputFactory,
  TagsInput,
  TextAreaInputFactory,
  SectionHeader,
  LastModified,
  FieldItem,
  Display,
  Label,
} from 'components/Form';
import { BaseButton } from 'components/Buttons';
import FormattedBytes from 'components/FormattedBytes';
import { Tooltip } from 'components/Tooltip';
import GridColumn from 'components/GridColumn';
import Icon from 'components/Icon';
import DocumentFormContainer from 'modules/document/form/container';
import { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import {
  computeIcon,
  getFileExtension,
  getFileName,
} from 'components/Form/DocumentsUpload/helpers';
import { Section } from 'components/Sections';
import { FileInfoWrapperStyle, FileIconStyle, FileNameWrapperStyle, FileNameStyle } from './style';

const DocumentSection = () => {
  const { state, originalState, setFieldValue } = DocumentFormContainer.useContainer();
  const intl = useIntl();

  const hasPermissions = useEntityHasPermissions(state);
  const canUpdate = hasPermissions(DOCUMENT_UPDATE);
  const canDownload =
    hasPermissions(DOCUMENT_DOWNLOAD) ||
    (state.entity?.__typename === 'Order' && hasPermissions(ORDER_DOWNLOAD_DOCUMENTS)) ||
    (state.entity?.__typename === 'OrderItem' && hasPermissions(ORDER_ITEMS_DOWNLOAD_DOCUMENTS)) ||
    (state.entity?.__typename === 'Shipment' && hasPermissions(SHIPMENT_DOCUMENT_DOWNLOAD)) ||
    (state.entity?.__typename === 'ProductProvider' &&
      hasPermissions(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS)) ||
    (state.entity?.__typename === 'Milestone' && hasPermissions(MILESTONE_DOWNLOAD_DOCUMENTS));

  const getFormFieldProps = (name: string) => {
    return {
      name,
      initValue: state[name],
      validator,
      values: state,
      setFieldValue,
    };
  };

  const fileExtension = getFileExtension(state.name);
  const fileName = getFileName(state.name);
  const fileIcon = computeIcon(fileExtension);

  const fileTypeOptions = getFileTypesByEntity(state.entity?.__typename, intl);

  return (
    <>
      <SectionHeader
        icon="DOCUMENT"
        title={
          <FormattedMessage id="modules.Documents.documentSection" defaultMessage="Document" />
        }
      >
        {state.updatedAt && state.updatedBy && (
          <>
            <LastModified updatedAt={state.updatedAt} updatedBy={state.updatedBy} />
          </>
        )}
      </SectionHeader>

      <Section>
        <GridColumn>
          <FormField {...getFormFieldProps('type')} saveOnChange>
            {({ value, ...inputHandlers }) => (
              <SelectInputFactory
                value={fileTypeOptions ? value : null}
                {...inputHandlers}
                label={<FormattedMessage id="modules.Documents.type" defaultMessage="Type" />}
                editable={canUpdate || hasPermissions(DOCUMENT_SET_TYPE)}
                originalValue={originalState.type}
                required
                items={fileTypeOptions ?? []}
              />
            )}
          </FormField>
          {console.log('state.ownedBy?.id', state.ownedBy?.id)}
          <FieldItem
            vertical
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Documents.tags" defaultMessage="Tags" />
              </Label>
            }
            input={
              <TagsInput
                name="tags"
                tagType="File"
                entityOwnerId={state.ownedBy?.id}
                values={state.tags}
                onChange={value => {
                  setFieldValue('tags', value);
                }}
                onClickRemove={value => {
                  setFieldValue(
                    'tags',
                    state.tags.filter(({ id }) => id !== value.id)
                  );
                }}
                editable={{
                  set: hasPermissions(TAG_GET) && (canUpdate || hasPermissions(DOCUMENT_SET_TAGS)),
                  remove: canUpdate || hasPermissions(DOCUMENT_SET_TAGS),
                }}
              />
            }
          />

          <FormField {...getFormFieldProps('memo')}>
            {inputHandlers => (
              <TextAreaInputFactory
                {...inputHandlers}
                label={
                  <FormattedMessage
                    id="modules.Documents.description"
                    defaultMessage="Description"
                  />
                }
                editable={canUpdate || hasPermissions(DOCUMENT_SET_MEMO)}
                originalValue={originalState.memo}
                inputWidth="400px"
              />
            )}
          </FormField>
        </GridColumn>

        <div className={FileInfoWrapperStyle}>
          <GridColumn gap="10px">
            <div className={FileIconStyle(fileIcon.color)}>
              <Icon icon={fileIcon.icon} />
            </div>

            <FieldItem
              label={
                <Label width="80px">
                  <FormattedMessage id="modules.Documents.filename" defaultMessage="Filename" />
                </Label>
              }
              input={
                <Tooltip message={`${fileName}.${fileExtension}`}>
                  <div className={FileNameWrapperStyle}>
                    <div className={FileNameStyle}>{fileName}</div>
                    {`.${fileExtension}`}
                  </div>
                </Tooltip>
              }
            />

            <FieldItem
              label={
                <Label width="80px">
                  <FormattedMessage id="modules.Documents.fileSize" defaultMessage="File Size" />
                </Label>
              }
              input={
                <Display>
                  <FormattedBytes value={state.size} />
                </Display>
              }
            />
          </GridColumn>

          <BaseButton
            label={<FormattedMessage id="modules.Documents.download" defaultMessage="Download" />}
            icon="DOWNLOAD"
            textColor="GRAY_DARK"
            hoverTextColor="TEAL"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_VERY_LIGHT"
            disabled={!canDownload}
            onClick={() => {
              window.open(state.path, '_blank');
            }}
          />
        </div>
      </Section>
    </>
  );
};
export default DocumentSection;
