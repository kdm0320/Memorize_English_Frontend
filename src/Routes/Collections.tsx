import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { WorldSet } from "../Components/Worldset";

interface IAnswer {
  answer: string;
}

const datas = [
  {
    pk: "1",
    title: "토익",
    content: [
      ["abbreviate", "축약하다, 단축하다"],
      ["accommodate", "수용하다"],
      ["accuse A of B", "B를 이유로 A를 고발하다"],
      ["acquaint", "익히다, 숙지하다"],
      ["admantly", "확고하게"],
      ["adequate", "적절한"],
      ["adhere", "고수하다"],
      ["adhesive", "점착성의"],
      ["alleviate", "줄이다, 완화하다"],
      ["amendment", "개정"],
      ["anticipate", "예상하다"],
      ["approve", "승인하다, 찬성하다"],
      ["aspect", "면, 측면"],
      ["aspire", "열망하다"],
    ],
  },
  {
    pk: "2",
    title: "회화",
    content: [
      ["assess", "평가하다, 감정하다"],
      ["assume", "맡다, 취하다"],
      ["assure", "보증하다, 안심시키다"],
      ["apparently", "외관상으로는, 분명히"],
      ["as to", "~에 관하여"],
      ["assign", "임무를 할당하다"],
      ["associate", "관련시키다"],
      ["attendant", "안내원, 참석자"],
      ["attentive", "주의 깊은, 경청하는"],
      ["attraction", "관광명소"],
      ["attribute", "~에 귀착시키다"],
      ["banquet", "연회"],
      ["barring", "~이 없다면, ~을 제외하고"],
      ["be eligible for", "~에 대한 자격이 있다"],
      ["be reluctant to", "~하기를 꺼리다"],
    ],
  },
];

const Test = styled(motion.div)`
  background-color: teal;
  width: 80vw;
  height: 90vh;
  top: 20;
  right: 0;
  left: 0;
  margin: 0 auto;
`;

const Content = styled(Test)`
  background-color: whitesmoke;
  border-color: black;
  border-style: solid;
`;

const Word = styled.input`
  border: 0;
  background-color: whitesmoke;
  outline: 0;
  cursor: default;
`;

function Collection() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAnswer>();
  const [word, setWord] = useState(0);
  const [onTest, setOnTest] = useState(false);

  const toggleOnTest = () => {
    setOnTest((prev) => !prev);
  };
  const [isBlindMean, setIsBlindMean] = useState(false);
  const [isBlindWord, setIsBlindWord] = useState(false);
  const toggleMeanBlind = () => setIsBlindMean((prev) => !prev);
  const toggleWordBlind = () => setIsBlindWord((prev) => !prev);

  const onTestClicked = (setId: string) => {
    toggleOnTest();
    navigate(`/collection/test/${setId}`);
  };
  const onCloseClicked = () => {
    if (onTest) toggleOnTest();
    navigate(`/collection`);
  };
  const clickedSet = setId && datas.find((set) => set.pk === setId);
  const onValid = (data: IAnswer) => {
    console.log(data);
  };
  const onSetClicked = (setId: string) => {
    navigate(`/collection/${setId}`);
  };
  return (
    <div>
      <AnimatePresence>
        {setId && !onTest ? (
          <Content key="Content">
            {clickedSet && (
              <>
                <button key="test" onClick={() => onTestClicked(setId)}>
                  test
                </button>
                <button key="close" onClick={onCloseClicked}>
                  close
                </button>
                <button key="wordBlind" onClick={toggleWordBlind}>
                  단어 가리기
                </button>
                <button key="meanBlind" onClick={toggleMeanBlind}>
                  뜻 가리기
                </button>
                {clickedSet.content.map((word, index) => (
                  <div>
                    <span key={index + "#" + word[0]}>{index + 1}</span>
                    <form>
                      {isBlindWord ? null : (
                        <Word key={word[0]} readOnly value={word[0]} />
                      )}
                      {isBlindMean ? null : (
                        <Word key={word[1]} readOnly value={word[1]} />
                      )}
                      <input type="button" value="단어장에 저장" />
                    </form>
                    <br key={index + word[0] + "br"} />
                  </div>
                ))}
              </>
            )}
          </Content>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {setId && onTest ? (
          <Test>
            {clickedSet && (
              <>
                <span>{errors.answer?.message}</span>
                <div>{clickedSet.content[word][0]}</div>
                <form onSubmit={handleSubmit(onValid)}>
                  <input></input>
                </form>
                <button onClick={onCloseClicked}>close</button>
              </>
            )}
          </Test>
        ) : null}
      </AnimatePresence>
      {datas.map((data) => (
        <WorldSet onClick={() => onSetClicked(data.pk)} key={data.pk}>
          {data.title}
        </WorldSet>
      ))}
    </div>
  );
}

export default Collection;