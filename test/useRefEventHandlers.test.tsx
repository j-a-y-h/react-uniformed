import React from 'react';
import { useRefEventHandlers } from '../src/useRefEventHandlers';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';

// TODO: for each .tsx file make them integration test instead of unit tests
describe('useRefEventHandlers', () => {
  function createMockHandlers(event = 'change') {
    return {
      handlers: [jest.fn(), jest.fn()],
      event,
    };
  }
  describe('when used with single elements', () => {
    it.each(['click', 'focus'])('sets %s event handlers using a ref', async (event) => {
      const props = createMockHandlers(event);
      const { result } = renderHook(() => useRefEventHandlers<HTMLButtonElement>(props));

      const mount = render(
        <button ref={result.current} title='name'>
          Clicker
        </button>,
      );
      const name = await mount.findByTitle('name');
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(0);
      });
      fireEvent(name, new Event(event));
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(1);
      });
    });
    it('will not set event handlers if event handler is not specified', async () => {
      const props = { event: 'click' };
      const { result } = renderHook(() => useRefEventHandlers<HTMLButtonElement>(props));
      const mockEventListener = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      result.current((mockEventListener as unknown) as HTMLInputElement);
      expect(mockEventListener.addEventListener).toBeCalledTimes(0);
      expect(mockEventListener.removeEventListener).toBeCalledTimes(0);
    });
    it.each([['click'], ['blur']])('removes %s event handlers on unmount', async (event) => {
      const props = createMockHandlers(event);
      const props2 = createMockHandlers(event);
      const { result, rerender } = renderHook(
        (props) => {
          return useRefEventHandlers<HTMLButtonElement>(props);
        },
        {
          initialProps: props,
        },
      );

      const Component = React.forwardRef((_, ref: React.Ref<HTMLButtonElement>) => (
        <button ref={ref} title='name'>
          Clicker
        </button>
      ));
      const mount = render(<Component ref={result.current} />);
      const trigger = async () => {
        const name = await mount.findByTitle('name');
        fireEvent(name, new Event(event));
      };
      await trigger();
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(1);
      });
      props2.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(0);
      });

      rerender(props2);
      mount.rerender(<Component ref={result.current} />);
      await trigger();
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(1);
      });
      props2.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(1);
      });
    });
  });
  describe('when used with multiple elements', () => {
    it.each([['click'], ['blur']])('removes %s event handlers on unmount', async (event) => {
      const props = createMockHandlers(event);
      const props2 = createMockHandlers(event);
      const { result, rerender } = renderHook(
        (props) => {
          return useRefEventHandlers<HTMLButtonElement>(props);
        },
        {
          initialProps: props,
        },
      );

      const Component = React.forwardRef((_, ref: React.Ref<HTMLButtonElement>) => (
        <>
          <button ref={ref} title='name'>
            Clicker
          </button>
          <button ref={ref} title='name'>
            Clicker
          </button>
        </>
      ));
      const mount = render(<Component ref={result.current} />);
      const trigger = async () => {
        const names = await mount.findAllByTitle('name');
        names.forEach((name) => {
          fireEvent(name, new Event(event));
        });
      };
      await trigger();
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(2);
      });
      props2.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(0);
      });

      rerender(props2);
      mount.rerender(<Component ref={result.current} />);
      await trigger();
      props.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(2);
      });
      props2.handlers.forEach((handler) => {
        expect(handler).toBeCalledTimes(2);
      });
    });
    it.each([['click'], ['blur']])(
      'removes %s event handlers of one unmount element but not the other',
      async (event) => {
        const props = createMockHandlers(event);
        const props2 = createMockHandlers(event);
        const { result, rerender } = renderHook(
          (props) => {
            return useRefEventHandlers<HTMLButtonElement>(props);
          },
          {
            initialProps: props,
          },
        );

        const Component = React.forwardRef(({ keep = true }, ref: React.Ref<HTMLButtonElement>) => (
          <>
            <button ref={ref} title='name'>
              Clicker
            </button>
            {keep && (
              <button ref={ref} title='name'>
                Clicker
              </button>
            )}
          </>
        ));
        const mount = render(<Component ref={result.current} />);
        const trigger = async () => {
          const names = await mount.findAllByTitle('name');
          names.forEach((name) => {
            fireEvent(name, new Event(event));
          });
        };
        await trigger();
        props.handlers.forEach((handler) => {
          expect(handler).toBeCalledTimes(2);
        });
        props2.handlers.forEach((handler) => {
          expect(handler).toBeCalledTimes(0);
        });

        rerender(props2);
        mount.rerender(<Component ref={result.current} keep={false} />);
        await trigger();
        props.handlers.forEach((handler) => {
          expect(handler).toBeCalledTimes(2);
        });
        props2.handlers.forEach((handler) => {
          expect(handler).toBeCalledTimes(1);
        });
      },
    );
  });
});
// TODO: it removes event handlers when a new one is given
