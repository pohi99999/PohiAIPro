import { upsertCustomerRef, createProductReviewRef, createOrderRef, updateOrderByPaymentIntentIdRef, updateOrderByChargeIdRef, createOrderItemRef, listCustomersRef, getReviewsByHandleRef, getProductByHandleRef, getCollectionByHandleRef, getCollectionsByPageRef, searchProductDescriptionUsingL2similarityRef, searchProductTitleUsingL2similarityRef, searchProductReviewContentUsingL2similarityRef, getOrdersByCustomerIdRef, getOrderByIdRef } from '../../';
import { DataConnect, CallerSdkTypeEnum } from '@angular/fire/data-connect';
import { injectDataConnectQuery, injectDataConnectMutation } from '@tanstack-query-firebase/angular/data-connect';
import { inject, EnvironmentInjector } from '@angular/core';
export function injectUpsertCustomer(args, injector) {
  return injectDataConnectMutation(upsertCustomerRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectCreateProductReview(args, injector) {
  return injectDataConnectMutation(createProductReviewRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectCreateOrder(args, injector) {
  return injectDataConnectMutation(createOrderRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectUpdateOrderByPaymentIntentId(args, injector) {
  return injectDataConnectMutation(updateOrderByPaymentIntentIdRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectUpdateOrderByChargeId(args, injector) {
  return injectDataConnectMutation(updateOrderByChargeIdRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectCreateOrderItem(args, injector) {
  return injectDataConnectMutation(createOrderItemRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectListCustomers(options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  listCustomersRef(dc),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetReviewsByHandle(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getReviewsByHandleRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetProductByHandle(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getProductByHandleRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetCollectionByHandle(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getCollectionByHandleRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetCollectionsByPage(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getCollectionsByPageRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectSearchProductDescriptionUsingL2similarity(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  searchProductDescriptionUsingL2similarityRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectSearchProductTitleUsingL2similarity(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  searchProductTitleUsingL2similarityRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectSearchProductReviewContentUsingL2similarity(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  searchProductReviewContentUsingL2similarityRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetOrdersByCustomerId(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getOrdersByCustomerIdRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectGetOrderById(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getOrderByIdRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

