// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionWrapper, FieldItem, RadioInputFilterForm, ToggleInput } from 'components/Form';
import JumpToSection from 'components/JumpToSection';

import FilterHeaderLink from './components/FilterHeaderLink';
import { OrderFilteredSectionContainer, BatchFilteredSectionContainer } from './containers';
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
import filterByOrderDS from './filterByOrderDS';

type Props = {
  onChange: (filters: Object) => void,
};

class FilterForm extends React.Component<Props> {
  reset = () => {};

  render() {
    const { onChange } = this.props;

    return (
      <>
        <div className={ScrollWrapperStyle({ height: '400px' })}>
          <div className={FilterLayoutStyle}>
            <div className={FilterSectionTabs}>
              <Subscribe to={[OrderFilteredSectionContainer]}>
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

              <JumpToSection>
                <FilterHeaderLink
                  link="itemFilterSection"
                  label={<FormattedMessage id="global.item" defaultMessage="Item" />}
                />
              </JumpToSection>

              <Subscribe to={[BatchFilteredSectionContainer]}>
                {({ originalValues, state }) => {
                  const values = { ...originalValues, ...state };
                  const filteredNo =
                    (values.selectedSections && values.selectedSections.length) || 0;

                  return (
                    <JumpToSection>
                      <FilterHeaderLink
                        link="batchFilterSection"
                        label={<FormattedMessage id="global.batch" defaultMessage="Batch" />}
                      >
                        {filteredNo ? <div className={FilteredNoStyle}>{filteredNo}</div> : null}
                      </FilterHeaderLink>
                    </JumpToSection>
                  );
                }}
              </Subscribe>

              <JumpToSection>
                <FilterHeaderLink
                  link="shipmentFilterSection"
                  label={<FormattedMessage id="global.shipment" defaultMessage="Shipment" />}
                />
              </JumpToSection>
            </div>
            <div className={FilterGroupSectionWrapperStyle}>
              <SectionWrapper id="orderFilterSection">
                <Subscribe to={[OrderFilteredSectionContainer]}>
                  {({
                    originalValues,
                    state,
                    onToggleSelectSection,
                    onToggleSection,
                    onEditSection,
                    onSave,
                  }) => {
                    const values = { ...originalValues, ...state };

                    return (
                      <FieldItem
                        vertical
                        input={
                          <div className={FilterGroupSectionStyle}>
                            {filterByOrderDS.map(({ key, readOnly, disabled, label, form }) => {
                              let actions = [];
                              if (values.editingSection === key) {
                                actions = [
                                  <FilterSectionButton
                                    key="btn-save"
                                    label="APPLY"
                                    active
                                    onClick={() => onSave(key, onChange)}
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

                              return (
                                <>
                                  <RadioInputFilterForm
                                    key={key}
                                    selected={values.selectedSections.includes(key)}
                                    onToggle={() => onToggleSelectSection(key, onChange)}
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
                            })}
                            <FieldItem
                              vertical
                              input={
                                <div className={FilterGroupSectionStyle}>
                                  <ToggleInput
                                    toggled={values.selectedSections.includes('unBatched')}
                                    onToggle={() => onToggleSection('unBatched')}
                                  >
                                    <div className={FilterSectionStyle}>
                                      <div className={FilterSectionLabel}>
                                        <FormattedMessage
                                          id="modules.relationMap.filter.unBatched"
                                          defaultMessage="UnBatched"
                                        />
                                      </div>
                                    </div>
                                  </ToggleInput>
                                  <ToggleInput
                                    toggled={values.selectedSections.includes('unShipped')}
                                    onToggle={() => onToggleSection('unShipped')}
                                  >
                                    <div className={FilterSectionStyle}>
                                      <div className={FilterSectionLabel}>
                                        <FormattedMessage
                                          id="modules.relationMap.filter.unShipped"
                                          defaultMessage="UnShipped"
                                        />
                                      </div>
                                    </div>
                                  </ToggleInput>

                                  <ToggleInput
                                    toggled={values.selectedSections.includes('includeArchived')}
                                    onToggle={() => onToggleSection('includeArchived')}
                                  >
                                    <div className={FilterSectionStyle}>
                                      <div className={FilterSectionLabel}>
                                        <FormattedMessage
                                          id="modules.relationMap.filter.includeArchived"
                                          defaultMessage="IncludeArchived"
                                        />
                                      </div>
                                    </div>
                                  </ToggleInput>
                                  <ToggleInput
                                    toggled={values.selectedSections.includes('onlyArchived')}
                                    onToggle={() => onToggleSection('onlyArchived')}
                                  >
                                    <div className={FilterSectionStyle}>
                                      <div className={FilterSectionLabel}>
                                        <FormattedMessage
                                          id="modules.relationMap.filter.onlyArchived"
                                          defaultMessage="Only Archived"
                                        />
                                      </div>
                                    </div>
                                  </ToggleInput>
                                </div>
                              }
                            />
                          </div>
                        }
                      />
                    );
                  }}
                </Subscribe>
              </SectionWrapper>

              <SectionWrapper id="itemFilterSection" />

              <SectionWrapper id="batchFilterSection" />

              <SectionWrapper id="shipmentFilterSection" />
            </div>
            <div className={FilterSectionEditForm}>
              <Subscribe to={[OrderFilteredSectionContainer]}>
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
