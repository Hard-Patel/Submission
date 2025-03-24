import {useFormik} from 'formik';
import {phoneNumberMask} from 'utils/globals.variables';
import * as Yup from 'yup';

export interface ILoginValues {
  country: string;
  phoneNumber: string;
  email: string;
  phoneNumberMasked: string;
}

export interface ILoginForm {
  onSubmit: (params: ILoginValues) => void;
}

export const useLoginForm = ({onSubmit}: ILoginForm) => {
  const schema = Yup.object().shape({
    country: Yup.string(),
    phoneNumber: Yup.string(),
    email: Yup.string(),
    phoneNumberMasked: Yup.string(),
  });

  const initialValues: ILoginValues = {
    country: '91',
    phoneNumber:  __DEV__ ? '9586417274' : '',
    email: '',
    phoneNumberMasked: '',
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
