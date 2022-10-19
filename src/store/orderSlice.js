import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    addedOrder: 0,
    status: false,
    selectedOrder: {},
    editClicked: 0,
    cancelClicked: 0,
    errorStatus: false,
  },
  reducers: {
    incerementOrder: (state) => {
      state.addedOrder += 1;
    },
    decrementOrder: (state) => {
      state.addedOrder -= 1;
    },
    showUpdate: (state, actions) => {
      state.status = true;
      state.selectedOrder = actions.payload;
    },
    hideUpdate: (state) => {
      state.status = false;
      state.selectedOrder = {};
    },
    incrementEditClicked: (state) => {
      state.editClicked += 1;
    },
    incrementCancelClicked: (state) => {
      state.cancelClicked += 1;
    },
    showError: (state, actions) => {
      state.errorStatus = actions.payload;
    },
    hideError: (state) => {
      state.errorStatus = false;
    },
  },
});

export const {
  incerementOrder,
  decrementOrder,
  showUpdate,
  hideUpdate,
  incrementEditClicked,
  incrementCancelClicked,
  showError,
  hideError,
} = orderSlice.actions;

export default orderSlice.reducer;
