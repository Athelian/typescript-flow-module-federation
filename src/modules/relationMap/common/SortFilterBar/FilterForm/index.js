// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionWrapper, FieldItem, RadioInputFilterForm, ToggleInput } from 'components/Form';
import Icon from 'components/Icon';
import FilterHeaderLink from './components/FilterHeaderLink';
import { OrderFilteringContainer } from './containers';
import {
  ScrollWrapperStyle,
  FilterLayoutStyle,
  FilterSectionTabs,
  FilteredNoStyle,
  FilterGroupSectionWrapperStyle,
  FilterSectionEditForm,
  FilterSectionLabel,
  FilterGroupSectionStyle,
  FilterSectionStyle,
  FilterTagsWrapperStyle,
  FilterTagStyle,
  ToggleInputLabelStyle,
  ToggleInputIconStyle,
} from './style';
import FilterSectionButton from './components/FilterSectionButton';
import FilterByOrderDS from './ds/FilterByOrderDS';
import FilterByOrderItemDS from './ds/FilterByOrderItemDS';
import FilterByBatchDS from './ds/FilterByBatchDS';
import FilterByShipmentDS from './ds/FilterByShipmentDS';

type Props = {
  onChange: (filters: Object) => void,
};

type State = {
  orderSection: boolean,
  orderItemSection: boolean,
  batchSection: boolean,
  shipmentSection: boolean,
};

class FilterForm extends React.Component<Props, State> {
  blankState = {
    orderSection: false,
    orderItemSection: false,
    batchSection: false,
    shipmentSection: false,
  };

  constructor() {
    super();
    this.state = {
      orderSection: true,
      orderItemSection: false,
      batchSection: false,
      shipmentSection: false,
    };
  }

  reset = () => {};

  renderFilterSection = (container: Object, ds: Array<any>) => {
    const { onChange } = this.props;

    return (
      <Subscribe to={[container]}>
        {({
          originalValues,
          state,
          onToggleFilterMultiSelect,
          onToggleFilterCheckBox,
          onEditSection,
          onApply,
        }) => {
          const values = { ...originalValues, ...state };

          return (
            <FieldItem
              vertical
              input={
                <div className={FilterGroupSectionStyle}>
                  {ds.map(({ key, readOnly, disabled, label, form, icon }) => {
                    let actions = [];
                    if (values.editingSection === key && form) {
                      actions = [
                        <FilterSectionButton
                          key="btn-save"
                          label="APPLY"
                          active
                          onClick={() => onApply(key, onChange)}
                        />,
                      ].filter(Boolean);
                    } else if (form) {
                      actions = [
                        <FilterSectionButton
                          key="btn-edit"
                          label="EDIT"
                          active={false}
                          onClick={() => {
                            if (values.selectedSections.includes(key)) {
                              onEditSection(key, form);
                            }
                          }}
                        />,
                      ];
                    }

                    const filterNameObj = key.split('.');
                    const [section, type, name] = filterNameObj;

                    switch (type) {
                      case 'multiSelect':
                        return (
                          <>
                            <RadioInputFilterForm
                              key={key}
                              selected={values.selectedSections.includes(key)}
                              onToggle={() => onToggleFilterMultiSelect(key, onChange, form)}
                              readOnly={readOnly}
                              disabled={disabled}
                              actions={actions}
                            >
                              <div className={FilterSectionStyle}>
                                <div className={FilterSectionLabel}>{label}</div>
                              </div>
                            </RadioInputFilterForm>
                            {values[section][type][name] && values[section][type][name].length ? (
                              <div className={FilterTagsWrapperStyle}>
                                {values[section][type][name].map(el => (
                                  <div className={FilterTagStyle} key={el.id}>
                                    {el.text}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </>
                        );
                      case 'range':
                        return (
                          <>
                            <RadioInputFilterForm
                              key={key}
                              selected={values.selectedSections.includes(key)}
                              onToggle={() => onToggleFilterMultiSelect(key, onChange, form)}
                              readOnly={readOnly}
                              disabled={disabled}
                              actions={actions}
                            >
                              <div className={FilterSectionStyle}>
                                <div className={FilterSectionLabel}>{label}</div>
                              </div>
                            </RadioInputFilterForm>
                            {values[key] && values[key].length ? (
                              <div className={FilterTagsWrapperStyle}>
                                {values[key].map(el => (
                                  <div className={FilterTagStyle} key={el.id}>
                                    {el.text}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </>
                        );

                      case 'checkbox':
                        return (
                          <>
                            <ToggleInput
                              toggled={values[section][type][name]}
                              onToggle={() => onToggleFilterCheckBox(key)}
                            >
                              <div className={ToggleInputLabelStyle}>
                                {icon ? (
                                  <div className={ToggleInputIconStyle}>
                                    <Icon icon={icon} />
                                  </div>
                                ) : null}
                                <div className={FilterSectionLabel}>{label}</div>
                              </div>
                            </ToggleInput>
                          </>
                        );

                      default:
                        return null;
                    }
                  })}
                </div>
              }
            />
          );
        }}
      </Subscribe>
    );
  };

  jumpToSection = (section: string) => {
    this.setState({
      ...this.blankState,
      [section]: true,
    });
  };

  render() {
    const { orderSection, orderItemSection, batchSection, shipmentSection } = this.state;

    return (
      <>
        <div className={ScrollWrapperStyle({ height: '400px' })}>
          <div className={FilterLayoutStyle}>
            <div className={FilterSectionTabs}>
              <Subscribe to={[OrderFilteringContainer]}>
                {({ getFilterNoInSection }) => {
                  const filteredNo = getFilterNoInSection('order');

                  return (
                    <FilterHeaderLink
                      active={orderSection}
                      link="orderFilterSection"
                      label={<FormattedMessage id="global.order" defaultMessage="Order" />}
                      onClick={() => this.jumpToSection('orderSection')}
                    >
                      {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                    </FilterHeaderLink>
                  );
                }}
              </Subscribe>

              <Subscribe to={[OrderFilteringContainer]}>
                {({ getFilterNoInSection }) => {
                  const filteredNo = getFilterNoInSection('orderItem');

                  return (
                    <FilterHeaderLink
                      active={orderItemSection}
                      link="orderItemFilterSection"
                      label={<FormattedMessage id="global.item" defaultMessage="Item" />}
                      onClick={() => this.jumpToSection('orderItemSection')}
                    >
                      {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                    </FilterHeaderLink>
                  );
                }}
              </Subscribe>

              <Subscribe to={[OrderFilteringContainer]}>
                {({ getFilterNoInSection }) => {
                  const filteredNo = getFilterNoInSection('batch');

                  return (
                    <FilterHeaderLink
                      active={batchSection}
                      link="batchFilterSection"
                      label={<FormattedMessage id="global.batch" defaultMessage="Batch" />}
                      onClick={() => this.jumpToSection('batchSection')}
                    >
                      {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                    </FilterHeaderLink>
                  );
                }}
              </Subscribe>

              <Subscribe to={[OrderFilteringContainer]}>
                {({ getFilterNoInSection }) => {
                  const filteredNo = getFilterNoInSection('shipment');

                  return (
                    <FilterHeaderLink
                      active={shipmentSection}
                      link="shipmentFilterSection"
                      label={<FormattedMessage id="global.shipment" defaultMessage="Shipment" />}
                      onClick={() => this.jumpToSection('shipmentSection')}
                    >
                      {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                    </FilterHeaderLink>
                  );
                }}
              </Subscribe>
            </div>
            <div className={FilterGroupSectionWrapperStyle}>
              <SectionWrapper id="orderFilterSection" display={orderSection}>
                {this.renderFilterSection(OrderFilteringContainer, FilterByOrderDS)}
              </SectionWrapper>

              <SectionWrapper id="orderItemFilterSection" display={orderItemSection}>
                {this.renderFilterSection(OrderFilteringContainer, FilterByOrderItemDS)}
              </SectionWrapper>

              <SectionWrapper id="batchFilterSection" display={batchSection}>
                {this.renderFilterSection(OrderFilteringContainer, FilterByBatchDS)}
              </SectionWrapper>

              <SectionWrapper id="shipmentFilterSection" display={shipmentSection}>
                {this.renderFilterSection(OrderFilteringContainer, FilterByShipmentDS)}
              </SectionWrapper>
            </div>
            <div className={FilterSectionEditForm}>
              <Subscribe to={[OrderFilteringContainer]}>
                {({ originalValues, state }) => {
                  const values = { ...originalValues, ...state };

                  return values.editingForm ? values.editingForm : <></>;
                }}
              </Subscribe>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FilterForm;
