// @flow
import { print } from 'graphql/language/printer';
import { Operation } from 'apollo-link';
import logger from './utils/logger';

export class SubscriptionSSE {
  source: EventSource | null = null;

  subscribe(operation: Operation, handler: (data: any) => void) {
    const { query, variables, operationName } = operation;
    this.source = new EventSource(
      encodeURI(
        `${process.env.ZENPORT_SERVER_URL || ''}/graphql?query=${print(
          query
        )}&operationName=${operationName}&variables=${JSON.stringify(variables)}`
      ),
      { withCredentials: true }
    );
    this.source.onmessage = msg => {
      try {
        // heartbeat
        if (msg.data === '') {
          return;
        }
        handler(JSON.parse(String(msg.data)));
      } catch (e) {
        logger.error(e);
      }
    };
    this.source.onerror = () => {
      this.unsubscribe();
      const retryTimeout = setTimeout(() => {
        this.subscribe(operation, handler);
        clearTimeout(retryTimeout);
      }, 1000);
    };
  }

  unsubscribe() {
    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }
}

export default SubscriptionSSE;
