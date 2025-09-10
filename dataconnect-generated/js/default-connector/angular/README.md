# Generated Angular README
This README will guide you through the process of using the generated Angular SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`default-connector/README.md`](../README.md)**

**If you're looking for the `React README`, you can find it at [`default-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector/angular` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#angular).

# Table of Contents
- [**Overview**](#generated-angular-readme)
- [**TanStack Query Firebase & TanStack Angular Query**](#tanstack-query-firebase-tanstack-angular-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-angular-query-packages)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListCustomers*](#listcustomers)
  - [*GetReviewsByHandle*](#getreviewsbyhandle)
  - [*GetProductByHandle*](#getproductbyhandle)
  - [*GetCollectionByHandle*](#getcollectionbyhandle)
  - [*GetCollectionsByPage*](#getcollectionsbypage)
  - [*SearchProductDescriptionUsingL2Similarity*](#searchproductdescriptionusingl2similarity)
  - [*SearchProductTitleUsingL2Similarity*](#searchproducttitleusingl2similarity)
  - [*SearchProductReviewContentUsingL2Similarity*](#searchproductreviewcontentusingl2similarity)
  - [*GetOrdersByCustomerId*](#getordersbycustomerid)
  - [*GetOrderById*](#getorderbyid)
- [**Mutations**](#mutations)
  - [*UpsertCustomer*](#upsertcustomer)
  - [*CreateProductReview*](#createproductreview)
  - [*CreateOrder*](#createorder)
  - [*UpdateOrderByPaymentIntentId*](#updateorderbypaymentintentid)
  - [*UpdateOrderByChargeId*](#updateorderbychargeid)
  - [*CreateOrderItem*](#createorderitem)

# TanStack Query Firebase & TanStack Angular Query
This SDK provides [Angular](https://angular.dev/) injectors generated specific to your application, for the operations found in the connector `default`. These injectors are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack Angular Query v5](https://tanstack.com/query/v5/docs/framework/angular/overview) and [AngularFire](https://github.com/angular/angularfire/tree/main).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated Angular SDK.

## Installing TanStack Query Firebase and TanStack Angular Query Packages
In order to use the Angular generated SDK, you must install `AngularFire` and select `Data Connect` during the setup.

You can install `AngularFire` using the [Angular CLI](https://angular.dev/installation#install-angular-cli). You can also follow the installation instructions from the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular#automatic-setup).

```bash
npm install -g @angular/cli
```
```bash
ng add @angular/fire
# select Data Connect during setup!
```

This should handle configuring your project to use TanStack Query. However, if you need to set up manually, please follow the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/angular#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, edit your `main.ts` file and your `app/app.config.ts` file and update your `provideDataConnect` provider:
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
... // other imports
// update your imports to include the function that connects to the emulator
import { getDataConnect, provideDataConnect, connectDataConnectEmulator } from '@angular/fire/data-connect';

// update the `provideDataConnect` provider to provide an instance of `DataConnect` which uses the emulator:
export const appConfig: ApplicationConfig = {
  providers: [
    ... // other providers
    // Firebase Data Connect providers
    ...
    provideDataConnect(() => {
      const dataConnect = getDataConnect(connectorConfig);
      connectDataConnectEmulator(dataConnect, 'localhost', 9399);
      return dataConnect;
    }),
  ],
};
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the injectors provided from your generated Angular SDK.

# Queries

The Angular generated SDK provides Query injectors that call [`injectDataConnectQuery`](https://react-query-firebase.invertase.dev/angular/data-connect/querying) from TanStack Query Firebase.

Calling these injectors will return a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these injectors and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular/data-connect/querying).

TanStack Angular Query caches the results of your Queries, so using the same Query injector in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query injectors execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/disabling-queries).

To learn more about TanStack Angular Query's Queries, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/queries).

## Using Query Injectors
Here's a general overview of how to use the generated Query injectors in your code:

- If the Query has no variables, the Query injector does not require arguments.
- If the Query has any required variables, the Query injector will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query injector does not require any arguments.
- The Angular generated SDK's Query injectors do not accept `DataConnect` instances as arguments.
- Query injector functions can be called with or without passing in an `options` argument, whose type is a function which returns an object. The type is generated alongside the operation's injector function in [default-connector/angular/index.d.ts](./index.d.ts). To learn more about the `options` argument, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query injector without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `default` connector's generated Query injectors to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListCustomers
You can execute the `ListCustomers` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectListCustomers(options?: ListCustomersOptions, injector?: Injector): CreateDataConnectQueryResult<ListCustomersData, undefined>;
```

### Variables
The `ListCustomers` Query has no variables.
### Return Type
Recall that calling the `ListCustomers` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `ListCustomers` Query is of type `ListCustomersData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListCustomersData {
  customers: ({
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } & Customer_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `ListCustomers`'s Query injector

```javascript
... // other imports
import { connectorConfig } from '@firebasegen/default-connector';
import { injectListCustomers, ListCustomersOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectListCustomers();

  // You can also pass in an options function (not object) of type `ListCustomersOptions` to the Query injector function.
  options: ListCustomersOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectListCustomers(this.options);
}
```

## GetReviewsByHandle
You can execute the `GetReviewsByHandle` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetReviewsByHandle(args: GetReviewsByHandleArgs, options?: GetReviewsByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetReviewsByHandleData, GetReviewsByHandleVariables>;
```

### Variables
The `GetReviewsByHandle` Query requires an argument of type `GetReviewsByHandleVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetReviewsByHandleVariables {
  handle: string;
}
```
### Return Type
Recall that calling the `GetReviewsByHandle` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetReviewsByHandle` Query is of type `GetReviewsByHandleData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetReviewsByHandleData {
  products: ({
    productReviews_on_product: ({
      id: UUIDString;
      rating: number;
      content: string;
      date: DateString;
      customer: {
        id: string;
        firstName: string;
        lastName: string;
      } & Customer_Key;
    })[];
  })[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetReviewsByHandle`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetReviewsByHandleVariables } from '@firebasegen/default-connector';
import { injectGetReviewsByHandle, GetReviewsByHandleOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetReviewsByHandle` Query requires an argument of type `GetReviewsByHandleVariables`:
  getReviewsByHandleVars: GetReviewsByHandleVariables = {
    handle: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetReviewsByHandle(this.getReviewsByHandleVars);
  // Variables can be defined inline as well.
  query = injectGetReviewsByHandle({ handle: ..., });

  // You can also pass in an options function (not object) of type `GetReviewsByHandleOptions` to the Query injector function.
  options: GetReviewsByHandleOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetReviewsByHandle(this.getReviewsByHandleVars, this.options);
}
```

## GetProductByHandle
You can execute the `GetProductByHandle` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetProductByHandle(args: GetProductByHandleArgs, options?: GetProductByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetProductByHandleData, GetProductByHandleVariables>;
```

### Variables
The `GetProductByHandle` Query requires an argument of type `GetProductByHandleVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetProductByHandleVariables {
  handle: string;
}
```
### Return Type
Recall that calling the `GetProductByHandle` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetProductByHandle` Query is of type `GetProductByHandleData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetProductByHandleData {
  product?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    handle: string;
    availableForSale: boolean;
    createdAt: DateString;
    updatedAt: DateString;
    featuredImage?: {
      url: string;
      width: number;
      height: number;
      altText?: string | null;
    };
      seo?: {
        title: string;
        description: string;
        keywords: string;
      };
        productVariants_on_product: ({
          id: UUIDString;
          price: number;
          availableForSale: boolean;
          inventoryQuantity: number;
          selectedOptions_on_productVariant: ({
            name?: string | null;
            value?: string | null;
          })[];
        } & ProductVariant_Key)[];
          productImages_on_product: ({
            id: UUIDString;
            url: string;
            altText?: string | null;
            width: number;
            height: number;
            displayPosition: number;
          } & ProductImage_Key)[];
  } & Product_Key;
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetProductByHandle`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetProductByHandleVariables } from '@firebasegen/default-connector';
import { injectGetProductByHandle, GetProductByHandleOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetProductByHandle` Query requires an argument of type `GetProductByHandleVariables`:
  getProductByHandleVars: GetProductByHandleVariables = {
    handle: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetProductByHandle(this.getProductByHandleVars);
  // Variables can be defined inline as well.
  query = injectGetProductByHandle({ handle: ..., });

  // You can also pass in an options function (not object) of type `GetProductByHandleOptions` to the Query injector function.
  options: GetProductByHandleOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetProductByHandle(this.getProductByHandleVars, this.options);
}
```

## GetCollectionByHandle
You can execute the `GetCollectionByHandle` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetCollectionByHandle(args: GetCollectionByHandleArgs, options?: GetCollectionByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetCollectionByHandleData, GetCollectionByHandleVariables>;
```

### Variables
The `GetCollectionByHandle` Query requires an argument of type `GetCollectionByHandleVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCollectionByHandleVariables {
  handle: string;
  page?: string | null;
}
```
### Return Type
Recall that calling the `GetCollectionByHandle` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetCollectionByHandle` Query is of type `GetCollectionByHandleData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetCollectionByHandleData {
  collections: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    page?: string | null;
    featuredImage?: {
      url: string;
      width: number;
      height: number;
      altText?: string | null;
    };
      seo?: {
        title: string;
        description: string;
        keywords: string;
      };
        products_via_ProductCollection: ({
          id: UUIDString;
          title: string;
          handle: string;
          description?: string | null;
          availableForSale: boolean;
          createdAt: DateString;
          updatedAt: DateString;
          productVariants_on_product: ({
            id: UUIDString;
            price: number;
            availableForSale: boolean;
            inventoryQuantity: number;
            selectedOptions_on_productVariant: ({
              name?: string | null;
              value?: string | null;
            })[];
          } & ProductVariant_Key)[];
            productImages_on_product: ({
              id: UUIDString;
              url: string;
              altText?: string | null;
              width: number;
              height: number;
              displayPosition: number;
            } & ProductImage_Key)[];
        } & Product_Key)[];
  } & Collection_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetCollectionByHandle`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetCollectionByHandleVariables } from '@firebasegen/default-connector';
import { injectGetCollectionByHandle, GetCollectionByHandleOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetCollectionByHandle` Query requires an argument of type `GetCollectionByHandleVariables`:
  getCollectionByHandleVars: GetCollectionByHandleVariables = {
    handle: ..., 
    page: ..., // optional
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetCollectionByHandle(this.getCollectionByHandleVars);
  // Variables can be defined inline as well.
  query = injectGetCollectionByHandle({ handle: ..., page: ..., });

  // You can also pass in an options function (not object) of type `GetCollectionByHandleOptions` to the Query injector function.
  options: GetCollectionByHandleOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetCollectionByHandle(this.getCollectionByHandleVars, this.options);
}
```

## GetCollectionsByPage
You can execute the `GetCollectionsByPage` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetCollectionsByPage(args?: GetCollectionsByPageArgs, options?: GetCollectionsByPageOptions, injector?: Injector): CreateDataConnectQueryResult<GetCollectionsByPageData, GetCollectionsByPageVariables>;
```

### Variables
The `GetCollectionsByPage` Query has an optional argument of type `GetCollectionsByPageVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCollectionsByPageVariables {
  page?: string | null;
}
```
### Return Type
Recall that calling the `GetCollectionsByPage` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetCollectionsByPage` Query is of type `GetCollectionsByPageData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetCollectionsByPageData {
  collections: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    handle: string;
    page?: string | null;
    featuredImage?: {
      url: string;
      width: number;
      height: number;
      altText?: string | null;
    };
      products_via_ProductCollection: ({
        id: UUIDString;
        title: string;
        handle: string;
        description?: string | null;
        productVariants_on_product: ({
          id: UUIDString;
          price: number;
          selectedOptions_on_productVariant: ({
            name?: string | null;
            value?: string | null;
          })[];
        } & ProductVariant_Key)[];
          productImages_on_product: ({
            id: UUIDString;
            url: string;
            altText?: string | null;
            width: number;
            height: number;
            displayPosition: number;
          } & ProductImage_Key)[];
      } & Product_Key)[];
  } & Collection_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetCollectionsByPage`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetCollectionsByPageVariables } from '@firebasegen/default-connector';
import { injectGetCollectionsByPage, GetCollectionsByPageOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetCollectionsByPage` Query has an optional argument of type `GetCollectionsByPageVariables`:
  getCollectionsByPageVars: GetCollectionsByPageVariables = {
    page: ..., // optional
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetCollectionsByPage(this.getCollectionsByPageVars);
  // Variables can be defined inline as well.
  query = injectGetCollectionsByPage({ page: ..., });
  // Since all variables are optional for this Query, you can omit the `GetCollectionsByPageVariables` argument.
  // (as long as you don't want to provide any `options`!)
  query = injectGetCollectionsByPage();

  // You can also pass in an options function (not object) of type `GetCollectionsByPageOptions` to the Query injector function.
  options: GetCollectionsByPageOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetCollectionsByPage(this.getCollectionsByPageVars, this.options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  query = injectGetCollectionsByPage(undefined, this.options);
}
```

## SearchProductDescriptionUsingL2Similarity
You can execute the `SearchProductDescriptionUsingL2Similarity` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectSearchProductDescriptionUsingL2similarity(args: SearchProductDescriptionUsingL2similarityArgs, options?: SearchProductDescriptionUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductDescriptionUsingL2similarityData, SearchProductDescriptionUsingL2similarityVariables>;
```

### Variables
The `SearchProductDescriptionUsingL2Similarity` Query requires an argument of type `SearchProductDescriptionUsingL2similarityVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchProductDescriptionUsingL2similarityVariables {
  query: string;
}
```
### Return Type
Recall that calling the `SearchProductDescriptionUsingL2Similarity` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `SearchProductDescriptionUsingL2Similarity` Query is of type `SearchProductDescriptionUsingL2similarityData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SearchProductDescriptionUsingL2similarityData {
  products_descriptionEmbedding_similarity: ({
    id: UUIDString;
    handle: string;
    title: string;
  } & Product_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `SearchProductDescriptionUsingL2Similarity`'s Query injector

```javascript
... // other imports
import { connectorConfig, SearchProductDescriptionUsingL2similarityVariables } from '@firebasegen/default-connector';
import { injectSearchProductDescriptionUsingL2similarity, SearchProductDescriptionUsingL2similarityOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `SearchProductDescriptionUsingL2similarity` Query requires an argument of type `SearchProductDescriptionUsingL2similarityVariables`:
  searchProductDescriptionUsingL2similarityVars: SearchProductDescriptionUsingL2similarityVariables = {
    query: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectSearchProductDescriptionUsingL2similarity(this.searchProductDescriptionUsingL2similarityVars);
  // Variables can be defined inline as well.
  query = injectSearchProductDescriptionUsingL2similarity({ query: ..., });

  // You can also pass in an options function (not object) of type `SearchProductDescriptionUsingL2similarityOptions` to the Query injector function.
  options: SearchProductDescriptionUsingL2similarityOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectSearchProductDescriptionUsingL2similarity(this.searchProductDescriptionUsingL2similarityVars, this.options);
}
```

## SearchProductTitleUsingL2Similarity
You can execute the `SearchProductTitleUsingL2Similarity` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectSearchProductTitleUsingL2similarity(args: SearchProductTitleUsingL2similarityArgs, options?: SearchProductTitleUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductTitleUsingL2similarityData, SearchProductTitleUsingL2similarityVariables>;
```

### Variables
The `SearchProductTitleUsingL2Similarity` Query requires an argument of type `SearchProductTitleUsingL2similarityVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchProductTitleUsingL2similarityVariables {
  query: string;
}
```
### Return Type
Recall that calling the `SearchProductTitleUsingL2Similarity` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `SearchProductTitleUsingL2Similarity` Query is of type `SearchProductTitleUsingL2similarityData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SearchProductTitleUsingL2similarityData {
  products_titleEmbedding_similarity: ({
    id: UUIDString;
    handle: string;
    title: string;
  } & Product_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `SearchProductTitleUsingL2Similarity`'s Query injector

```javascript
... // other imports
import { connectorConfig, SearchProductTitleUsingL2similarityVariables } from '@firebasegen/default-connector';
import { injectSearchProductTitleUsingL2similarity, SearchProductTitleUsingL2similarityOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `SearchProductTitleUsingL2similarity` Query requires an argument of type `SearchProductTitleUsingL2similarityVariables`:
  searchProductTitleUsingL2similarityVars: SearchProductTitleUsingL2similarityVariables = {
    query: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectSearchProductTitleUsingL2similarity(this.searchProductTitleUsingL2similarityVars);
  // Variables can be defined inline as well.
  query = injectSearchProductTitleUsingL2similarity({ query: ..., });

  // You can also pass in an options function (not object) of type `SearchProductTitleUsingL2similarityOptions` to the Query injector function.
  options: SearchProductTitleUsingL2similarityOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectSearchProductTitleUsingL2similarity(this.searchProductTitleUsingL2similarityVars, this.options);
}
```

## SearchProductReviewContentUsingL2Similarity
You can execute the `SearchProductReviewContentUsingL2Similarity` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectSearchProductReviewContentUsingL2similarity(args: SearchProductReviewContentUsingL2similarityArgs, options?: SearchProductReviewContentUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductReviewContentUsingL2similarityData, SearchProductReviewContentUsingL2similarityVariables>;
```

### Variables
The `SearchProductReviewContentUsingL2Similarity` Query requires an argument of type `SearchProductReviewContentUsingL2similarityVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchProductReviewContentUsingL2similarityVariables {
  query: string;
}
```
### Return Type
Recall that calling the `SearchProductReviewContentUsingL2Similarity` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `SearchProductReviewContentUsingL2Similarity` Query is of type `SearchProductReviewContentUsingL2similarityData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SearchProductReviewContentUsingL2similarityData {
  productReviews_contentEmbedding_similarity: ({
    product: {
      id: UUIDString;
      title: string;
      handle: string;
    } & Product_Key;
  })[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `SearchProductReviewContentUsingL2Similarity`'s Query injector

```javascript
... // other imports
import { connectorConfig, SearchProductReviewContentUsingL2similarityVariables } from '@firebasegen/default-connector';
import { injectSearchProductReviewContentUsingL2similarity, SearchProductReviewContentUsingL2similarityOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `SearchProductReviewContentUsingL2similarity` Query requires an argument of type `SearchProductReviewContentUsingL2similarityVariables`:
  searchProductReviewContentUsingL2similarityVars: SearchProductReviewContentUsingL2similarityVariables = {
    query: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectSearchProductReviewContentUsingL2similarity(this.searchProductReviewContentUsingL2similarityVars);
  // Variables can be defined inline as well.
  query = injectSearchProductReviewContentUsingL2similarity({ query: ..., });

  // You can also pass in an options function (not object) of type `SearchProductReviewContentUsingL2similarityOptions` to the Query injector function.
  options: SearchProductReviewContentUsingL2similarityOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectSearchProductReviewContentUsingL2similarity(this.searchProductReviewContentUsingL2similarityVars, this.options);
}
```

## GetOrdersByCustomerId
You can execute the `GetOrdersByCustomerId` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetOrdersByCustomerId(args: GetOrdersByCustomerIdArgs, options?: GetOrdersByCustomerIdOptions, injector?: Injector): CreateDataConnectQueryResult<GetOrdersByCustomerIdData, GetOrdersByCustomerIdVariables>;
```

### Variables
The `GetOrdersByCustomerId` Query requires an argument of type `GetOrdersByCustomerIdVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetOrdersByCustomerIdVariables {
  customerId: string;
}
```
### Return Type
Recall that calling the `GetOrdersByCustomerId` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetOrdersByCustomerId` Query is of type `GetOrdersByCustomerIdData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetOrdersByCustomerIdData {
  orders?: {
    orders_on_customer: ({
      id: UUIDString;
      customerId: string;
      processedAt: DateString;
      chargeId?: string | null;
      paymentIntentId?: string | null;
      receiptUrl?: string | null;
      subtotalPrice: number;
      totalPrice: number;
      financialStatus: string;
      fulfillmentStatus: string;
      orderItems_on_order: ({
        id: UUIDString;
        quantity: number;
        price: number;
        product: {
          id: UUIDString;
          title: string;
          handle: string;
          productImages_on_product: ({
            url: string;
            altText?: string | null;
            width: number;
            height: number;
          })[];
        } & Product_Key;
      } & OrderItem_Key)[];
    } & Order_Key)[];
  };
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetOrdersByCustomerId`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetOrdersByCustomerIdVariables } from '@firebasegen/default-connector';
import { injectGetOrdersByCustomerId, GetOrdersByCustomerIdOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetOrdersByCustomerId` Query requires an argument of type `GetOrdersByCustomerIdVariables`:
  getOrdersByCustomerIdVars: GetOrdersByCustomerIdVariables = {
    customerId: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetOrdersByCustomerId(this.getOrdersByCustomerIdVars);
  // Variables can be defined inline as well.
  query = injectGetOrdersByCustomerId({ customerId: ..., });

  // You can also pass in an options function (not object) of type `GetOrdersByCustomerIdOptions` to the Query injector function.
  options: GetOrdersByCustomerIdOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetOrdersByCustomerId(this.getOrdersByCustomerIdVars, this.options);
}
```

## GetOrderById
You can execute the `GetOrderById` Query using the following Query injector, which is defined in [default-connector/angular/index.d.ts](./index.d.ts):

```javascript
injectGetOrderById(args: GetOrderByIdArgs, options?: GetOrderByIdOptions, injector?: Injector): CreateDataConnectQueryResult<GetOrderByIdData, GetOrderByIdVariables>;
```

### Variables
The `GetOrderById` Query requires an argument of type `GetOrderByIdVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetOrderByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetOrderById` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetOrderById` Query is of type `GetOrderByIdData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetOrderByIdData {
  order?: {
    id: UUIDString;
    customerId: string;
    processedAt: DateString;
    receiptUrl?: string | null;
    totalPrice: number;
    financialStatus: string;
    fulfillmentStatus: string;
    orderItems_on_order: ({
      id: UUIDString;
      quantity: number;
      price: number;
      product: {
        id: UUIDString;
        title: string;
        handle: string;
        productImages_on_product: ({
          url: string;
          altText?: string | null;
          width: number;
          height: number;
        })[];
      } & Product_Key;
    } & OrderItem_Key)[];
  } & Order_Key;
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetOrderById`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetOrderByIdVariables } from '@firebasegen/default-connector';
import { injectGetOrderById, GetOrderByIdOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetOrderById` Query requires an argument of type `GetOrderByIdVariables`:
  getOrderByIdVars: GetOrderByIdVariables = {
    id: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetOrderById(this.getOrderByIdVars);
  // Variables can be defined inline as well.
  query = injectGetOrderById({ id: ..., });

  // You can also pass in an options function (not object) of type `GetOrderByIdOptions` to the Query injector function.
  options: GetOrderByIdOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetOrderById(this.getOrderByIdVars, this.options);
}
```

# Mutations

The Angular generated SDK provides Mutations injectors that call [`injectDataConnectMutation`](https://react-query-firebase.invertase.dev/angular/data-connect/mutations) from TanStack Query Firebase.

Calling these injectors will return a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these injectors and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular/data-connect/mutations).

Mutation injectors do not execute their Mutations automatically when called. Rather, after calling the Mutation injector and getting a `CreateDataConnectMutationResult` object, you must call the `CreateDataConnectMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack Angular Query's Mutations, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/mutations).

## Using Mutation Injectors
Here's a general overview of how to use the generated Mutation injectors in your code:

- Mutation injectors are not called with the arguments to the Mutation. Instead, arguments are passed to `CreateDataConnectMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation injector does not require any arguments.
- The Angular generated SDK's Mutation injectors do not accept `DataConnect` instances as arguments.
- Mutation injector functions can be called with or without passing in an `options` argument, whose type is a function which returns an object. The type is generated alongside the operation's injector function in [default-connector/angular/index.d.ts](./index.d.ts). The type is generated alongside the operation's injector function. To learn more about the `options` argument, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/mutations#mutation-side-effects).
  - `CreateDataConnectMutationResult.mutate()` also accepts an `options` argument. It's type is not a function which returns an object, but the object itself.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `CreateDataConnectMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `default` connector's generated Mutation injectors to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## UpsertCustomer
You can execute the `UpsertCustomer` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectUpsertCustomer(options?: UpsertCustomerOptions, injector?: Injector): CreateDataConnectMutationResult<UpsertCustomerData, UpsertCustomerVariables, UpsertCustomerVariables>;
```

### Variables
The `UpsertCustomer` Mutation requires an argument of type `UpsertCustomerVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertCustomerVariables {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
}
```
### Return Type
Recall that calling the `UpsertCustomer` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `UpsertCustomer` Mutation is of type `UpsertCustomerData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCustomerData {
  customer_upsert: Customer_Key;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `UpsertCustomer`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, UpsertCustomerVariables } from '@firebasegen/default-connector';
import { injectUpsertCustomer, UpsertCustomerOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectUpsertCustomer();

  // You can also pass in a `UpsertCustomerOptions` function (not object) to the Mutation injector function.
  options: UpsertCustomerOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectUpsertCustomer(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `UpsertCustomer` Mutation requires an argument of type `UpsertCustomerVariables`:
    const upsertCustomerVars: UpsertCustomerVariables = {
      firstName: ..., 
      lastName: ..., 
      email: ..., 
      phone: ..., 
      acceptsMarketing: ..., 
    };
    this.mutation.mutate(upsertCustomerVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ firstName: ..., lastName: ..., email: ..., phone: ..., acceptsMarketing: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(upsertCustomerVars);

    // You can also pass in a `UpsertCustomerOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(upsertCustomerVars, this.options());
  }
}
```

## CreateProductReview
You can execute the `CreateProductReview` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectCreateProductReview(options?: CreateProductReviewOptions, injector?: Injector): CreateDataConnectMutationResult<CreateProductReviewData, CreateProductReviewVariables, CreateProductReviewVariables>;
```

### Variables
The `CreateProductReview` Mutation requires an argument of type `CreateProductReviewVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateProductReviewVariables {
  productId: UUIDString;
  rating: number;
  content: string;
}
```
### Return Type
Recall that calling the `CreateProductReview` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `CreateProductReview` Mutation is of type `CreateProductReviewData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateProductReviewData {
  productReview_insert: ProductReview_Key;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `CreateProductReview`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, CreateProductReviewVariables } from '@firebasegen/default-connector';
import { injectCreateProductReview, CreateProductReviewOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectCreateProductReview();

  // You can also pass in a `CreateProductReviewOptions` function (not object) to the Mutation injector function.
  options: CreateProductReviewOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectCreateProductReview(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `CreateProductReview` Mutation requires an argument of type `CreateProductReviewVariables`:
    const createProductReviewVars: CreateProductReviewVariables = {
      productId: ..., 
      rating: ..., 
      content: ..., 
    };
    this.mutation.mutate(createProductReviewVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ productId: ..., rating: ..., content: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(createProductReviewVars);

    // You can also pass in a `CreateProductReviewOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(createProductReviewVars, this.options());
  }
}
```

## CreateOrder
You can execute the `CreateOrder` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectCreateOrder(options?: CreateOrderOptions, injector?: Injector): CreateDataConnectMutationResult<CreateOrderData, CreateOrderVariables, CreateOrderVariables>;
```

### Variables
The `CreateOrder` Mutation requires an argument of type `CreateOrderVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateOrderVariables {
  customerId: string;
  chargeId?: string | null;
  paymentIntentId?: string | null;
  receiptUrl?: string | null;
  subtotalPrice: number;
  totalTax: number;
  totalShippingPrice: number;
  totalPrice: number;
  financialStatus: string;
  fulfillmentStatus: string;
}
```
### Return Type
Recall that calling the `CreateOrder` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `CreateOrder` Mutation is of type `CreateOrderData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateOrderData {
  order_insert: Order_Key;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `CreateOrder`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, CreateOrderVariables } from '@firebasegen/default-connector';
import { injectCreateOrder, CreateOrderOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectCreateOrder();

  // You can also pass in a `CreateOrderOptions` function (not object) to the Mutation injector function.
  options: CreateOrderOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectCreateOrder(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `CreateOrder` Mutation requires an argument of type `CreateOrderVariables`:
    const createOrderVars: CreateOrderVariables = {
      customerId: ..., 
      chargeId: ..., // optional
      paymentIntentId: ..., // optional
      receiptUrl: ..., // optional
      subtotalPrice: ..., 
      totalTax: ..., 
      totalShippingPrice: ..., 
      totalPrice: ..., 
      financialStatus: ..., 
      fulfillmentStatus: ..., 
    };
    this.mutation.mutate(createOrderVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ customerId: ..., chargeId: ..., paymentIntentId: ..., receiptUrl: ..., subtotalPrice: ..., totalTax: ..., totalShippingPrice: ..., totalPrice: ..., financialStatus: ..., fulfillmentStatus: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(createOrderVars);

    // You can also pass in a `CreateOrderOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(createOrderVars, this.options());
  }
}
```

## UpdateOrderByPaymentIntentId
You can execute the `UpdateOrderByPaymentIntentId` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectUpdateOrderByPaymentIntentId(options?: UpdateOrderByPaymentIntentIdOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateOrderByPaymentIntentIdData, UpdateOrderByPaymentIntentIdVariables, UpdateOrderByPaymentIntentIdVariables>;
```

### Variables
The `UpdateOrderByPaymentIntentId` Mutation requires an argument of type `UpdateOrderByPaymentIntentIdVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateOrderByPaymentIntentIdVariables {
  paymentIntentId: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  receiptUrl?: string | null;
  processedAt?: DateString | null;
  chargeId?: string | null;
}
```
### Return Type
Recall that calling the `UpdateOrderByPaymentIntentId` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `UpdateOrderByPaymentIntentId` Mutation is of type `UpdateOrderByPaymentIntentIdData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateOrderByPaymentIntentIdData {
  order_update?: Order_Key | null;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `UpdateOrderByPaymentIntentId`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, UpdateOrderByPaymentIntentIdVariables } from '@firebasegen/default-connector';
import { injectUpdateOrderByPaymentIntentId, UpdateOrderByPaymentIntentIdOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectUpdateOrderByPaymentIntentId();

  // You can also pass in a `UpdateOrderByPaymentIntentIdOptions` function (not object) to the Mutation injector function.
  options: UpdateOrderByPaymentIntentIdOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectUpdateOrderByPaymentIntentId(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `UpdateOrderByPaymentIntentId` Mutation requires an argument of type `UpdateOrderByPaymentIntentIdVariables`:
    const updateOrderByPaymentIntentIdVars: UpdateOrderByPaymentIntentIdVariables = {
      paymentIntentId: ..., 
      financialStatus: ..., // optional
      fulfillmentStatus: ..., // optional
      receiptUrl: ..., // optional
      processedAt: ..., // optional
      chargeId: ..., // optional
    };
    this.mutation.mutate(updateOrderByPaymentIntentIdVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ paymentIntentId: ..., financialStatus: ..., fulfillmentStatus: ..., receiptUrl: ..., processedAt: ..., chargeId: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(updateOrderByPaymentIntentIdVars);

    // You can also pass in a `UpdateOrderByPaymentIntentIdOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(updateOrderByPaymentIntentIdVars, this.options());
  }
}
```

## UpdateOrderByChargeId
You can execute the `UpdateOrderByChargeId` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectUpdateOrderByChargeId(options?: UpdateOrderByChargeIdOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateOrderByChargeIdData, UpdateOrderByChargeIdVariables, UpdateOrderByChargeIdVariables | void>;
```

### Variables
The `UpdateOrderByChargeId` Mutation has an optional argument of type `UpdateOrderByChargeIdVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateOrderByChargeIdVariables {
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  receiptUrl?: string | null;
  processedAt?: DateString | null;
  chargeId?: string | null;
}
```
### Return Type
Recall that calling the `UpdateOrderByChargeId` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `UpdateOrderByChargeId` Mutation is of type `UpdateOrderByChargeIdData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateOrderByChargeIdData {
  order_update?: Order_Key | null;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `UpdateOrderByChargeId`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, UpdateOrderByChargeIdVariables } from '@firebasegen/default-connector';
import { injectUpdateOrderByChargeId, UpdateOrderByChargeIdOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectUpdateOrderByChargeId();

  // You can also pass in a `UpdateOrderByChargeIdOptions` function (not object) to the Mutation injector function.
  options: UpdateOrderByChargeIdOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectUpdateOrderByChargeId(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `UpdateOrderByChargeId` Mutation has an optional argument of type `UpdateOrderByChargeIdVariables`:
    const updateOrderByChargeIdVars: UpdateOrderByChargeIdVariables = {
      financialStatus: ..., // optional
      fulfillmentStatus: ..., // optional
      receiptUrl: ..., // optional
      processedAt: ..., // optional
      chargeId: ..., // optional
    };
    this.mutation.mutate(updateOrderByChargeIdVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ financialStatus: ..., fulfillmentStatus: ..., receiptUrl: ..., processedAt: ..., chargeId: ..., });
    // Since all variables are optional for this Mutation, you can omit the `UpdateOrderByChargeIdVariables` argument.
    this.mutation.mutate();

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(updateOrderByChargeIdVars);

    // You can also pass in a `UpdateOrderByChargeIdOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    // Since all variables are optional for this Mutation, you can provide options without providing any variables.
    // To do so, you must pass `undefined` where you would normally pass the variables.
    this.mutation.mutate(updateOrderByChargeIdVars /** or undefined */, this.options());
  }
}
```

## CreateOrderItem
You can execute the `CreateOrderItem` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [default-connector/angular/index.d.ts](./index.d.ts)):
```javascript
injectCreateOrderItem(options?: CreateOrderItemOptions, injector?: Injector): CreateDataConnectMutationResult<CreateOrderItemData, CreateOrderItemVariables, CreateOrderItemVariables>;
```

### Variables
The `CreateOrderItem` Mutation requires an argument of type `CreateOrderItemVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateOrderItemVariables {
  orderId: UUIDString;
  productId: UUIDString;
  quantity: number;
  price: number;
}
```
### Return Type
Recall that calling the `CreateOrderItem` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `CreateOrderItem` Mutation is of type `CreateOrderItemData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateOrderItemData {
  orderItem_insert: OrderItem_Key;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `CreateOrderItem`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, CreateOrderItemVariables } from '@firebasegen/default-connector';
import { injectCreateOrderItem, CreateOrderItemOptions } from '@firebasegen/default-connector/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectCreateOrderItem();

  // You can also pass in a `CreateOrderItemOptions` function (not object) to the Mutation injector function.
  options: CreateOrderItemOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectCreateOrderItem(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `CreateOrderItem` Mutation requires an argument of type `CreateOrderItemVariables`:
    const createOrderItemVars: CreateOrderItemVariables = {
      orderId: ..., 
      productId: ..., 
      quantity: ..., 
      price: ..., 
    };
    this.mutation.mutate(createOrderItemVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ orderId: ..., productId: ..., quantity: ..., price: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(createOrderItemVars);

    // You can also pass in a `CreateOrderItemOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(createOrderItemVars, this.options());
  }
}
```

