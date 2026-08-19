# Infinity-Rx

> **Status: experimental** — the API is still moving and the test suite is
> minimal (marble testing with jest-marbles). Not published to npm yet.

This package enriches and extends the standard lifecycle of RxJS observables by introducing a more subscriber-centric approach.
It's designed to simplify state management, data handling, and operational control in a reactive context.

>Its core philosophy revolves around transforming any observable into an infinite one.
This means that even if the input observable completes, the output observable remains infinite and
active until there are no subscribers left.
>
>This feature allows for a full inversion of control over the operations embedded within the input observable,
forcing these operations to be executed in a full-reactive non-imperative way.

It also leverages the capabilities of RxJS to provide a structured and intuitive way of handling various states of observables,
such as loading, error, and data presence.

## Quick look

```ts
import { IRx, reload } from 'infinity-rx';
import { getMeta } from 'infinity-rx/rx-meta';

// wrap any observable — e.g. an HTTP request
const users$ = IRx(http.get('/users'), { maxRefreshInterval: 30_000 });

// all subscribers share one execution: one request, everyone in sync
users$.subscribe(renderList);
users$.subscribe(updateCounter);   // no second request triggered

// status channel out of the box: loading / error / data presence
getMeta(users$, 'status')?.subscribe(s => spinner.toggle(s.isLoading));

// re-run the source on demand — every subscriber receives the fresh data
reload(users$);
```

## Key Concepts

This library is based on three key concepts:
- Inversion of Control
- Status Enrichment
- Decentralized State Management

### Inversion Of Control
In typical RxJS usage, once an observable is subscribed to, it executes its defined operations
(like an HTTP request) and completes after emitting its values. To re-execute this logic (e.g., to refresh the data),
you would typically need to create a new observable and re-subscribe to it.
This pattern can lead to repetitive code and complexity, especially if multiple parts of your application need the same
data or your application requires frequent data updates.

>This package changes this dynamic by inverting the control

**Single Source of Truth**: all subscribers attached to the observable share the same execution context.
This means that if one subscriber triggers the execution of the observable (e.g., fetching data from a server),
all other current and future subscribers automatically receive the same data without re-triggering the operation.
This approach significantly reduces unnecessary operations (e.g. network requests or computational operations),
and ensures that all parts of the application relying on this data remain in sync.

**Control Over Refreshing Data**: allows fine control over when to reload or refresh the observable.
Since the observable is infinite and controlled by subscriber presence,
it can be re-triggered (or "reloaded") based on specific conditions or events.
Developers can define custom logic to determine when and how the observable should be reloaded.
For instance, a reload could be triggered based on user actions, timer intervals, or other application-specific events.

### Status Enrichment
By integrating various statuses directly into the observables, like loading, reloading, error and data presence,
it alleviates the burden on developers to implement such logic at the component level,
streamlining the development process and enhancing the maintainability of reactive applications.

### Decentralized State Management
Unlike patterns like Redux that rely on a centralized global state,
infinity-rx allows for a decentralized state management architecture, which can be particularly advantageous in applications
where different components or modules require autonomous control over their data and state.
Each observable enhanced by infinity-rx maintains its own state, providing more localized and modular control.


### Ok, but is this not a violation of the RxJS/Observable contract?
Transforming observables into infinite observables does not violate the RxJS contract.
This library ensures that observables continue to emit values or statuses as long as there are subscribers.
When subscribers unsubscribe, the observable still releases resources and performs any necessary cleanup.

Even though infinity-rx extends the life of an observable, it still maintains proper subscription, error and teardown logic.

Adding status tracking (loading, error, data presence) to observables is a form of enrichment that
does not interfere with the standard API of RxJS. You can still catch errors in a standard RxJS way.

## Design trade-offs

The channel mechanism (`rxMeta`) works by replacing the `pipe` method **on the
individual observable instance**, so that channels survive through operator chains.
This is a deliberate trade-off, and you should know about it:

- **Why**: channels must follow the observable through `.pipe(...)` without forcing
  a wrapper class on the user — any plain `Observable` works as input.
- **Cost**: the input observable is mutated. If the same instance is shared
  elsewhere, its `pipe` is no longer pristine. Prototypes and globals are never
  touched (only the single instance), but it is still surprising behavior.
- **Alternatives considered**: a wrapper subclass (breaks interop with APIs that
  return plain observables) and a WeakMap registry keyed by the observable
  (cleaner — the likely direction for a future version).

## Development

```bash
npm install
npm test        # jest + jest-marbles (marble testing)
```

## License

[MIT](LICENSE)
