// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEntityHasPermissions } from 'contexts/Permissions';
import {
  DOCUMENT_UPDATE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_SET_TAGS,
  DOCUMENT_SET_MEMO,
} from 'modules/permission/constants/file';
import { TAG_LIST } from 'modules/permission/constants/tag';
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
            {inputHandlers => (
              <SelectInputFactory
                {...inputHandlers}
                label={<FormattedMessage id="modules.Documents.type" defaultMessage="Type" />}
                editable={canUpdate || hasPermissions(DOCUMENT_SET_TYPE)}
                originalValue={originalState.type}
                required
                items={getFileTypesByEntity(state.entity?.__typename, intl)}
              />
            )}
          </FormField>

          <FieldItem
            vertical
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Documents.tags" defaultMessage="Tags" />
              </Label>
            }
            input={
              <TagsInput
                id="tags"
                name="tags"
                tagType="File"
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
                  set: hasPermissions(TAG_LIST) && (canUpdate || hasPermissions(DOCUMENT_SET_TAGS)),
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
            disabled={!canUpdate}
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
