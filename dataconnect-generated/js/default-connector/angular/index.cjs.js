const { listCustomersRef, getReviewsByHandleRef, getProductByHandleRef, getCollectionByHandleRef, getCollectionsByPageRef, searchProductDescriptionUsingL2similarityRef, searchProductTitleUsingL2similarityRef, searchProductReviewContentUsingL2similarityRef, getOrdersByCustomerIdRef, getOrderByIdRef, upsertCustomerRef, createProductReviewRef, createOrderRef, updateOrderByPaymentIntentIdRef, updateOrderByChargeIdRef, createOrderItemRef } = require('../');
const { DataConnect, CallerSdkTypeEnum } = require('@angular/fire/data-connect');
const { injectDataConnectQuery, injectDataConnectMutation } = require('@tanstack-query-firebase/angular/data-connect');
const { inject, EnvironmentInjector } = require('@angular/core');

exports.injectListCustomers = function injectListCustomers(options, injector) {
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

exports.injectGetReviewsByHandle = function injectGetReviewsByHandle(args, options, injector) {
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

exports.injectGetProductByHandle = function injectGetProductByHandle(args, options, injector) {
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

exports.injectGetCollectionByHandle = function injectGetCollectionByHandle(args, options, injector) {
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

exports.injectGetCollectionsByPage = function injectGetCollectionsByPage(args, options, injector) {
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

exports.injectSearchProductDescriptionUsingL2similarity = function injectSearchProductDescriptionUsingL2similarity(args, options, injector) {
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

exports.injectSearchProductTitleUsingL2similarity = function injectSearchProductTitleUsingL2similarity(args, options, injector) {
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

exports.injectSearchProductReviewContentUsingL2similarity = function injectSearchProductReviewContentUsingL2similarity(args, options, injector) {
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

exports.injectGetOrdersByCustomerId = function injectGetOrdersByCustomerId(args, options, injector) {
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

exports.injectGetOrderById = function injectGetOrderById(args, options, injector) {
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

exports.injectUpsertCustomer = function injectUpsertCustomer(args, injector) {
  return injectDataConnectMutation(upsertCustomerRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectCreateProductReview = function injectCreateProductReview(args, injector) {
  return injectDataConnectMutation(createProductReviewRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectCreateOrder = function injectCreateOrder(args, injector) {
  return injectDataConnectMutation(createOrderRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectUpdateOrderByPaymentIntentId = function injectUpdateOrderByPaymentIntentId(args, injector) {
  return injectDataConnectMutation(updateOrderByPaymentIntentIdRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectUpdateOrderByChargeId = function injectUpdateOrderByChargeId(args, injector) {
  return injectDataConnectMutation(updateOrderByChargeIdRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectCreateOrderItem = function injectCreateOrderItem(args, injector) {
  return injectDataConnectMutation(createOrderItemRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

