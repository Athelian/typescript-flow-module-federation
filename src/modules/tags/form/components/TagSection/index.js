// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { TAG_CREATE, TAG_UPDATE } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import { TagContainer, EntityTypeContainer } from 'modules/tags/form/containers';
import validator from 'modules/tags/form/validator';
import { FormField } from 'modules/form';
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
  RadioInput,
  TextInput,
  TextInputFactory,
  TextAreaInputFactory,
} from 'components/Form';

import GridColumn from 'components/GridColumn';
import {
  TagSectionWrapperStyle,
  PreviewTagWrapperStyle,
  DescriptionLabelWrapperStyle,
  ColorInputWrapperStyle,
  ColorInputButtonStyle,
  EntityTypesWrapperStyle,
  EntityTypeStyle,
  EntityIconStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const TagSection = ({ isNew }: Props) => {
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
                  <LastModified
                    updatedAt={originalValues.updatedAt}
                    updatedBy={originalValues.updatedBy}
                  />
                  {allowCreate && (
                    <CloneButton
                      onClick={() => navigate(`/tags/clone/${encodeId(originalValues.id)}`)}
                    />
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
                        inputAlign="right"
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

                <Subscribe to={[EntityTypeContainer]}>
                  {({
                    originalValues: entityTypeValues,
                    state: entityTypeState,
                    toggleSelectType,
                  }) => {
                    const entityTypeValue = { ...entityTypeValues, ...entityTypeState };

                    return (
                      <FormField
                        name="entityTypes"
                        initValue={entityTypeValue.entityTypes}
                        setFieldValue={(field, newValue) => toggleSelectType(newValue)}
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
                                  entityTypeValues.entityTypes.sort().join(',') !==
                                    inputHandlers.value.sort().join(',') &&
                                  entityTypeValue.entityTypes.length === 0 ? (
                                    <FormattedMessage
                                      id="modules.Tags.required"
                                      defaultMessage="Type is a required field"
                                    />
                                  ) : (
                                    ''
                                  )
                                }
                                changedValues={{
                                  oldValue: entityTypeValues.entityTypes.sort().join(','),
                                  newValue: inputHandlers.value.sort().join(','),
                                }}
                              />
                            }
                            input={
                              <div className={EntityTypesWrapperStyle}>
                                <RadioInput
                                  data-testid="orderRadio"
                                  selected={entityTypeValue.entityTypes.includes('Order')}
                                  onToggle={() => toggleSelectType('Order')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('ORDER')}>
                                      <Icon icon="ORDER" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.order"
                                        defaultMessage="ORDER"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>
                                <RadioInput
                                  selected={entityTypeValue.entityTypes.includes('Batch')}
                                  onToggle={() => toggleSelectType('Batch')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('BATCH')}>
                                      <Icon icon="BATCH" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.batch"
                                        defaultMessage="BATCH"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={entityTypeValue.entityTypes.includes('Shipment')}
                                  onToggle={() => toggleSelectType('Shipment')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('SHIPMENT')}>
                                      <Icon icon="SHIPMENT" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.shipment"
                                        defaultMessage="SHIPMENT"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>
                                <RadioInput
                                  selected={entityTypeValue.entityTypes.includes('Product')}
                                  onToggle={() => toggleSelectType('Product')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('PRODUCT')}>
                                      <Icon icon="PRODUCT" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.product"
                                        defaultMessage="PRODUCT"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={entityTypeValue.entityTypes.includes('User')}
                                  onToggle={() => toggleSelectType('User')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('STAFF')}>
                                      <Icon icon="STAFF" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.staff"
                                        defaultMessage="STAFF"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={entityTypeValue.entityTypes.includes('Container')}
                                  onToggle={() => toggleSelectType('Container')}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('CONTAINER')}>
                                      <Icon icon="CONTAINER" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.container"
                                        defaultMessage="CONTAINER"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>
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
