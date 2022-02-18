# 영어단어 암기 API Project - Frontend

## Description

영어단어 암기 API의 Frontend Repo입니다  
 TypeScript와 React를 이용했으며  
전역 State관리로 Recoil을 사용했습니다.

---

## Used Language & Libraries

- ### TypeScript

- ### React
  - React-Query
  - React-hook-Form
  - React-Router
- ### Recoil
- ### CSS
  - styled-components
  - framer-motion
  - react-apexcharts

---

## Content - 페이지별 기능 상세설명

- ### 공통 요소
  - recoil을 이용하여 현재 user의 state localStorage에 저장
  - 로그아웃 상태일때 로그인 페이지로 이동
- ### Courses
  - 현재 데이터베이스의 단어 세트를 최초 렌더링시만 불러옴 - react-query의 usequery 활용
  * 현재 유저 컬렉션에 있는 단어 세트는 하트표시 아니면 빈 하트
  * 하트를 누를시 유저 컬렉션에서 사라지고 빈 하트표시로 변함
  * UX를 위해 하트의 on/off가 바로 되도록 만들었지만 하트를 누른다고 해서 유저가 그동안 외웠던 데이터가 사라지지 않음(쉽게 누를수있을만큼 실수의 여지가 있으므로 의도치 않은 삭제 방지)
- ### Collection
  - 단어모음에서 하트를 누른 단어세트들이 표시 -> useEffect로 최초 렌더링시만 실행되며 axios 함수를 사용해 fetch
  - 세트를 누를시 안의 내용들과 성취도를 볼 수 있는 페이지로 연결
  - 페이지에서 단어와 뜻을 가릴 수 있으며 한페이지에 10개씩 단어들을 볼 수 있음
  - 다 외운 단어들을 체크표시할 수 있으며 체크에 따라 현재 state가 upgrade 된다
  - 성취도 보기를 클릭시 총 단어 대비 외운 단어의 수가 그래프로 나타난다
  - save를 누를시 전체 완료단어 state가 업그레이드 된다
  - 뒤로 표시된 화살표를 통해서만 페이지를 나가는 것이 가능, 이 화살표 클릭시 save를 통해 업그레이드된 전체 완료단어들을 axios의 patch method 유저 데이터 upgrade(네트워크 통신 최소화)
  - 단어 세트 삭제시 해당 단어 세트의 모든 완료단어를 없앤 상태로 state가 업그레이드 되며 이전 state를 useRef를 활용해 렌더링 되어도 변하지 않는 변수에 저장
  - 세트 삭제 확정시 바뀐 state로 업데이트되고 완료단어들과 현재 컬렉션 리스트에서 해당 세트가 모두 삭제
  - 취소시 useRef에 저장된 변수로 다시 전체 완료단어 state 업그레이드
- ### Board

  - DRF를 통해 CRUD 구현
  - useEffect와 axios함수를 활용해 최초 렌더링시에만 데이터를 가져온다
  - 게시물 제목을 클릭했을때 작성자 본인일 경우에만 삭제 및 수정버튼이 드러남

- ### Login/Sign up / Profile
  - react-hook-form을 이용해 validation 구현

---

## 관련 URL

- ### 프로젝트 URL : https://memovoca.shop

- ### Backend: https://github.com/kdm0320/Memorize_English_Backend.git

- ### 개발용: https://github.com/kdm0320/Memorize_English

## Reference

- ### 토익 빈출영어단어 327
  https://bonlivre.tistory.com/75
- ### 기본 영어단어 1000개
  https://m.blog.naver.com/cu1023/221296679654
