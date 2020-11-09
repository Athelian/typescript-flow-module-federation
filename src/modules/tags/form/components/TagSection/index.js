// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { TAG_CREATE, TAG_UPDATE } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import { TagContainer, EntityTypeContainer } from 'modules/tags/form/containers';
import validator from 'modules/tags/form/validator';
import { FormField, FormContainer } from 'modules/form';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import {
  SectionHeader,
  SectionWrapper,
  LastModified,
  ColorInput,
  DefaultStyle,
  FieldItem,
  Label,
  FormTooltip,
  CheckboxInput,
  TextInput,
  TextInputFactory,
  TextAreaInputFactory,
} from 'components/Form';

import GridColumn from 'components/GridColumn';
import {
  CheckboxWrapperStyle,
  TagSectionWrapperStyle,
  PreviewTagWrapperStyle,
  DescriptionLabelWrapperStyle,
  ColorInputWrapperStyle,
  ColorInputButtonStyle,
  EntityTypesWrapperStyle,
  EntityTypeStyle,
  EntityIconStyle,
} from './style';

import messages from './messages';
import data from './tagOptionData';

type Props = {
  isNew: boolean,
  tag: Object,
};

const TagSection = ({ isNew, tag }: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TAG_CREATE);
  const allowUpdate = hasPermission(TAG_UPDATE);
  const allowCreateOrUpdate = allowCreate || allowUpdate;

  return (
    <Subscribe to={[TagContainer]}>
      {({ originalValues, state, setFieldValue }) => {
        const values = { ...originalValues, ...state };

        return (
          <SectionWrapper id="tag_tagSection">
            <SectionHeader
              icon="TAG"
              title={<FormattedMessage id="modules.Tags.tag" defaultMessage="TAG" />}
            >
              {!isNew && (
                <>
                  <LastModified updatedAt={tag.updatedAt} updatedBy={tag.updatedBy} />
                  {allowCreate && (
                    <CloneButton onClick={() => navigate(`/tags/clone/${encodeId(tag.id)}`)} />
                  )}
                </>
              )}
            </SectionHeader>
            <div className={TagSectionWrapperStyle}>
              <GridColumn>
                <>
                  <FieldItem
                    label={
                      <Label>
                        <FormattedMessage id="modules.Tags.preview" defaultMessage="PREVIEW" />
                      </Label>
                    }
                    input={
                      <div className={PreviewTagWrapperStyle}>
                        <Tag tag={values} />
                      </div>
                    }
                  />

                  <FormField
                    name="name"
                    initValue={values.name}
                    validator={validator}
                    values={values}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        required
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={originalValues[name]}
                        label={<FormattedMessage id="modules.Tags.name" defaultMessage="NAME" />}
                        editable={allowCreateOrUpdate}
                      />
                    )}
                  </FormField>

                  <FormField
                    validator={validator}
                    values={values}
                    name="description"
                    initValue={values.description}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextAreaInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={isNew}
                        originalValue={originalValues[name]}
                        label={
                          <div className={DescriptionLabelWrapperStyle}>
                            <FormattedMessage
                              id="modules.Tags.description"
                              defaultMessage="DESCRIPTION"
                            />
                          </div>
                        }
                        inputHeight="100px"
                        inputWidth="200px"
                        editable={allowCreateOrUpdate}
                        vertical={false}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="color"
                    initValue={values.color}
                    validator={validator}
                    values={values}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
                      <FieldItem
                        label={
                          <Label required>
                            <FormattedMessage id="modules.Tags.color" defaultMessage="COLOR" />
                          </Label>
                        }
                        tooltip={
                          <FormTooltip
                            isNew={isNew}
                            errorMessage={isTouched && errorMessage}
                            changedValues={{
                              oldValue: originalValues[name],
                              newValue: inputHandlers.value,
                            }}
                          />
                        }
                        input={
                          allowCreateOrUpdate ? (
                            <div className={ColorInputWrapperStyle}>
                              <DefaultStyle
                                isFocused={isFocused}
                                hasError={isTouched && errorMessage}
                                forceHoverStyle={isNew}
                                width="200px"
                              >
                                <TextInput
                                  name={name}
                                  {...inputHandlers}
                                  readOnly={!allowCreateOrUpdate}
                                />
                              </DefaultStyle>
                              <div className={ColorInputButtonStyle}>
                                <ColorInput
                                  name={name}
                                  {...inputHandlers}
                                  editable={allowCreateOrUpdate}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className={ColorInputWrapperStyle}>
                              <TextInput name={name} {...inputHandlers} readOnly />
                            </div>
                          )
                        }
                      />
                    )}
                  </FormField>
                </>

                <Subscribe to={[EntityTypeContainer, FormContainer]}>
                  {(
                    {
                      originalValues: entityTypesOriginalValues,
                      state: entityTypesState,
                      toggleSelectType,
                    },
                    { setFieldTouched }
                  ) => {
                    const { entityTypes: originalEntityTypes } = entityTypesOriginalValues;
                    const { entityTypes = [] } = entityTypesState;
                    const touchEntityTypes = () => setFieldTouched('entityTypes');

                    return (
                      <FormField
                        name="entityTypes"
                        initValue={originalEntityTypes}
                        values={entityTypes}
                      >
                        {({ name, isTouched, errorMessage, onChange, ...inputHandlers }) => (
                          <FieldItem
                            vertical
                            label={
                              <Label required>
                                <FormattedMessage
                                  id="modules.Tags.types"
                                  defaultMessage="APPLY TO"
                                />
                              </Label>
                            }
                            tooltip={
                              <FormTooltip
                                isNew={isNew}
                                errorMessage={
                                  originalEntityTypes.sort().join(',') !==
                                    inputHandlers.value.sort().join(',') &&
                                  entityTypes.length === 0 ? (
                                    <FormattedMessage
                                      id="modules.Tags.required"
                                      defaultMessage="Type is a required field"
                                    />
                                  ) : (
                                    ''
                                  )
                                }
                                changedValues={{
                                  oldValue: originalEntityTypes.sort().join(','),
                                  newValue: entityTypes.sort().join(','),
                                }}
                              />
                            }
                            input={
                              <div className={EntityTypesWrapperStyle}>
                                <>
                                  {data.map(checkboxData => (
                                    <div key={checkboxData.key} className={CheckboxWrapperStyle}>
                                      <CheckboxInput
                                        data-testid={checkboxData.testId || ''}
                                        checked={entityTypes.includes(checkboxData.key)}
                                        onToggle={() => {
                                          toggleSelectType(checkboxData.key);
                                          touchEntityTypes();
                                        }}
                                        editable={allowCreateOrUpdate}
                                      />
                                      <button
                                        className={EntityTypeStyle}
                                        onClick={e => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          toggleSelectType(checkboxData.key);
                                          touchEntityTypes();
                                        }}
                                        type="button"
                                      >
                                        <div className={EntityIconStyle(checkboxData.iconName)}>
                                          <Icon icon={checkboxData.iconName} />
                                        </div>
                                        <Label>
                                          <FormattedMessage {...messages[checkboxData.messageId]} />
                                        </Label>
                                      </button>
                                    </div>
                                  ))}
                                </>
                              </div>
                            }
                          />
                        )}
                      </FormField>
                    );
                  }}
                </Subscribe>
              </GridColumn>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};
export default TagSection;
