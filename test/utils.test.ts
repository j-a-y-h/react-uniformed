import { safePromise } from '../src/utils';

describe('utils', () => {
  describe('safePromise', () => {
    it('calls .catch on promises', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
      await new Promise((res) => {
        safePromise(
          new Promise((_, rej) => {
            rej('TEST');
            res();
          }),
        );
      });
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('TEST');
    });
    it('only works with Promise types', () => {
      const promise = {
        catch: jest.fn(),
      };
      // @ts-expect-error
      safePromise(promise);
      expect(promise.catch).not.toBeCalledTimes(1);
    });
  });
});
