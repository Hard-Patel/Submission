import {useFormik} from 'formik';
import { IDeviceRel, IUserDeviceRelItem } from 'interface/device';
import * as Yup from 'yup';

export enum IExpiryType {
  REQUESTED=1,
  EXPIRED=2,
  NORMAL=3,
}

export interface IDeviceValues {
  nickname: string;
  location: string;
  pincode: string;
  phoneNumber: string;
  expiry: string;
  isExpired: IExpiryType;
  imei_number: string;
  users: IDeviceRel[];
}

export interface IUser {
  id: string;
  name: string;
  mobile: string;
}

export const useDeviceForm = ({
  onSubmit,
}: {
  onSubmit: (params: IDeviceValues) => void;
}) => {
  const schema = Yup.object().shape({
    country: Yup.string(),
    phoneNumber: Yup.string()
      .min(6, 'Please enter valid Phone Number')
      .max(15, 'Please enter valid Phone Number')
      .required('Please enter mobile number'),
    phoneNumberMasked: Yup.string(),
  });

  const initValues: IDeviceValues = {
    expiry: '',
    imei_number: '',
    location: '',
    nickname: '',
    phoneNumber: '',
    pincode: '',
    isExpired: IExpiryType.NORMAL,
    users: [],
  };

  const formik = useFormik({
    initialValues: initValues,
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
