import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { baseUrl } from "../api";
import Footer from "../Components/Footer";
import {
  AskBox,
  Box,
  Btn,
  Error,
  Form,
  Input,
  IsAccount,
  LeftBox,
  Phrase,
  PhraseBox,
  RightBox,
  SignupText,
  Wrapper,
} from "../Components/Others";

interface ISingnUpForm {
  first_name: string | null | number;
  last_name: string | null | number;
  username: string | null | number;
  password: string | null | number;
  email: string;
}

const SignUpError = styled(Error)`
  margin-right: 40%;
  font-size: 80%;
`;
const EmailError = styled(Error)`
  margin-right: 19%;
`;

const PhraseVariant = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
  },
  hover: { scale: 1.5 },
};

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISingnUpForm>();
  const navigate = useNavigate();
  const mutation = useMutation((newUser: ISingnUpForm) =>
    axios.post(`${baseUrl}/users/`, newUser)
  );

  const [errorCode, setErrorCode] = useState(0);
  const onValid = (data: ISingnUpForm) => {
    mutation
      .mutateAsync({
        username: data.username,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      })
      .then(() => navigate("/"))
      .catch((e) => setErrorCode(e.response["status"]));
  };
  const leftBoxRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Wrapper>
        <Box>
          <LeftBox ref={leftBoxRef}>
            <PhraseBox>
              <Phrase
                variants={PhraseVariant}
                drag
                dragConstraints={leftBoxRef}
                dragSnapToOrigin
                dragElastic={0.8}
                initial="start"
                animate="end"
                whileHover={"hover"}
              >
                Regist
              </Phrase>
            </PhraseBox>
          </LeftBox>
          <RightBox>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("first_name", { required: "?????? ???????????????." })}
                placeholder="???(Last Name)"
                variants={PhraseVariant}
                initial="start"
                animate="end"
              />
              <SignUpError>{errors.last_name?.message}</SignUpError>
              <Input
                {...register("last_name", { required: "?????? ???????????????." })}
                placeholder="??????(First Name)"
                variants={PhraseVariant}
                initial="start"
                animate="end"
              />
              <SignUpError>{errors.first_name?.message}</SignUpError>
              <Input
                {...register("username", {
                  required: "?????? ???????????????.",
                  pattern: {
                    value: /^[a-z]+[a-z0-9]{5,19}$/g,
                    message: "6~20??? ?????? ????????? ?????? ?????????????????????. ",
                  },
                })}
                placeholder="?????????(ID)"
                type="text"
                variants={PhraseVariant}
                initial="start"
                animate="end"
              />
              {errorCode === 400 ? (
                <EmailError>?????? ???????????? ??????????????????</EmailError>
              ) : null}
              <SignUpError>{errors.username?.message}</SignUpError>
              <Input
                {...register("email", {
                  required: "?????? ???????????????.",
                  pattern: {
                    value: /@/,
                    message: "????????? ????????? ??????????????????",
                  },
                })}
                placeholder="?????????(email)"
                variants={PhraseVariant}
                initial="start"
                animate="end"
              />
              {errorCode === 409 ? (
                <EmailError>?????? ???????????? ??????????????????</EmailError>
              ) : null}
              <SignUpError>{errors.email?.message}</SignUpError>
              <Input
                {...register("password", {
                  required: "?????? ???????????????.",
                  pattern: {
                    value: /(?=.*\d)(?=.*[a-z]).{8,}/,
                    message:
                      "?????? ?????????, ?????? ?????? 8??? ???????????? ????????? ????????????",
                  },
                })}
                variants={PhraseVariant}
                initial="start"
                animate="end"
                placeholder="????????????(Password)"
                type="password"
              />
              <SignUpError>{errors.password?.message}</SignUpError>
              <Btn variants={PhraseVariant} initial="start" animate="end">
                Create
              </Btn>
            </Form>
            <AskBox>
              <IsAccount variants={PhraseVariant} initial="start" animate="end">
                Do you already have a account?
              </IsAccount>
              <SignupText
                onClick={() => navigate("/")}
                variants={PhraseVariant}
                initial="start"
                animate="end"
              >
                Sign in
              </SignupText>
            </AskBox>
          </RightBox>
        </Box>
      </Wrapper>
      <Footer />
    </>
  );
}

export default SignUp;
