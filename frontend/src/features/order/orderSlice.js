import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder, fecthAllOrders, updateOrder } from './orderApi';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder : null,
  totalOrders : 0
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const createOrderAsync = createAsyncThunk(
  'orders/createOrderAsync',
  async (order) => {
    const response = await createOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  'orders/updateOrderAsync',
  async (order) => {
    const response = await updateOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fecthAllOrdersAsync = createAsyncThunk(
  'orders/fecthAllOrdersAsync',
  async ({sort,pagination}) => {
    const response = await fecthAllOrders({sort,pagination});
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(fecthAllOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fecthAllOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const order_id = action.payload.id;
        const order_index = state.orders.findIndex(order=>order.id===order_id);
        state.orders.splice(order_index,1,action.payload);
      })
  },
});

export const { resetOrder} = orderSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selecttotalOrders = (state) => state.order.totalOrders;

export default orderSlice.reducer;
