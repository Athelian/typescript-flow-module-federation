// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionWrapper, FieldItem, RadioInputFilterForm, ToggleInput } from 'components/Form';
import JumpToSection from 'components/JumpToSection';

import FilterHeaderLink from './components/FilterHeaderLink';
import { OrderFilteringContainer, OrderItemFilteringContainer } from './containers';
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
} from './style';
import FilterSectionButton from './components/FilterSectionButton';
import FilterByOrderDS from './ds/FilterByOrderDS';
import FilterByOrderItemDS from './ds/FilterByOrderItemDS';

type Props = {
  onChange: (filters: Object) => void,
};

class FilterForm extends React.Component<Props> {
  reset = () => {};

  renderFilterSection = (container: Object, ds: Array<any>) => {
    const { onChange } = this.props;

    return (
      <Subscribe to={[container]}>
        {({
          originalValues,
          state,
          onToggleSelectSection,
          onToggleSection,
          onEditSection,
          onApply,
        }) => {
          const values = { ...originalValues, ...state };

          return (
            <FieldItem
              vertical
              input={
                <div className={FilterGroupSectionStyle}>
                  {ds.map(({ key, type, readOnly, disabled, label, form }) => {
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

                    switch (type) {
                      case 'multi-select': {
                        return (
                          <>
                            <RadioInputFilterForm
                              key={key}
                              selected={values.selectedSections.includes(key)}
                              onToggle={() => onToggleSelectSection(key, onChange, form)}
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
                      }
                      case 'checkbox': {
                        return (
                          <>
                            <ToggleInput
                              toggled={values.selectedSections.includes(key)}
                              onToggle={() => onToggleSection(key)}
                            >
                              <div className={FilterSectionStyle}>
                                <div className={FilterSectionLabel}>{label}</div>
                              </div>
                            </ToggleInput>
                          </>
                        );
                      }
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

  render() {
    return (
      <>
        <div className={ScrollWrapperStyle({ height: '400px' })}>
          <div className={FilterLayoutStyle}>
            <div className={FilterSectionTabs}>
              <Subscribe to={[OrderFilteringContainer]}>
                {({ originalValues, state }) => {
                  const values = { ...originalValues, ...state };
                  const filteredNo =
                    (values.selectedSections && values.selectedSections.length) || 0;

                  return (
                    <JumpToSection>
                      <FilterHeaderLink
                        link="orderFilterSection"
                        label={<FormattedMessage id="global.order" defaultMessage="Order" />}
                      >
                        {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                      </FilterHeaderLink>
                    </JumpToSection>
                  );
                }}
              </Subscribe>

              <Subscribe to={[OrderItemFilteringContainer]}>
                {({ originalValues, state }) => {
                  const values = { ...originalValues, ...state };
                  const filteredNo =
                    (values.selectedSections && values.selectedSections.length) || 0;

                  return (
                    <JumpToSection>
                      <FilterHeaderLink
                        link="orderItemFilterSection"
                        label={<FormattedMessage id="global.item" defaultMessage="Item" />}
                      >
                        {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                      </FilterHeaderLink>
                    </JumpToSection>
                  );
                }}
              </Subscribe>

              <JumpToSection>
                <FilterHeaderLink
                  link="batchFilterSection"
                  label={<FormattedMessage id="global.batch" defaultMessage="Batch" />}
                />
              </JumpToSection>

              <JumpToSection>
                <FilterHeaderLink
                  link="shipmentFilterSection"
                  label={<FormattedMessage id="global.shipment" defaultMessage="Shipment" />}
                />
              </JumpToSection>
            </div>
            <div className={FilterGroupSectionWrapperStyle}>
              <SectionWrapper id="orderFilterSection">
                {this.renderFilterSection(OrderFilteringContainer, FilterByOrderDS)}
              </SectionWrapper>

              <SectionWrapper id="orderItemFilterSection">
                {this.renderFilterSection(OrderItemFilteringContainer, FilterByOrderItemDS)}
              </SectionWrapper>

              <SectionWrapper id="batchFilterSection" />

              <SectionWrapper id="shipmentFilterSection" />
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
