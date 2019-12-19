// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
// import { useViewerHasPermissions } from 'contexts/Permissions';
// import { TEMPLATE_CREATE, TEMPLATE_UPDATE } from 'modules/permission/constants/template';
import validator from 'modules/tableTemplate/form/validator';
import { FormField } from 'modules/form';
import {
  SelectInputFactory,
  EnumSelectInputFactory,
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
import { computeIcon, getFileExtension, getFileName } from 'components/Form/DocumentsInput/helpers';
import { Section } from 'components/Sections';
import { FileInfoWrapperStyle, FileIconStyle, FileNameWrapperStyle, FileNameStyle } from './style';

const DocumentSection = () => {
  const { state, originalState, setFieldValue } = DocumentFormContainer.useContainer();
  const intl = useIntl();

  // const hasPermissions = useViewerHasPermissions();
  // const canUpdate = hasPermissions(blahblah);
  // TODO: Replace with real permissions
  const canUpdate = true;

  const getFormFieldProps = (name: string) => {
    return {
      name,
      initValue: originalState[name],
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
          <FormField {...getFormFieldProps('type')}>
            {inputHandlers => (
              <SelectInputFactory
                {...inputHandlers}
                label={<FormattedMessage id="modules.Documents.type" defaultMessage="Type" />}
                editable={canUpdate}
                originalValue={originalState.type}
                required
                items={getFileTypesByEntity(state.entity?.__typename, intl)}
              />
            )}
          </FormField>

          <FormField {...getFormFieldProps('status')}>
            {({ ...inputHandlers }) => (
              <EnumSelectInputFactory
                {...inputHandlers}
                label={<FormattedMessage id="modules.Documents.status" defaultMessage="Status" />}
                editable={canUpdate}
                originalValue={originalState.status}
                required
                enumType="FileStatus"
              />
            )}
          </FormField>

          <FormField {...getFormFieldProps('memo')}>
            {inputHandlers => (
              <TextAreaInputFactory
                {...inputHandlers}
                label={<FormattedMessage id="modules.Documents.memo" defaultMessage="Memo" />}
                editable={canUpdate}
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
