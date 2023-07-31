//! LIBRARY
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

//! COMPONENTS

//! DUMMY DATA
import SelectBox from 'components/SelectBox';
import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';
import { Edit_Account_Cms_Initial, Get_Detail_Account_Cms_Initial } from 'redux/managers/student_slice/student_thunk';
import { classOption, genderOption } from 'utils/dummy';
import HELPERS from 'utils/helper';
import { reset_detail_account } from 'redux/managers/student_slice/student_slice';

const EditUser = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // state
  const [gender, setGender] = useState();
  const [classroom, setClassroom] = useState();
  const [dob, setDob] = useState(null);
  const detailAccount = useSelector((state) => state.student.detail_account?.element?.result[0]);

  // create book
  const handleEdit = (data) => {
    dispatch(
      Edit_Account_Cms_Initial({
        ...data,
        student_id: id,
        dob: moment(dob || detailAccount?.dob).format('YYYYMMDD'),
        gender: gender || detailAccount?.gender.toString(),
        class_room: classroom || detailAccount?.class,
      }),
    );
  };

  useEffect(() => {
    dispatch(Get_Detail_Account_Cms_Initial({ student_id: id })).then((result) => {
      const data = result?.payload?.element?.result[0];
      reset({ ...data });
    });

    return () => {
      dispatch(reset_detail_account());
    };
  }, []);

  return (
    <>
      <form className="w-full mt-10" autoComplete="nope" onSubmit={handleSubmit(handleEdit)}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                  Tên sinh viên
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="name"
                  type="text"
                  placeholder="Gia Bảo..."
                  {...register('name', {
                    required: true,
                  })}
                />
                <div className="mt-1 text-red-700">
                  {errors?.name?.type === 'required' ? 'Mời bạn nhập tên sinh viên' : ''}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                  Địa chỉ
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="name"
                  type="text"
                  placeholder="50121..."
                  {...register('address', {
                    required: true,
                  })}
                />
                <div className="mt-1 text-red-700">
                  {errors?.mssv?.type === 'required' ? 'Mời bạn nhập mã số sinh viên' : ''}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="gender">
                  Giới tính
                </label>

                {detailAccount?.gender >= 0 && (
                  <SelectBox
                    optionData={genderOption}
                    defaultValue={{
                      value: detailAccount?.gender,
                      label: HELPERS.getGenderLabel(detailAccount?.gender),
                    }}
                    setData={setGender}
                  />
                )}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nation">
                  Lớp
                </label>
                {detailAccount?.class && (
                  <SelectBox
                    optionData={classOption}
                    defaultValue={{
                      value: detailAccount?.class,
                      label: detailAccount?.class,
                    }}
                    setData={setClassroom}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="phone"
                  type="text"
                  placeholder="090..."
                  {...register('phone_number', {
                    required: true,
                  })}
                />
                <div className="mt-1 text-red-700">
                  {errors?.phone_number?.type === 'required' ? 'Mời bạn nhập số điện thoại' : ''}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="email"
                  type="text"
                  placeholder="example@gmail.com"
                  {...register('email', {
                    required: true,
                  })}
                />
                <div className="mt-1 text-red-700">
                  {errors?.email?.type === 'required' ? 'Mời bạn nhập email' : ''}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="gender">
                  Ngày sinh
                </label>
                <div className="date-picker">
                  {detailAccount?.dob && (
                    <Calendar
                      defaultValue={new Date(moment(detailAccount?.dob).format())}
                      onChange={setDob}
                      value={new Date(moment(detailAccount?.dob).format())}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <button
                  type="submit"
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-6 border border-blue-500 hover:border-transparent rounded float-right"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditUser;
