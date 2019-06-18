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
                                <RadioInput
                                  data-testid="orderRadio"
                                  selected={entityTypes.includes('Order')}
                                  onToggle={() => {
                                    toggleSelectType('Order');
                                    touchEntityTypes();
                                  }}
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
                                  selected={entityTypes.includes('OrderItem')}
                                  onToggle={() => {
                                    toggleSelectType('OrderItem');
                                    touchEntityTypes();
                                  }}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('ORDER_ITEM')}>
                                      <Icon icon="ORDER_ITEM" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.orderItem"
                                        defaultMessage="ORDER ITEM"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>
                                <RadioInput
                                  selected={entityTypes.includes('Batch')}
                                  onToggle={() => {
                                    toggleSelectType('Batch');
                                    touchEntityTypes();
                                  }}
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
                                  selected={entityTypes.includes('Shipment')}
                                  onToggle={() => {
                                    toggleSelectType('Shipment');
                                    touchEntityTypes();
                                  }}
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
                                  selected={entityTypes.includes('Product')}
                                  onToggle={() => {
                                    toggleSelectType('Product');
                                    touchEntityTypes();
                                  }}
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
                                  selected={entityTypes.includes('User')}
                                  onToggle={() => {
                                    toggleSelectType('User');
                                    touchEntityTypes();
                                  }}
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
                                  selected={entityTypes.includes('Container')}
                                  onToggle={() => {
                                    toggleSelectType('Container');
                                    touchEntityTypes();
                                  }}
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
                                <RadioInput
                                  selected={entityTypes.includes('Task')}
                                  onToggle={() => {
                                    toggleSelectType('Task');
                                    touchEntityTypes();
                                  }}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('TASK')}>
                                      <Icon icon="TASK" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.task"
                                        defaultMessage="TASK"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={entityTypes.includes('Project')}
                                  onToggle={() => {
                                    toggleSelectType('Project');
                                    touchEntityTypes();
                                  }}
                                  editable={allowCreateOrUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('PROJECT')}>
                                      <Icon icon="PROJECT" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.Tags.project"
                                        defaultMessage="PROJECT"
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
