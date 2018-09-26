// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, FieldItem, Label, Tooltip } from 'components/Form';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import Tag from 'components/Tag';
import { FormField } from 'modules/form';
import messages from 'modules/tags/messages';
import ColorInput from 'components/Form/ColorInput';
import validator from './validator';
import EntityTypesInput from '../components/EntityTypesInput';
import { TagFormWrapperStyle, TagSectionWrapperStyle } from './style';
import { TagContainer, EntityTypeContainer } from './containers';

type Props = {
  isNew: boolean,
};

const defaultProps = {
  isNew: false,
};

export default function TagForm({ isNew }: Props) {
  return (
    <div className={TagFormWrapperStyle}>
      <SectionWrapper id="tagSection">
        <SectionHeader icon="TAGS" title="TAGS" />

        <div className={TagSectionWrapperStyle}>
          <Subscribe to={[TagContainer]}>
            {({ originalValues: initialValues, state, setFieldValue }) => {
              // $FlowFixMe
              const value = { ...initialValues, ...state };
              return (
                <>
                  <Tag tag={value} />
                  <FormField
                    name="name"
                    initValue={value.name}
                    setFieldValue={setFieldValue}
                    values={value}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) =>
                      textInputFactory({
                        inputHandlers,
                        name,
                        isNew,
                        required: true,
                        initValue: initialValues[name],
                        label: <FormattedMessage {...messages.name} />,
                      })
                    }
                  </FormField>
                  <FormField
                    name="description"
                    initValue={value.description}
                    setFieldValue={setFieldValue}
                    values={value}
                    validator={validator}
                  >
                    {({ name, ...inputHandlers }) =>
                      textAreaFactory({
                        inputHandlers,
                        name,
                        isNew,
                        height: '100px',
                        width: '300px',
                        initValue: initialValues[name],
                        label: <FormattedMessage {...messages.description} />,
                      })
                    }
                  </FormField>
                  <FormField
                    name="color"
                    initValue={value.color}
                    values={value}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) =>
                      textInputFactory({
                        inputHandlers,
                        name,
                        isNew,
                        required: true,
                        initValue: initialValues[name],
                        label: <FormattedMessage {...messages.color} />,
                        InputComponent: ColorInput,
                      })
                    }
                  </FormField>
                </>
              );
            }}
          </Subscribe>

          <Subscribe to={[EntityTypeContainer]}>
            {({ originalValues, state: { entityTypes }, toggleSelectType }) => (
              <FormField
                name="entityTypes"
                initValue={entityTypes}
                setFieldValue={(field, newValue) => toggleSelectType(newValue)}
              >
                {({ name, isTouched, errorMessage, ...inputHandlers }) => (
                  <FieldItem
                    label={<Label required>Types</Label>}
                    tooltip={
                      <Tooltip
                        isNew={isNew}
                        errorMessage={isTouched && errorMessage}
                        changedValues={{
                          oldValue: originalValues.entityTypes.sort().join(','),
                          newValue: inputHandlers.value.sort().join(','),
                        }}
                      />
                    }
                    input={
                      <EntityTypesInput
                        values={inputHandlers.value}
                        name={name}
                        onChange={toggleSelectType}
                      />
                    }
                  />
                )}
              </FormField>
            )}
          </Subscribe>
        </div>
      </SectionWrapper>
    </div>
  );
}

TagForm.defaultProps = defaultProps;
