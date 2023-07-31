//! LIBARY
import { createSlice } from '@reduxjs/toolkit';

//! SHARE
import CONSTANTS from 'configs/constants';

//! CALL API REDUX THUNK
import { Get_All_Book_Student_Initial, Get_Detail_Book_Student_Initial } from './book_thunk';

const initialState = {
  loading: false,
  error: null,
  all_books_list: null,
  detail_book: null,
};

const Book = createSlice({
  name: CONSTANTS.REDUX_NAME._BOOK,
  initialState,
  reducers: {
    reset_detail_book: (state) => {
      state.detail_book = null;
    },
  },
  extraReducers: {
    //* Get all books
    [Get_All_Book_Student_Initial.pending]: (state, action) => {
      state.loading = true;
    },
    [Get_All_Book_Student_Initial.fulfilled]: (state, action) => {
      state.loading = false;
      state.all_books_list = action.payload;
    },
    [Get_All_Book_Student_Initial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //* Get detail book
    [Get_Detail_Book_Student_Initial.pending]: (state, action) => {
      state.loading = true;
    },
    [Get_Detail_Book_Student_Initial.fulfilled]: (state, action) => {
      state.loading = false;
      state.detail_book = action.payload;
    },
    [Get_Detail_Book_Student_Initial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const BookSlice = Book.reducer;
export const { reset_detail_book } = Book.actions;
export default BookSlice;
