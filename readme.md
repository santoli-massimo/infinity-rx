
# Inifinty-Rx
This package enrich and extend the standard lifecycle of RxJS observables by introducing a more subscriber-centric approach.
It's designed to simplify state management, data handling, and operational control in a reactive context.

>Its core philosophy revolves around transforming any observable into an infinite one. 
This means that even if the input observable completes, the output observable remains infinite and 
active until there are no subscribers left.
This feature allows for a full inversion of control over the operations embedded within the input observable, 
forcing these operations to be executed in a full-reactive non-imperative way.

It also leverages the capabilities of RxJS to provide a structured and intuitive way of handling various states of observables,
such as loading, error, and data presence.

## Key Concepts

This libray is based on three key concepts:
- Inversion of Control
- Status Enrichment
- Decentralized State Management

### Inversion Of Control
In typical RxJS usage Once an observable is subscribed to, it executes its defined operations
(like an HTTP request) and completes after emitting its values. To re-execute this logic (e.g., to refresh the data),
you would typically need to create a new observable and re-subscribe to it. 
This pattern can lead to repetitive code and complexity expecially if multiple part of your application need the same 
data or your application require frequent data updates.

>This package changes this dynamic by inverting the control

**Single Source of Truth**: All Subscribers attached to the observable share the same execution context.
This means that if one subscriber triggers the execution of the observable (e.g., fetching data from a server),
all other current and future subscribers automatically receive the same data without re-triggering the operation.
This approach significantly reduces unnecessary operations (eg: network requests or computational operations),
and ensures that all parts of the application relying on this data remain in sync.

**Control Over Refreshing Data**: allows fine control over when to reload or refresh the observable. 
Since the observable is infinite and controlled by subscriber presence, 
it can be re-triggered (or "reloaded") based on specific conditions or events.
Developers can define custom logic to determine when and how the observable should be reloaded. 
For instance, a reload could be triggered based on user actions, timer intervals, or other application-specific events.

### Status Enrichment
By integrating various statuses directly into the observables, like loading, reloading, error and data presence,
alleviates the burden on developers to implement such logic at the component level, 
streamlining the development process and enhancing the maintainability of reactive applications.

### Decentralized State Management
Unlike patterns like Redux that rely on a centralized global state, 
"infinity-rx" allows for a decentralized state management architecture, which can be particularly advantageous in applications
where different components or modules require autonomous control over their data and state. 
Each observable enhanced by "infinity-rx" maintains its own state, providing more localized and modular control.


### Ok, but this is not a violation of the RxJS/Observable contract?
Transforming observables into infinite observables does not violate the RxJS contract. 
This library ensures that observables continue to emit values or statuses as long as there are subscribers. 
When subscribers unsubscribe, the observable still release resources and perform any necessary cleanup.

Even though "infinity-rx" extends the life of an observable, it still maintains proper subscription, error and teardown logic.

Adding status tracking (loading, error, data presence) to observables is a form of enrichment that
does not interfere with the standard api of RxJS. You can still catch errors in a standard RxJs way.

