// @flow
import * as React from 'react';
import { uniqBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { ShipmentExporterCard, ShipmentForwarderCard } from 'components/Cards';
import EnumProvider from 'providers/enum';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  DashedPlusButton,
  TextInput,
  DateInput,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
  TagsInput,
} from 'components/Form';
import messages from 'modules/batch/messages';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  TagsInputStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  ExporterEmptyCardStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const dummyData = {
  batches: [
    {
      orderItem: {
        productProvider: {
          exporter: {
            id: '1',
            name: 'Exporter 1',
          },
        },
      },
    },
    {
      orderItem: {
        productProvider: {
          exporter: {
            id: '2',
            name: 'Exporter 2',
          },
        },
      },
    },
    {
      orderItem: {
        productProvider: {
          exporter: {
            id: '3',
            name: 'Exporter 3',
          },
        },
      },
    },
    {
      orderItem: {
        productProvider: {
          exporter: {
            id: '4',
            name: 'Exporter 4',
          },
        },
      },
    },
    {
      orderItem: {
        productProvider: {
          exporter: {
            id: '5',
            name: 'Exporter 5',
          },
        },
      },
    },
  ],
  forwarders: [
    {
      id: 'a',
      name: 'Forwarder A',
    },
    {
      id: 'b',
      name: 'Forwarder B',
    },
  ],
};

const getUniqueExporters = (batches: Array<Object>) => {
  const uniqueExporters = uniqBy(
    batches.map(batch => batch.orderItem.productProvider.exporter),
    'id'
  );

  return uniqueExporters;
};

const renderExporters = (exporters: Array<Object>) => {
  const numOfExporters = exporters.length;

  if (numOfExporters === 0) {
    return <div className={ExporterEmptyCardStyle} />;
  }
  if (numOfExporters === 1) {
    return <ShipmentExporterCard exporter={exporters[0]} />;
  }
  if (numOfExporters === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <ShipmentExporterCard exporter={exporters[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfExporters === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfExporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[0]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

const renderForwarders = (forwarders: Array<Object>) => {
  const numOfForwarders = forwarders.length;

  if (numOfForwarders === 0) {
    return <DashedPlusButton width="200px" height="230px" />;
  }
  if (numOfForwarders === 1) {
    return <ShipmentForwarderCard forwarder={forwarders[0]} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <ShipmentForwarderCard forwarder={forwarders[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[0]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

const ShipmentSection = ({ isNew }: Props) => {
  const uniqueExporters = getUniqueExporters(dummyData.batches);

  return (
    <div className={ShipmentSectionWrapperStyle}>
      <div className={MainFieldsWrapperStyle}>
        <GridColumn>
          <FieldItem
            label={<Label required>SHIPMENT ID</Label>}
            input={
              <DefaultStyle forceHoverStyle={isNew} width="200px">
                <TextInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>B/L NO.</Label>}
            input={
              <DefaultStyle forceHoverStyle={isNew} width="200px">
                <TextInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>B/L DATE</Label>}
            input={
              <DefaultStyle type="date" forceHoverStyle={isNew} width="200px">
                <DateInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>BOOKING NO.</Label>}
            input={
              <DefaultStyle forceHoverStyle={isNew} width="200px">
                <TextInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>BOOKING DATE</Label>}
            input={
              <DefaultStyle type="date" forceHoverStyle={isNew} width="200px">
                <DateInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>INVOICE NO.</Label>}
            input={
              <DefaultStyle forceHoverStyle={isNew} width="200px">
                <TextInput />
              </DefaultStyle>
            }
          />

          <FieldItem
            label={<Label>TRANSPORTATION</Label>}
            input={
              <EnumProvider enumType="TransportTypeReason">
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error!: ${error}`;
                  return (
                    <SelectInput
                      items={data}
                      itemToString={item => (item ? item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      renderSelect={({ ...rest }) => (
                        <DefaultSelect
                          {...rest}
                          required
                          forceHoverStyle={isNew}
                          width="200px"
                          itemToString={item => (item ? item.name : '')}
                        />
                      )}
                      renderOptions={({ ...rest }) => (
                        <DefaultOptions
                          {...rest}
                          items={data}
                          itemToString={item => (item ? item.name : '')}
                          itemToValue={item => (item ? item.name : '')}
                        />
                      )}
                    />
                  );
                }}
              </EnumProvider>
            }
          />

          <FieldItem
            label={<Label>LOAD TYPE</Label>}
            input={
              <EnumProvider enumType="LoadTypeReason">
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error!: ${error}`;
                  return (
                    <SelectInput
                      items={data}
                      itemToString={item => (item ? item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      renderSelect={({ ...rest }) => (
                        <DefaultSelect
                          {...rest}
                          required
                          forceHoverStyle={isNew}
                          width="200px"
                          itemToString={item => (item ? item.name : '')}
                        />
                      )}
                      renderOptions={({ ...rest }) => (
                        <DefaultOptions
                          {...rest}
                          items={data}
                          itemToString={item => (item ? item.name : '')}
                          itemToValue={item => (item ? item.name : '')}
                        />
                      )}
                    />
                  );
                }}
              </EnumProvider>
            }
          />

          <FieldItem
            label={<Label>CARRIER</Label>}
            input={
              <DefaultStyle forceHoverStyle={isNew} width="200px">
                <TextInput />
              </DefaultStyle>
            }
          />
        </GridColumn>
        <GridColumn>
          <FieldItem
            vertical
            label={<Label>FORWARDER ({dummyData.forwarders.length})</Label>}
            tooltip={<Tooltip infoMessage="You can choose up to 4 Forwarders." />}
            input={renderForwarders(dummyData.forwarders)}
          />

          <FieldItem
            vertical
            label={
              <div className={ExporterLabelStyle}>
                <Label>EXPORTER ({uniqueExporters.length})</Label>
                {uniqueExporters.length > 4 && (
                  <button className={ExporterSeeMoreButtonStyle} type="button">
                    <Icon icon="HORIZONTAL_ELLIPSIS" />
                  </button>
                )}
              </div>
            }
            tooltip={
              <Tooltip infoMessage="Exporters are automatically shown based off of the Batches chosen for the Cargo of this Shipment." />
            }
            input={renderExporters(uniqueExporters)}
          />
        </GridColumn>
      </div>
      <div className={TagsInputStyle}>
        <FieldItem
          vertical
          label={
            <Label>
              <FormattedMessage {...messages.tags} />
            </Label>
          }
          input={<TagsInput editable={isNew} id="tags" name="tags" tagType="Shipment" />}
        />

        <div className={DividerStyle} />
      </div>
    </div>
  );
};

export default ShipmentSection;
