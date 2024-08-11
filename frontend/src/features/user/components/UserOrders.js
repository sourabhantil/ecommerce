import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoggedInUserOrdersAsync, selectUserInfo, selectUserOrders } from '../userSlice';


export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  useEffect(()=>{
      dispatch(fetchLoggedInUserOrdersAsync()); 
  },[dispatch])
  return (
    <div>
      {orders && orders.map(order=><div key={order.id} className="mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white">
        <div className="px-4 py-6 sm:px-6">
        <h1 className="text-4xl font-bold my-12 tracking-tight text-gray-900">Order #{order.id}</h1>
        <h3 className="text-xl font-bold my-12 tracking-tight text-red-900">Order Status: {order.status}</h3>
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.product.thumbnail}
                                    alt={item.product.title}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={item.product.id}>{item.product.title}</a>
                                      </h3>
                                      <p className="ml-4">${item.product.discountPrice}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="text-gray-500">
                                    <label htmlFor="quantity" className="inline text-sm mr-5 font-medium leading-6 text-gray-900">Qty: {item.quantity}</label>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$ {order.totalAmount}</p>
                      </div>
                      <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                        <p>Total Items in Cart</p>
                        <p>{order.totalItems} items</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping Address: </p>
                      <div className="flex justify-between gap-x-6 py-5 px-5 border border-gray-200">
                                        <div className="flex gap-x-4">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{order.selectedAddress.name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{order.selectedAddress.street}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{order.selectedAddress.pincode}</p>
                                            </div>
                                        </div>
                                         <div className="hidden sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">{order.selectedAddress.phone}</p>
                                            <p className="text-sm leading-6 text-gray-500">{order.selectedAddress.city}</p>
                                        </div>
                                    </div>
                    </div>
      </div>)}
    </div>
  );
}
