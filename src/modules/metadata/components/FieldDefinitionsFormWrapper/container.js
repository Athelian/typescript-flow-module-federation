// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName, cleanUpData } from 'utils/data';

type FormState = {
  fieldDefinitions: Array<Object>,
};

const initValues = {
  fieldDefinitions: [],
};

export default class FieldDefinitionContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  haveValidNewDefinitions = () => {
    const newFieldDefinitions = this.state.fieldDefinitions.filter(
      definition => definition.isNew && !definition.isSent
    );

    // if no new field definition then not valid
    if (!newFieldDefinitions.length) {
      return false;
    }

    // if one of new definitions has value then valid
    return newFieldDefinitions.some(fieldDefinition => !!fieldDefinition.name);
  };

  isDirty = () => {
    const stateWithoutNewDefinitions = {
      ...this.state,
      fieldDefinitions: this.state.fieldDefinitions.filter(
        definition => definition.isSent || !definition.isNew
      ),
    };

    return (
      !isEquals(
        cleanFalsyAndTypeName(stateWithoutNewDefinitions),
        cleanFalsyAndTypeName(this.originalValues)
      ) || this.haveValidNewDefinitions()
    );
  };

  onReset = () => {
    this.setState(this.originalValues);
  };

  onSuccess = () => {
    const newValues = { ...this.state };

    newValues.fieldDefinitions = newValues.fieldDefinitions
      .filter(fieldDefinition => !!fieldDefinition.name)
      .map(fieldDefinition => {
        if (fieldDefinition.isNew && !fieldDefinition.isSent) {
          return {
            ...fieldDefinition,
            isSent: true,
          };
        }

        return fieldDefinition;
      });

    this.originalValues = newValues;
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = cleanUpData(values);
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };
}
