// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isEquals, getByPath } from 'utils/fp';
import validator from 'modules/warehouse/form/validator';
import { SectionHeader, SectionWrapper, DefaultSurfaceStyle } from 'components/Form';
import { FormField } from 'modules/form';
import {
  textInputFactory,
  selectSearchEnumInputFactory,
  numberInputFactory,
} from 'modules/form/helpers';
import WarehouseContainer from 'modules/warehouse/form/containers';
import type { FormState } from 'modules/warehouse/form/containers';
import messages from 'modules/warehouse/messages';
import { FormWrapperStyle, SectionWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  warehouse: Object,
  onDetailReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  warehouse: {},
  onDetailReady: () => {},
};

class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { warehouse } = this.props;

    return !isEquals(warehouse, nextProps.warehouse);
  }

  render() {
    const { isNew } = this.props;

    return (
      <div className={FormWrapperStyle}>
        <SectionWrapper id="tagSection">
          <SectionHeader icon="WAREHOUSE" title="WAREHOUSE" />
          <div className={SectionWrapperStyle}>
            <Subscribe to={[WarehouseContainer]}>
              {({ originalValues: initialValues, state, setFieldValue, setFieldArrayValue }) => {
                // $FlowFixMe
                const values: FormState = { ...initialValues, ...state };

                return (
                  <div>
                    <FormField
                      name="name"
                      initValue={values.name}
                      values={values}
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
                          label: <FormattedMessage {...messages.name} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="street"
                      initValue={values.street}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) =>
                        textInputFactory({
                          inputHandlers,
                          name,
                          isNew,
                          initValue: initialValues[name],
                          label: <FormattedMessage {...messages.streetAddress} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="locality"
                      initValue={values.locality}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) =>
                        textInputFactory({
                          inputHandlers,
                          name,
                          isNew,
                          initValue: initialValues[name],
                          label: <FormattedMessage {...messages.locality} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="region"
                      initValue={values.region}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) =>
                        textInputFactory({
                          inputHandlers,
                          name,
                          isNew,
                          initValue: initialValues[name],
                          label: <FormattedMessage {...messages.region} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="postalCode"
                      initValue={values.postalCode}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) =>
                        textInputFactory({
                          inputHandlers,
                          name,
                          isNew,
                          initValue: initialValues[name],
                          label: <FormattedMessage {...messages.postalCode} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="country"
                      initValue={values.country}
                      values={values}
                      validator={validator}
                      setFieldValue={(field, { name }) => setFieldValue(field, name)}
                    >
                      {({ name, ...inputHandlers }) =>
                        selectSearchEnumInputFactory({
                          enumType: 'Country',
                          name,
                          inputHandlers,
                          isNew,
                          initValue: initialValues[name],
                          label: <FormattedMessage {...messages.country} />,
                        })
                      }
                    </FormField>
                    <FormField
                      name="surface"
                      initValue={getByPath('surface.value', values)}
                      validator={validator}
                      setFieldValue={(field, value) =>
                        setFieldArrayValue('surface', { value, metric: 'm2' })
                      }
                    >
                      {({ name, ...inputHandlers }) =>
                        numberInputFactory({
                          isNew,
                          name,
                          inputHandlers,
                          initValue: getByPath('surface.value', initialValues),
                          label: <FormattedMessage {...messages.surface} />,
                          WrapperComponent: DefaultSurfaceStyle,
                        })
                      }
                    </FormField>
                  </div>
                );
              }}
            </Subscribe>
          </div>
        </SectionWrapper>
      </div>
    );
  }
}

export default WarehouseForm;
