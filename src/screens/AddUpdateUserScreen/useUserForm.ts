import {useFormik} from 'formik';
import {IDeviceRel} from 'interface/device';
import {phoneNumberMask} from 'utils/globals.variables';
import * as Yup from 'yup';

export interface IUserValues {
  country: string;
  phoneNumber: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  pincode: string;
  devices: IDeviceRel[];
}

export interface IUserUpdateValues {
  country?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  pincode?: string;
  created_by?: string;
}

export interface IDevice {
  id: string;
  nickname: string;
  imei_number: string;
}

export interface IUserForm {
  onSubmit: (params: IUserValues) => void;
}

export const useUserForm = ({onSubmit}: IUserForm) => {
  const schema = Yup.object().shape(
    {
      country: Yup.string(),
      phoneNumber: Yup.string()
        .min(6, 'Please enter valid Phone Number')
        .max(15, 'Please enter valid Phone Number')
        .required('Please enter mobile number'),
      first_name: Yup.string().trim().required('Please enter first name'),
      last_name: Yup.string().trim().required('Please enter last name'),
      // address: Yup.string().when('address', value => {
      //   if (value) {
      //     return Yup.string()
      //       .min(5, 'Address must be more than 5 characters long')
      //       .max(255, 'Address must be less than 255 characters long');
      //   } else {
      //     return Yup.string()
      //       .transform((value, originalValue) => {
      //         // Convert empty values to null
      //         if (!value) {
      //           return null;
      //         }
      //         return originalValue;
      //       })
      //       .nullable()
      //       .optional();
      //   }
      // }),
      address: Yup.string().nullable(),
      email: Yup.string().nullable(),
      pincode: Yup.string().nullable().min(6).max(6),
      // email: Yup.string().when('email', value => {
      //   if (value) {
      //     console.log('value: ', value);
      //     return Yup.string().email('Please enter an valid email address');
      //   } else {
      //     console.log('when value: ', value);
      //     return Yup.string()
      //       .transform((value, originalValue) => {
      //         // Convert empty values to null
      //         if (!value) {
      //           return null;
      //         }
      //         return originalValue;
      //       })
      //       .nullable()
      //       .optional();
      //   }
      // }),
      // pincode: Yup.string().when('pincode', value => {
      //   if (value) {
      //     return Yup.string()
      //       .min(6, 'Please enter a valid pincode')
      //       .max(6, 'Please enter a valid pincode');
      //   } else {
      //     return Yup.string()
      //       .transform((value, originalValue) => {
      //         // Convert empty values to null
      //         if (!value) {
      //           return null;
      //         }
      //         return originalValue;
      //       })
      //       .nullable()
      //       .optional();
      //   }
      // }),
    },
    [
      // ['address', 'address'],
      // ['email', 'email'],
      // ['pincode', 'pincode'],
    ],
  );

  const initialValues: IUserValues = {
    country: '+91',
    phoneNumber: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    pincode: '',
    devices: [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: values => {
      const {} = values;
      const params = {
        ...values,
      };
      onSubmit && onSubmit(params);
    },
  });
  return formik;
};
