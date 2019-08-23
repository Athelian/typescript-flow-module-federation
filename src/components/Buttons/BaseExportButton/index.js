// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloClient, withApollo } from 'react-apollo';
import { DocumentNode } from 'graphql';
import { BaseButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { ButtonStyle, DropDownStyle, WrapperStyle, ItemStyle, ItemIconStyle } from './style';
import { exportReadySubscription } from './query';

type Option = {
  name: string,
  icon: string | null,
  variables: Object,
};

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
};

type Props = OptionalProps & {
  exportQuery: DocumentNode,
  onLoad: (client: ApolloClient<any>) => Promise<Array<Option>>,
};

type PropsWithClient = { client: ApolloClient<any> } & Props;

const defaultProps = {
  label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
  disabled: false,
};

type State = {
  open: boolean,
  loading: boolean,
  options: Array<Option> | null,
  exporting: boolean,
  exportId: string | null,
  exportVariables: Object | null,
  filePath: string | null,
};

const initialState: State = {
  open: false,
  loading: false,
  options: null,
  exporting: false,
  exportId: null,
  exportVariables: null,
  filePath: null,
};

function reducer(state: State, action: { type: string, payload?: any }): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        open: !state.exporting,
      };
    case 'close':
      return {
        ...state,
        open: false,
      };
    case 'toggle':
      return {
        ...state,
        open: !state.open && !state.exporting,
      };
    case 'load':
      return {
        ...state,
        loading: true,
        options: [],
      };
    case 'loaded':
      return {
        ...state,
        loading: false,
        options: action.payload,
      };
    case 'select':
      return {
        ...state,
        open: false,
        exporting: true,
        exportId: null,
        exportVariables: action.payload,
        filePath: null,
        options: null,
      };
    case 'start':
      return {
        ...state,
        open: false,
        exporting: true,
        exportId: action.payload,
        exportVariables: null,
        filePath: null,
      };
    case 'ready':
      return {
        ...state,
        open: false,
        exporting: true,
        exportId: null,
        exportVariables: null,
        filePath: action.payload,
      };
    case 'done':
      return {
        ...state,
        exporting: false,
        exportId: null,
        exportVariables: null,
        filePath: null,
      };
    default:
      throw new Error();
  }
}

// $FlowFixMe: flow checking `Props` instead of `PropsWithClient`
function BaseExportButton({ label, disabled, exportQuery, onLoad, client }: PropsWithClient) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    if (!state.open || state.options !== null) {
      return;
    }

    dispatch({ type: 'load' });
    onLoad(client)
      .then(options => dispatch({ type: 'loaded', payload: options }))
      .catch(logger.error);
  }, [client, onLoad, state.open, state.options]);

  /**
   * On template selection by the user, we start the exporting process and get the export id.
   */
  React.useEffect(() => {
    if (!state.exportVariables) {
      return;
    }

    client
      .query({
        query: exportQuery,
        variables: state.exportVariables,
      })
      .then(({ data }) => {
        dispatch({
          type: 'start',
          payload: data[exportQuery.definitions[0].selectionSet.selections[0].name.value].id,
        });
      })
      .catch(logger.error);
  }, [client, exportQuery, state.exportVariables]);

  /**
   * With export id, start a subscription to wait for the generated file information.
   */
  React.useEffect(() => {
    if (!state.exportId) {
      return () => {};
    }

    const subscription = client
      .subscribe({
        query: exportReadySubscription,
        variables: {
          exportId: state.exportId,
        },
        fetchPolicy: 'network-only',
      })
      .subscribe({
        next(result) {
          const filePath = getByPathWithDefault(null, 'data.data.exportReady.path', result);

          dispatch({ type: 'ready', payload: filePath });
        },
        error: logger.error,
      });

    return () => subscription.unsubscribe();
  }, [client, state.exportId]);

  /**
   * After receiving the file path, start the download.
   */
  React.useEffect(() => {
    if (!state.filePath) {
      return;
    }

    const link = document.createElement('a');
    // $FlowFixMe: flow doesn't understand that I checked already
    link.href = state.filePath;
    if (document.body) {
      document.body.appendChild(link);
      link.click();
      // $FlowFixMe: flow doesn't understand that I checked already
      document.body.removeChild(link);
    }

    dispatch({ type: 'done' });
  }, [state.filePath]);

  return (
    <div className={WrapperStyle}>
      <BaseButton
        icon="DOWNLOAD"
        label={label}
        textColor="GRAY_LIGHT"
        backgroundColor="WHITE"
        hoverBackgroundColor="GRAY_SUPER_LIGHT"
        className={ButtonStyle}
        isLoading={state.exporting}
        disabled={disabled}
        onClick={() => dispatch({ type: 'toggle' })}
        buttonRef={buttonRef}
      />
      {state.open && (
        <OutsideClickHandler
          onOutsideClick={() => dispatch({ type: 'close' })}
          ignoreClick={!state.open}
          ignoreElements={buttonRef.current ? [buttonRef.current] : []}
        >
          <div className={DropDownStyle}>
            {state.loading ? (
              <div className={ItemStyle}>
                <LoadingIcon size={10} />
              </div>
            ) : (
              <>
                {state.options && state.options.length > 0 ? (
                  state.options.map(option => (
                    <button
                      type="button"
                      className={ItemStyle}
                      key={option.name}
                      onClick={() => dispatch({ type: 'select', payload: option.variables })}
                    >
                      {option.icon && (
                        <div className={ItemIconStyle}>
                          <Icon icon={option.icon} />
                        </div>
                      )}
                      {option.name}
                    </button>
                  ))
                ) : (
                  <div className={ItemStyle}>
                    <FormattedMessage
                      id="components.button.export.noTemplates"
                      defaultMessage="No export available"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
}

BaseExportButton.defaultProps = defaultProps;

// $FlowFixMe: flow don't know generics
export default withApollo<Props>(BaseExportButton);
