import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "react-loading";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { baseUrl, fetchUser } from "../api";
import { isLoggedAtom, IUserInfo, userInfoAtom } from "../atoms";

interface IProFileInfo {
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface IProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

function Profile() {
  const isLogged = useRecoilValue(isLoggedAtom);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) navigate("/");
  }, [isLogged]);
  const userInfo = useRecoilValue(userInfoAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileForm>();
  const { isLoading, data } = useQuery<IProFileInfo>(
    ["userInfo", userInfo],
    () => fetchUser(userInfo)
  );
  const [isUpdate, setIsUpdate] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const toggleIsUpdate = () => setIsUpdate((prev) => !prev);
  const profileMutate = useMutation(
    ({
      userInfo,
      firstName,
      lastName,
      email,
    }: {
      userInfo: IUserInfo;
      firstName: string;
      lastName: string;
      email: string;
    }) =>
      axios.patch(
        `${baseUrl}/users/${userInfo.pk}/`,
        { first_name: firstName, last_name: lastName, email: email },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
  );
  const onValid = (data: IProfileForm) => {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const email = data.email;
    profileMutate
      .mutateAsync({
        userInfo,
        firstName,
        lastName,
        email,
      })
      .then(() => toggleIsUpdate())
      .catch((e) => setErrorCode(e.response["status"]));
  };
  const avatarMutate = useMutation(
    ({ userInfo, formData }: { userInfo: IUserInfo; formData: any }) =>
      axios.patch(
        `${baseUrl}/users/${userInfo.pk}/`,
        { avatar: formData },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "content-type": "multipart/form-data",
          },
        }
      )
  );
  const [file, setFile] = useState<any>("");
  const onImgChange = async (event: FormEvent<HTMLInputElement>) => {
    const files: any = event.currentTarget.files;
    setFile(files);
    console.log(event.currentTarget.files);
  };
  const uploadAvatar = () => {
    const formData = new FormData();
    formData.append("uploadImage", file[0]);
    avatarMutate
      .mutateAsync({ userInfo, formData })
      .then(() => {
        toggleIsUpdate();
        console.log("Fuck");
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      {isLoading || profileMutate.isLoading ? <Loading /> : null}
      {isUpdate ? (
        <div>
          <h3>저장되었습니다</h3>
          <button onClick={toggleIsUpdate}>완료</button>
        </div>
      ) : null}
      <div>
        <h3>Avatar</h3>
        <input type="file" onChange={onImgChange} />
        <button onClick={uploadAvatar}>Save</button>
        <button>Delete</button>
      </div>
      <div>
        <h3>Info</h3>

        <hr />
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("firstName", {
              required: "필수 입력 항목입니다.",
            })}
            defaultValue={data?.first_name}
            placeholder="성(First Name)"
          />
          <span>{errors.firstName?.message}</span>
          <input
            {...register("lastName", { required: "필수 입력 항목입니다." })}
            placeholder="이름(Last Name)"
            defaultValue={data?.last_name}
          />
          <span>{errors.lastName?.message}</span>
          <input
            {...register("email", {
              required: "필수 입력 항목입니다.",
              pattern: {
                value: /@/,
                message: "유효한 형식을 입력하십시오",
              },
            })}
            defaultValue={data?.email}
            placeholder="이메일(E-mail)"
          />
          {errorCode === 409 ? <span>이미 존재하는 이메일입니다</span> : null}
          <span>{errors.email?.message}</span>
          <button>save</button>
        </form>
      </div>
    </>
  );
}

export default Profile;
