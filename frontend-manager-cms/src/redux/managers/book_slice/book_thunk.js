//! LIBRARY
import { createAsyncThunk } from '@reduxjs/toolkit';

//! NOTIFICATION

//! API STUDENT
import API_ADMIN from 'api/api_admin';

//! SHARE
import HELPERS from 'utils/helper';
import NOTIFICATION from 'utils/notification';
import REQUEST from 'utils/request';

/**
 * @author Nguyễn Tiến Tài
 * @created_at 09/03/2023
 * @descriptionKey Call api Get All Book admin cms
 * @function Get_All_Book_Cms_Initial
 * @return {Object}
 */
export const Get_All_Book_Cms_Initial = createAsyncThunk('admin/cms/book/all', async (_, { rejectWithValue }) => {
  try {
    //Call Api axios
    const response = await REQUEST.get(`${API_ADMIN.GET_ALL_BOOK_CMS}`, {
      headers: HELPERS.headerBrowser(),
      withCredentials: true,
    });

    //Take response Success
    const successData = response.data;
    console.log(successData);

    //Check data
    if (successData) {
      // return result data
      return successData;
    }
  } catch (error) {
    if (error) {
      //Take response Error
      const errorData = error.response.data;

      // return error
      return rejectWithValue(errorData);
    }
  }
});

/**
 * @author Nguyễn Tiến Tài
 * @created_at 19/03/2023
 * @descriptionKey Call api Delete Book admin cms
 * @function Delete_Book_Cms_Initial
 * @return {Object}
 */
export const Delete_Book_Cms_Initial = createAsyncThunk(
  'admin/cms/book/delete',
  async ({ book_id }, { rejectWithValue }) => {
    try {
      //Call Api axios
      const response = await REQUEST.post(
        `${API_ADMIN.DELETE_BOOK_CMS}`,
        {
          input: {
            book_input: {
              book_id,
            },
          },
        },
        {
          headers: HELPERS.headerBrowser(),
          withCredentials: true,
        },
      );

      //Take response Success
      const successData = response.data;

      //Check data
      if (successData) {
        // return result data
        NOTIFICATION.swalSuccess('Đã xóa thành công', '');

        return successData;
      }
    } catch (error) {
      if (error) {
        //Take response Error
        const errorData = error.response.data;

        // return error
        return rejectWithValue(errorData);
      }
    }
  },
);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 09/03/2023
 * @descriptionKey Call api Get detail Book admin cms
 * @function Get_Detail_Book_Cms_Initial
 * @return {Object}
 */
export const Get_Detail_Book_Cms_Initial = createAsyncThunk(
  'admin/cms/book/detail',
  async ({ book_id }, { rejectWithValue }) => {
    try {
      //Call Api axios
      const response = await REQUEST.get(`${API_ADMIN.GET_DETAIL_BOOK_CMS}/${book_id}`, {
        headers: HELPERS.headerBrowser(),
        withCredentials: true,
      });

      //Take response Success
      const successData = response.data;

      //Check data
      if (successData) {
        // return result data
        return successData;
      }
    } catch (error) {
      if (error) {
        //Take response Error
        const errorData = error.response.data;

        // return error
        return rejectWithValue(errorData);
      }
    }
  },
);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 26/03/2023
 * @descriptionKey Call api Create Book admin cms
 * @function Create_Book_Cms_Initial
 * @return {Object}
 */
export const Create_Book_Cms_Initial = createAsyncThunk(
  'admin/cms/book/create',
  async (
    {
      name,
      image_uri,
      description,
      author_id,
      bookshelf,
      language,
      quantity,
      public_id_image,
      page_number,
      book_categories_array,
      industry_code_id,
    },
    { rejectWithValue },
  ) => {
    try {
      //Call Api axios
      const response = await REQUEST.post(
        `${API_ADMIN.CREATE_BOOK_CMS}`,
        {
          input: {
            book_input: {
              name,
              author_id,
              image_uri,
              page_number,
              description,
              bookshelf,
              language,
              quantity,
              public_id_image,
              book_categories_array,
              industry_code_id,
            },
          },
        },
        {
          headers: HELPERS.headerBrowser(),
          withCredentials: true,
        },
      );

      //Take response Success
      const successData = response.data;

      //Check data
      if (successData) {
        // return result data
        NOTIFICATION.swalSuccess('Tạo sách thành công', '');
        return successData;
      }
    } catch (error) {
      if (error) {
        //Take response Error
        const errorData = error.response.data;

        // return error
        return rejectWithValue(errorData);
      }
    }
  },
);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 26/03/2023
 * @descriptionKey Call api Create Book admin cms
 * @function Create_Book_Cms_Initial
 * @return {Object}
 */
export const Edit_Book_Cms_Initial = createAsyncThunk(
  'admin/cms/book/edit',
  async (
    {
      book_id,
      name,
      image_uri,
      description,
      author_id,
      bookshelf,
      language,
      quantity,
      public_id_image,
      page_number,
      book_categories_array,
      industry_code_id,
    },
    { rejectWithValue },
  ) => {
    try {
      //Call Api axios
      const response = await REQUEST.post(
        `${API_ADMIN.EDIT_BOOK_CMS}`,
        {
          input: {
            book_input: {
              book_id,
              name,
              author_id,
              image_uri,
              page_number,
              description,
              bookshelf,
              language,
              quantity,
              public_id_image,
              book_categories_array,
              industry_code_id,
            },
          },
        },
        {
          headers: HELPERS.headerBrowser(),
          withCredentials: true,
        },
      );

      //Take response Success
      const successData = response.data;

      //Check data
      if (successData) {
        // return result data
        NOTIFICATION.swalSuccess('Cập nhật thành công', '');
        return successData;
      }
    } catch (error) {
      if (error) {
        //Take response Error
        const errorData = error.response.data;

        // return error
        return rejectWithValue(errorData);
      }
    }
  },
);
