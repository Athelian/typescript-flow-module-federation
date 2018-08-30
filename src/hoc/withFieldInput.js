// @flow
import * as React from 'react';

type Props = {
  name: string,
  setFieldValue: (field: string, value: mixed, runValidation: boolean) => void,
  setFieldTouched: (field: string, status: boolean) => void,
  setActiveField: (field: string) => void,
};

export default function withFieldInput(
  WrappedComponent: React.ComponentType<any>,
  runValidation: boolean = true
) {
  return class FieldInputWrappedComponent extends React.Component<Props> {
    onChange = (event: SyntheticInputEvent<*>): void => {
      if (event.persist) {
        event.persist();
      }

      const { name, value } = event.target;
      const { setFieldValue } = this.props;

      setFieldValue(name, value, runValidation);
    };

    onBlur = (event: SyntheticFocusEvent<*>) => {
      if (event.persist) {
        event.persist();
      }

      const { name, setFieldTouched, setActiveField } = this.props;

      setFieldTouched(name, true);
      setActiveField('');
    };

    onFocus = (event: SyntheticFocusEvent<*>) => {
      if (event.persist) {
        event.persist();
      }
      const { name, setActiveField } = this.props;
      setActiveField(name);
    };

    render() {
      return (
        <WrappedComponent
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onChange={this.onChange}
          {...this.props}
        />
      );
    }
  };
}
