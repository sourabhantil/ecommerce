import React, { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fecthAllOrdersAsync,
  selectOrders,
  selecttotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import Pagination from "../../common/Pagination";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { selectUserInfo } from "../../user/userSlice";

export default function AdminOrders() {
  // TODO: don't redirect on reload
  // TODO: improve layout(responsive)
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [editableOrderId,setEditableOrderId] = useState(-1);
  const [sort,setSort] = useState({});
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selecttotalOrders);
  const handleEdit = (order)=>{
    setEditableOrderId(order.id);
  }
  const handleShow = (order)=>{

  }
  const handleOrderStatus = (e,order)=>{
    const updatedOrder = {...order,status:e.target.value};
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  }
  const handleOrderPaymentStatus = (e,order)=>{
    const updatedOrder = {...order,paymentStatus:e.target.value};
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  }

  const handlePage = (page)=>{
    setPage(page);
  }

  const handleSort = (sortOption)=>{
    const sorting = {_sort : sortOption.sort,_order : sortOption.order}
    setSort(sorting);
  }

  const chooseColor = (status)=>{
    switch (status){
      case "pending":
        return `bg-purple-200 text-purple-600`;
      case "pending":
        return `bg-purple-200 text-purple-600`;
      case "dispatched":
        return `bg-yellow-200 text-yellow-600`;
      case "delivered":
        return `bg-green-200 text-green-600`;
      case "received":
        return `bg-green-200 text-green-600`;
      case "cancelled":
        return `bg-red-200 text-red-600`;
      default:
        return `bg-purple-200 text-purple-600`;
    }
    
  }

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fecthAllOrdersAsync({sort,pagination}));
  }, [dispatch, page, sort]);
  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-1 text-left cursor-pointer" onClick={e=>handleSort({sort:"id",order:sort._order==="desc"?"asc" : "desc"})}>Order #{" "}
                  {sort._sort=="id" && (sort._order!=="asc" ? 
                  <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                  : <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                  )}
                  </th> 
                  <th className="py-3 px-1 text-left">Items</th>
                  <th className="py-3 px-1 text-left cursor-pointer" onClick={e=>handleSort({sort:"totalAmount",order:sort._order==="desc"?"asc" : "desc"})}>Total Amount{" "}
                  {sort._sort=="totalAmount" && (sort._order!=="asc" ? 
                  <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                  : <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                  )}
                  </th>
                  <th className="py-3 px-1 text-center">Shipping Address</th>
                  <th className="py-3 px-1 text-center">Order Status</th>
                  <th className="py-3 px-1 text-center">Payment Method</th>
                  <th className="py-3 px-1 text-center">Payment Status</th>
                  <th className="py-3 px-1 text-left cursor-pointer" onClick={e=>handleSort({sort:"createdAt",order:sort._order==="desc"?"asc" : "desc"})}>Order Time{" "}
                  {sort._sort=="createdAt" && (sort._order!=="asc" ? 
                  <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                  : <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                  )}
                  </th>
                  <th className="py-3 px-1 text-left cursor-pointer" onClick={e=>handleSort({sort:"updatedAt",order:sort._order==="desc"?"asc" : "desc"})}>Last Updated{" "}
                  {sort._sort=="updatedAt" && (sort._order!=="asc" ? 
                  <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                  : <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                  )}
                  </th>
                  <th className="py-3 px-1 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders.map((order,index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-1 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2"></div>
                        <span className="font-medium">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-1 text-left">
                      {order.items.map((item,index) => (
                        <div key={index} className="flex items-center">
                          <div className="mr-2">
                            <img
                              className="w-6 h-6 rounded-full"
                              src={item.product.thumbnail}
                              alt={item.product.title}
                            />
                          </div>
                          <span>
                            {item.product.title} - #{item.quantity} - ${item.product.discountPrice}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-1 text-center">
                      ${order.totalAmount}
                    </td>
                    <td className="py-3 px-1 text-center">
                      <span>
                        <div><strong>{order.selectedAddress.name},</strong></div>
                        <div>{order.selectedAddress.street},</div>
                        <div>{order.selectedAddress.city},</div>
                        <div>{order.selectedAddress.state},</div>
                        <div>{order.selectedAddress.pinCode},</div>
                        <div>{order.selectedAddress.phone}</div>
                      </span>
                    </td>
                    <td className="py-3 px-1 text-center">
                      {editableOrderId===order.id ? 
                      <select onChange={e=>handleOrderStatus(e,order)}>
                      <option >Choose Status</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    :
                      <span className={`${chooseColor(order.status)} py-1 px-3 rounded-full text-xs`}>
                        {order.status}
                      </span>
                      }
                    </td>
                    <td className="py-3 px-1 text-center">
                        {order.paymentMethod}
                    </td>
                    <td className="py-3 px-1 text-center">
                      {editableOrderId===order.id ? 
                      <select onChange={e=>handleOrderPaymentStatus(e,order)}>
                      <option >Choose Status</option>
                      <option value="pending">Pending</option>
                      <option value="received">Received</option>
                    </select>
                    :
                      <span className={`${chooseColor(order.paymentStatus)} py-1 px-3 rounded-full text-xs`}>
                        {order.paymentStatus}
                      </span>
                      }
                    </td>
                    <td className="py-3 px-1 text-center">
                        {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-1 text-center">
                        {new Date(order.updatedAt).toLocaleString()}
                    </td>
                    {/* actions */}
                    <td className="py-3 px-1 text-center">
                      <div className="flex item-center justify-center">
                        <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="cursor-pointer"
                            onClick={e=>handleShow(order)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                        <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="cursor-pointer"
                            onClick={e=>handleEdit(order)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination page={page} handlePage={handlePage} totalItems={totalOrders}></Pagination>
    </div>
  );
}
