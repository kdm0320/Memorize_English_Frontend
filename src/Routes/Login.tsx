import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { baseUrl } from "../api";
import { isLoggedAtom, userInfoAtom } from "../atoms";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Box,
  Btn,
  Error,
  Form,
  Input,
  LeftBox,
  Phrase,
  RightBox,
  Wrapper,
} from "../Components/Others";
import Footer from "../Components/Footer";

interface ILoginForm {
  username?: string;
  password?: string;
}

const PhraseVariant = {
  start: {
    opacity: 1,
  },
  end: {
    opacity: 0,
  },
};

const SignupText = styled(motion.span)`
  color: rgba(225, 112, 85, 1);
  margin-left: 2%;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const IsAccount = styled(motion.span)`
  margin-right: 1%;
`;

const AskBox = styled.div`
  margin-top: 4%;
`;
const LoginBtnBox = styled.div`
  height: 20%;
  padding-bottom: 10%;
`;
const LoginError = styled(Error)`
  margin-right: 35%;
`;
const Error400 = styled(Error)`
  padding-bottom: 30%;
`;
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation((user: ILoginForm) =>
    axios.post(`${baseUrl}/users/login/`, user)
  );
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedAtom);
  const setUserAtom = useSetRecoilState(userInfoAtom);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/collection");
  }, []);
  const onValid = (data: ILoginForm) => {
    mutation
      .mutateAsync({
        username: data.username,
        password: data.password,
      })
      .then((value) => {
        setIsLoggedIn(true);
        setUserAtom({
          id: data.username,
          pk: value.data["id"],
          token: value.data["token"],
        });
        navigate("/collection");
      });
  };
  const [isSignup, setIsSignup] = useState(false);

  const test = () => {
    setIsSignup((prev) => !prev);
  };
  const signUpClick = () => {
    test();
    setTimeout(() => {
      navigate("/signup");
    }, 400);
  };
  return (
    <>
      <Wrapper>
        <Box>
          <LeftBox>
            <Phrase
              variants={isSignup ? PhraseVariant : undefined}
              initial="start"
              animate="end"
            >
              Welcome!
            </Phrase>
          </LeftBox>
          <RightBox>
            {mutation.isError ? (
              <Error400>
                아이디 혹은 비밀번호 오류입니다 다시 확인해 주십시오
              </Error400>
            ) : null}
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("username", { required: "필수 항목입니다." })}
                placeholder="ID"
                variants={isSignup ? PhraseVariant : undefined}
                initial="start"
                animate="end"
              />
              <LoginError>{errors.username?.message}</LoginError>
              <Input
                {...register("password", { required: "필수 항목입니다." })}
                placeholder="Password"
                type="password"
                variants={isSignup ? PhraseVariant : undefined}
                initial="start"
                animate="end"
              />
              <LoginError>{errors.password?.message}</LoginError>

              <LoginBtnBox>
                <Btn
                  variants={isSignup ? PhraseVariant : undefined}
                  initial="start"
                  animate="end"
                >
                  LOGIN
                </Btn>
              </LoginBtnBox>
            </Form>
            <AskBox>
              <IsAccount
                variants={isSignup ? PhraseVariant : undefined}
                initial="start"
                animate="end"
              >
                Don't have a account?
              </IsAccount>
              <SignupText
                onClick={signUpClick}
                variants={isSignup ? PhraseVariant : undefined}
                initial="start"
                animate="end"
              >
                Sign up
              </SignupText>
            </AskBox>
          </RightBox>
        </Box>
      </Wrapper>
      <Footer />
    </>
  );
}

export default Login;
