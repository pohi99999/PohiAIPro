import { ListCustomersData, GetReviewsByHandleData, GetReviewsByHandleVariables, GetProductByHandleData, GetProductByHandleVariables, GetCollectionByHandleData, GetCollectionByHandleVariables, GetCollectionsByPageData, GetCollectionsByPageVariables, SearchProductDescriptionUsingL2similarityData, SearchProductDescriptionUsingL2similarityVariables, SearchProductTitleUsingL2similarityData, SearchProductTitleUsingL2similarityVariables, SearchProductReviewContentUsingL2similarityData, SearchProductReviewContentUsingL2similarityVariables, GetOrdersByCustomerIdData, GetOrdersByCustomerIdVariables, GetOrderByIdData, GetOrderByIdVariables, UpsertCustomerData, UpsertCustomerVariables, CreateProductReviewData, CreateProductReviewVariables, CreateOrderData, CreateOrderVariables, UpdateOrderByPaymentIntentIdData, UpdateOrderByPaymentIntentIdVariables, UpdateOrderByChargeIdData, UpdateOrderByChargeIdVariables, CreateOrderItemData, CreateOrderItemVariables } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';
import { CreateDataConnectQueryResult, CreateDataConnectQueryOptions, CreateDataConnectMutationResult, DataConnectMutationOptionsUndefinedMutationFn } from '@tanstack-query-firebase/angular/data-connect';
import { FirebaseError } from 'firebase/app';
import { Injector } from '@angular/core';

export type ListCustomersOptions = () => Omit<CreateDataConnectQueryOptions<ListCustomersData, undefined>, 'queryFn'>;
export function injectListCustomers(options?: ListCustomersOptions, injector?: Injector): CreateDataConnectQueryResult<ListCustomersData, undefined>;

type GetReviewsByHandleArgs = GetReviewsByHandleVariables | (() => GetReviewsByHandleVariables);
export type GetReviewsByHandleOptions = () => Omit<CreateDataConnectQueryOptions<GetReviewsByHandleData, GetReviewsByHandleVariables>, 'queryFn'>;
export function injectGetReviewsByHandle(args: GetReviewsByHandleArgs, options?: GetReviewsByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetReviewsByHandleData, GetReviewsByHandleVariables>;

type GetProductByHandleArgs = GetProductByHandleVariables | (() => GetProductByHandleVariables);
export type GetProductByHandleOptions = () => Omit<CreateDataConnectQueryOptions<GetProductByHandleData, GetProductByHandleVariables>, 'queryFn'>;
export function injectGetProductByHandle(args: GetProductByHandleArgs, options?: GetProductByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetProductByHandleData, GetProductByHandleVariables>;

type GetCollectionByHandleArgs = GetCollectionByHandleVariables | (() => GetCollectionByHandleVariables);
export type GetCollectionByHandleOptions = () => Omit<CreateDataConnectQueryOptions<GetCollectionByHandleData, GetCollectionByHandleVariables>, 'queryFn'>;
export function injectGetCollectionByHandle(args: GetCollectionByHandleArgs, options?: GetCollectionByHandleOptions, injector?: Injector): CreateDataConnectQueryResult<GetCollectionByHandleData, GetCollectionByHandleVariables>;

type GetCollectionsByPageArgs = GetCollectionsByPageVariables | (() => GetCollectionsByPageVariables);
export type GetCollectionsByPageOptions = () => Omit<CreateDataConnectQueryOptions<GetCollectionsByPageData, GetCollectionsByPageVariables>, 'queryFn'>;
export function injectGetCollectionsByPage(args?: GetCollectionsByPageArgs, options?: GetCollectionsByPageOptions, injector?: Injector): CreateDataConnectQueryResult<GetCollectionsByPageData, GetCollectionsByPageVariables>;

type SearchProductDescriptionUsingL2similarityArgs = SearchProductDescriptionUsingL2similarityVariables | (() => SearchProductDescriptionUsingL2similarityVariables);
export type SearchProductDescriptionUsingL2similarityOptions = () => Omit<CreateDataConnectQueryOptions<SearchProductDescriptionUsingL2similarityData, SearchProductDescriptionUsingL2similarityVariables>, 'queryFn'>;
export function injectSearchProductDescriptionUsingL2similarity(args: SearchProductDescriptionUsingL2similarityArgs, options?: SearchProductDescriptionUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductDescriptionUsingL2similarityData, SearchProductDescriptionUsingL2similarityVariables>;

type SearchProductTitleUsingL2similarityArgs = SearchProductTitleUsingL2similarityVariables | (() => SearchProductTitleUsingL2similarityVariables);
export type SearchProductTitleUsingL2similarityOptions = () => Omit<CreateDataConnectQueryOptions<SearchProductTitleUsingL2similarityData, SearchProductTitleUsingL2similarityVariables>, 'queryFn'>;
export function injectSearchProductTitleUsingL2similarity(args: SearchProductTitleUsingL2similarityArgs, options?: SearchProductTitleUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductTitleUsingL2similarityData, SearchProductTitleUsingL2similarityVariables>;

type SearchProductReviewContentUsingL2similarityArgs = SearchProductReviewContentUsingL2similarityVariables | (() => SearchProductReviewContentUsingL2similarityVariables);
export type SearchProductReviewContentUsingL2similarityOptions = () => Omit<CreateDataConnectQueryOptions<SearchProductReviewContentUsingL2similarityData, SearchProductReviewContentUsingL2similarityVariables>, 'queryFn'>;
export function injectSearchProductReviewContentUsingL2similarity(args: SearchProductReviewContentUsingL2similarityArgs, options?: SearchProductReviewContentUsingL2similarityOptions, injector?: Injector): CreateDataConnectQueryResult<SearchProductReviewContentUsingL2similarityData, SearchProductReviewContentUsingL2similarityVariables>;

type GetOrdersByCustomerIdArgs = GetOrdersByCustomerIdVariables | (() => GetOrdersByCustomerIdVariables);
export type GetOrdersByCustomerIdOptions = () => Omit<CreateDataConnectQueryOptions<GetOrdersByCustomerIdData, GetOrdersByCustomerIdVariables>, 'queryFn'>;
export function injectGetOrdersByCustomerId(args: GetOrdersByCustomerIdArgs, options?: GetOrdersByCustomerIdOptions, injector?: Injector): CreateDataConnectQueryResult<GetOrdersByCustomerIdData, GetOrdersByCustomerIdVariables>;

type GetOrderByIdArgs = GetOrderByIdVariables | (() => GetOrderByIdVariables);
export type GetOrderByIdOptions = () => Omit<CreateDataConnectQueryOptions<GetOrderByIdData, GetOrderByIdVariables>, 'queryFn'>;
export function injectGetOrderById(args: GetOrderByIdArgs, options?: GetOrderByIdOptions, injector?: Injector): CreateDataConnectQueryResult<GetOrderByIdData, GetOrderByIdVariables>;

type UpsertCustomerOptions = DataConnectMutationOptionsUndefinedMutationFn<UpsertCustomerData, FirebaseError, UpsertCustomerVariables>;
export function injectUpsertCustomer(options?: UpsertCustomerOptions, injector?: Injector): CreateDataConnectMutationResult<UpsertCustomerData, UpsertCustomerVariables, UpsertCustomerVariables>;

type CreateProductReviewOptions = DataConnectMutationOptionsUndefinedMutationFn<CreateProductReviewData, FirebaseError, CreateProductReviewVariables>;
export function injectCreateProductReview(options?: CreateProductReviewOptions, injector?: Injector): CreateDataConnectMutationResult<CreateProductReviewData, CreateProductReviewVariables, CreateProductReviewVariables>;

type CreateOrderOptions = DataConnectMutationOptionsUndefinedMutationFn<CreateOrderData, FirebaseError, CreateOrderVariables>;
export function injectCreateOrder(options?: CreateOrderOptions, injector?: Injector): CreateDataConnectMutationResult<CreateOrderData, CreateOrderVariables, CreateOrderVariables>;

type UpdateOrderByPaymentIntentIdOptions = DataConnectMutationOptionsUndefinedMutationFn<UpdateOrderByPaymentIntentIdData, FirebaseError, UpdateOrderByPaymentIntentIdVariables>;
export function injectUpdateOrderByPaymentIntentId(options?: UpdateOrderByPaymentIntentIdOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateOrderByPaymentIntentIdData, UpdateOrderByPaymentIntentIdVariables, UpdateOrderByPaymentIntentIdVariables>;

type UpdateOrderByChargeIdOptions = DataConnectMutationOptionsUndefinedMutationFn<UpdateOrderByChargeIdData, FirebaseError, UpdateOrderByChargeIdVariables | void>;
export function injectUpdateOrderByChargeId(options?: UpdateOrderByChargeIdOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateOrderByChargeIdData, UpdateOrderByChargeIdVariables, UpdateOrderByChargeIdVariables | void>;

type CreateOrderItemOptions = DataConnectMutationOptionsUndefinedMutationFn<CreateOrderItemData, FirebaseError, CreateOrderItemVariables>;
export function injectCreateOrderItem(options?: CreateOrderItemOptions, injector?: Injector): CreateDataConnectMutationResult<CreateOrderItemData, CreateOrderItemVariables, CreateOrderItemVariables>;
