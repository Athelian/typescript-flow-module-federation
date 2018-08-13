// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { getByPathWithDefault } from 'utils/fp';
import OrderForm from './form';
import SectionNavigation from './form/components/SectionNavigation';
import LogsButton from './form/components/LogsButton';
import query from './query';

type Props = {
  orderId?: string,
};

type State = {
  isSlideViewOpen: boolean,
  type: string,
};

const defaultProps = {
  orderId: '',
};

class OrderFormContainer extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  state = {
    isSlideViewOpen: false,
    type: '',
  };

  onOpenSlideView = (type: string) => {
    this.setState({
      isSlideViewOpen: true,
      type,
    });
  };

  onCloseSlideView = () => {
    this.setState({ isSlideViewOpen: false });
  };

  render() {
    const { orderId } = this.props;
    logger.warn('orderId', orderId);
    const isNew = orderId === 'new';
    const { isSlideViewOpen, type } = this.state;
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="ORDER" color="ORDER" />
                <JumpToSection>
                  <SectionNavigation link="orderSection">ORDER</SectionNavigation>
                  <SectionNavigation link="itemSection">ITEMS</SectionNavigation>
                  <SectionNavigation link="documentSection">DOCUMENTS</SectionNavigation>
                  <SectionNavigation link="shipmentSection">SHIPMENTS</SectionNavigation>
                </JumpToSection>
                <LogsButton onClick={() => this.onOpenSlideView('logs')} />
              </NavBar>
            }
          >
            {isNew || !orderId ? (
              <OrderForm order={{}} />
            ) : (
              <Query query={query} variables={{ id: decodeId(orderId) }}>
                {({ loading, data, error }) => {
                  if (error) {
                    return error.message;
                  }

                  if (loading) return <LoadingIcon />;
                  return <OrderForm order={getByPathWithDefault({}, 'order', data)} />;
                }}
              </Query>
            )}
            <SlideView
              isOpen={isSlideViewOpen}
              onRequestClose={this.onCloseSlideView}
              options={{ width: 400 }}
            >
              <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1> {type.toUpperCase()} </h1>
              </div>
            </SlideView>
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default OrderFormContainer;
