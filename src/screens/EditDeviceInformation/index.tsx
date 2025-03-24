import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { AddIcon, BackArrowIcon } from "assets/svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IDeviceValues, IExpiryType, useDeviceForm } from "./useDeviceForm";
import AssignedUserItem from "./AssignedUserItem";
import { isExpired } from "utils/globals.functions";
import moment from "moment";
import { DATE_FORMAT } from "../../constants";
import { useDeviceDetailsQuery } from "hooks/apiHelpers/useDeviceDetails";
import { IDeviceControlTabDetailResponse, IDeviceRel } from "interface/device";
import { useDeviceDetailsUpdate } from "hooks/apiHelpers/useDeviceDetailUpdateQuery";
import { IDeviceUpdateRequestData } from "interface/login";
import { useAssignUsersQuery } from "hooks/apiHelpers/useAssignUsers";
import { useDeviceRechargeRequestQuery } from "hooks/apiHelpers/useRechargeRequest";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { I_ROLE_SC } from "interface/user";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { QueryKeys } from "../../api/QueryKeys";
import { useQueryClient } from "react-query";

const EditDeviceInformation = (
  props: RootStackScreenProps<"EditDeviceInformation">
) => {
  const {
    navigation,
    route: {
      params: { edit, device_id },
    },
  } = props;
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { user } = useSelector((state: RootState) => state.user);
  const user_id = user?.profile?.user_id ?? "";
  const { tryUpdateDeviceDetails } = useDeviceDetailsUpdate();
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const { isLoading, data, isFetching } = useDeviceDetailsQuery({
    device_id: device_id,
    shouldNotRefetch: true
  });
  const role_sc = user?.profile?.role_sc;

  const { tryAssignUsers } = useAssignUsersQuery();
  const { tryRechargeRequest, isLoading: isRequestingForRecharge } =
    useDeviceRechargeRequestQuery();

  const handleUpdateSuccess = () => {
    console.log("Device Updated Successfully");
    navigation.goBack();
  };

  const handleUpdateError = () => {
    console.log("Failure");
  };

  React.useEffect(() => {
    toggleGlobalLoader({ visible: isFetching || isLoading });
  }, [isLoading, isFetching]);

  const device_item = data?.data?.userDetail;

  const handleSubmitSuccess = (values: IDeviceValues) => {
    console.log("values: ", values);
    const updatedDeviceDetails: IDeviceUpdateRequestData = {
      status: 1,
      call_to_action: values.phoneNumber,
      pincode: values.pincode,
      location: values.location,
      name: values.nickname,
    };
    tryUpdateDeviceDetails({
      device_id,
      deviceDetail: updatedDeviceDetails,
      onEditDeviceError: handleUpdateError,
      onEditDeviceSuccess: handleUpdateSuccess,
    });
  };

  const handleLocalDataMutation = () => {
    const updatedDeviceDetails: IDeviceUpdateRequestData = {
      call_to_action: values.phoneNumber,
      pincode: values.pincode,
      location: values.location,
      name: values.nickname,
    };
    const cacheKey = `${QueryKeys.DeviceDetails} ${device_id}`;
    queryClient.setQueryData(cacheKey, (oldQueryData: IDeviceControlTabDetailResponse) => {
      return {
        ...oldQueryData,
        data: {
          userDetail: {
            ...oldQueryData.data.userDetail,
            ...updatedDeviceDetails,
          },
        },
      };
    })
  }

  const { values, errors, setFieldValue, setValues, handleSubmit } =
    useDeviceForm({
      onSubmit: handleSubmitSuccess,
    });

  const handleSuccess = () => {};

  const handleError = () => {};

  const hndleDeleteUserPress = (user_id: string) => {
    handleLocalDataMutation();
    tryAssignUsers({
      device_id: device_id,
      remove_users: [user_id],
      onAssignUserSuccess: handleSuccess,
      onAssignUserError: handleError,
    });
  };

  const handleDeviceRechargeRequestPress = () => {
    tryRechargeRequest({ device_id, user_id });
  };

  React.useEffect(() => {
    if (data && data?.data?.userDetail) {
      console.log("data?.data?.userDetail: ", data?.data?.userDetail);
      const values: IDeviceValues = {
        expiry: moment(device_item.recharge_expiry_date).format(DATE_FORMAT),
        imei_number: device_item.sn,
        isExpired:
          data?.data?.userDetail?.RechargeRequest?.length > 0
            ? IExpiryType.REQUESTED
            : isExpired(device_item.recharge_expiry_date)
            ? IExpiryType.EXPIRED
            : IExpiryType.NORMAL,
        location: device_item.location,
        nickname: device_item.name,
        phoneNumber: device_item.call_to_action,
        pincode: device_item.pincode,
        users: device_item?.DeviceRel,
      };
      setValues(values);
    }
  }, [isLoading, isFetching, data]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "Edit Device Information",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <BackArrowIcon color={theme.colors.gray[900]} />
        </TouchableOpacity>
      ),
      headerRight: () => <></>,
      headerTitleAlign: "center",
    });
  }, [theme, navigation, headerTitleStyle]);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      showsVerticalScrollIndicator={false}
      extraScrollHeight={50}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      onKeyboardWillShow={(frames: Object) => {
        console.log("Keyboard event", frames);
      }}
    >
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: theme.colors.text[900],
              fontFamily: fontFamily.medium,
              fontSize: 20,
              lineHeight: 30,
            }}
            numberOfLines={2}
          >
            {`${device_item?.name ?? ""}`}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: theme.colors.text[800],
            fontFamily: fontFamily.regular,
            fontSize: 16,
            lineHeight: 24,
            marginTop: 2,
          }}
          numberOfLines={2}
        >
          {`IMEI no. : ${device_item?.sn ?? ""}`}
        </Text>
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Device Nickname:
        </Text>
        <TextInput
          value={values.nickname}
          onChangeText={(e) => {
            setFieldValue("nickname", e);
          }}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 8,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.nickname && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 16,
              paddingTop: 2,
            }}
          >
            {errors.nickname}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Device Location:
        </Text>
        <TextInput
          value={values.location}
          onChangeText={(e) => {
            setFieldValue("location", e);
          }}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            marginTop: 8,
            paddingVertical: 10,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.location && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 16,
              paddingTop: 2,
            }}
          >
            {errors.location}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Pincode:
        </Text>
        <TextInput
          value={values.pincode}
          onChangeText={(e) => {
            setFieldValue("pincode", e);
          }}
          maxLength={6}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            marginTop: 8,
            paddingVertical: 10,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.pincode && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 16,
              paddingTop: 2,
            }}
          >
            {errors.pincode}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Call to Action:
        </Text>
        <TextInput
          value={values.phoneNumber}
          onChangeText={(e) => {
            setFieldValue("phoneNumber", e);
          }}
          maxLength={10}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            marginTop: 8,
            paddingVertical: 10,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.phoneNumber && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 16,
              paddingTop: 2,
            }}
          >
            {errors.phoneNumber}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Recharge Expiry:
        </Text>
        {values.isExpired == IExpiryType.EXPIRED ? (
          <TouchableOpacity
            onPress={() => {
              handleDeviceRechargeRequestPress();
            }}
            disabled={isRequestingForRecharge}
            style={{
              backgroundColor: theme.colors.background[950],
              width: "100%",
              marginTop: 12,
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              borderWidth: 1,
              borderColor: theme.colors.border[700],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isRequestingForRecharge ? (
                <ActivityIndicator
                  color={theme.colors.primary[900]}
                  size={"small"}
                />
              ) : (
                <Text
                  style={{
                    color: theme.colors.text[900],
                    fontFamily: fontFamily.semiBold,
                    fontSize: 14,
                    lineHeight: 24,
                  }}
                >
                  Request For Recharge
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ) : values.isExpired == IExpiryType.REQUESTED ? (
          <TouchableOpacity
            disabled
            style={{
              backgroundColor: theme.colors.background[950],
              width: "100%",
              marginTop: 12,
              height: 50,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              borderWidth: 1,
              borderColor: theme.colors.primary[600],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: theme.colors.primary[600],
                  fontFamily: fontFamily.semiBold,
                  fontSize: 14,
                  lineHeight: 24,
                }}
              >
                Request Sent
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              value={`Expires on: ${values.expiry}`}
              editable={false}
              style={{
                backgroundColor: theme.colors.background[950],
                paddingHorizontal: 14,
                marginTop: 8,
                paddingVertical: 10,
                borderRadius: 8,
                fontSize: 16,
                fontFamily: fontFamily.regular,
                lineHeight: 24,
                color: theme.colors.text[600],
                borderColor: theme.colors.border[900],
                borderWidth: 1,
              }}
            />
            {errors.expiry && (
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.state.failure,
                  fontFamily: fontFamily.regular,
                  paddingHorizontal: 16,
                  paddingTop: 2,
                }}
              >
                {errors.expiry}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        {role_sc == I_ROLE_SC.OWNER ? (
          <>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamily.regular,
                lineHeight: 27,
                marginBottom: 8,
                color: theme.colors.text[700],
              }}
            >
              Assigned Users:
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.background[950],
                borderRadius: 8,
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderColor: theme.colors.border[900],
                borderWidth: 1,
              }}
            >
              {values?.users?.map((user: IDeviceRel, index: number) => {
                return (
                  <AssignedUserItem
                    user={user}
                    index={index}
                    isLastItem={index == values.users.length - 1}
                    handleDeletePress={hndleDeleteUserPress}
                  />
                );
              })}
              <TouchableOpacity
                onPress={() => {
                  handleLocalDataMutation()
                  navigation.navigate("AssignUsersListScreen", {
                    device_id: device_id,
                    user_list: values?.users?.map((userItem) => {
                      return userItem.User.id;
                    }),
                  });
                }}
                style={{
                  backgroundColor: theme.colors.black[900],
                  width: "100%",
                  height: 40,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AddIcon />
                  <Text
                    style={{
                      color: theme.colors.white[900],
                      fontFamily: fontFamily.semiBold,
                      fontSize: 14,
                      lineHeight: 24,
                      marginLeft: 6,
                    }}
                  >
                    Assign New User
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <></>
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              backgroundColor: theme.colors.background[600],
              marginTop: 18,
              flex: 1,
              height: 50,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginRight: 4,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
            style={{
              backgroundColor: theme.colors.primary[900],
              marginTop: 18,
              height: 50,
              borderRadius: 8,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                color: theme.colors.white[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              {edit ? "Save Changes" : "Activate Device"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export { EditDeviceInformation };
