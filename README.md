# 구현과정 상세 설명

## 1단계
### 기능 구현 목록
- 주어진 문자열 데이터를 저장값 형태로 변환하기
- 변환한 데이터를 이차원 배열 형태로 저장하기
- 데이터에서 필요한 정보 얻기
  - 가로크기
  - 세로크기
  - 구멍의 수
  - 공의 수
  - 플레이어 위치
- 출력할 지도 데이터 다시 기호 형태로 변환하기
- 지도와 지도정보 데이터 출력하기
### 코드설명 및 풀이 과정
1. 먼저 mvc패턴 적용을 위해 model역할을 하는 MapMaker, view역할의 GameViewer, controller역할의 GameController클래스를 만들었습니다. 그리고 게임을 호출하는 App클래스를 만들었습니다.
2. MapMaker클래스
  - processMapData(): 주어진 문자열의 기호를 저장값으로 변환하고 `\n`을 기준으로 분할해 이차원 배열로 데이터를 가공합니다.
  - setStages(): 가공된 데이터를 순회하며 스테이지 구분점인 `4`를 기준으로 각 스테이지 별로 이차원 배열 형태로 `stages`객체에 저장합니다.
  - setStagesInfo(): 각 스테이지별 정보를 객체 형태로 `stagesInfo`객체에 저장합니다. 이 때 키 값은 `stages`에서 사용한 키와 동일한 키를 사용합니다.
  - setMapData(): 위 `setStages()` 와 `setStagesInfo()`함수를 실행합니다.
3. GameViewer클래스
  - renderMap(): 지도 배열을 인자로 받으며, 입력받은 인자를 다시 기호로 변환한 뒤 문자열 형태로 출력합니다.
  - renderInfo(): 지도 정보를 가진 객체를 인자로 받으며, 입력받은 인자의 프로퍼티를 출력합니다.
  - renderStage(): 현재 스테이지의 단계, 지도, 정보를 인자로 받으며, `renderMap()` 와 `renderInfo()`함수를 실행합니다.
4. GameController클래스
  - model클래스와 view클래스를 호출하며 생성합니다. 
  - init(): model의 `setMapData()`와 view의 `renderStage()`함수를 실행하는 함수입니다.
5. App클래스
  - GameController클래스를 호출하며 실질적으로 게임을 실행하게 되는 클래스입니다.
### 실행결과
```
Stage1

#####
#OoP#
#####

가로크기: 5
세로크기: 3
구멍의 수: 1
공의 수: 1
플레이어 위치 (2,4)

Stage2

  #######
###  O  ###
#    o    #
# Oo P oO #
###  o  ###
 #   O  #
 ########

가로크기: 11
세로크기: 7
구멍의 수: 4
공의 수: 4
플레이어 위치 (4,6)
```

## 2단계
### 기능 구현 목록
- 스테이지 2지도 출력하기
- 사용자 입력 받기
  - 프롬프트는 `SOKOBAN>`로 표시
- 입력받은 문자열을 순회하며 입력 값에 따라 지도 상태 변경
- 수행할 명령 메시지 출력
  - w: 위쪽
  - a: 왼쪽
  - s: 아래쪽
  - d: 오른쪽
  - q: 프로그램 종료
- 수행할 수 없는 명령일 경우 경고 메시지 출력
### 코드설명 및 풀이 과정
1. 2단계 부터 적용되는 기능은 사용자 입력을 받고 실행하는 기능들이라 컨트롤러 모듈에 작성해야 겠다고 생각했습니다.
2. GameController클래스에서 `play()`함수로 게임을 실행합니다. 게임을 실행하면 콘솔을 통해 사용자 입력을 받고, 입력 받은 명령들을 `executeCommand()`함수에서 실행하게 됩니다.
3. `changeLocation()`함수에서 저장되어 있던 플레이어의 초기 위치를 받아오고 명령을 실행합니다. 이 때 명령이 실행 된 후 새로운 위치가 비어있지 않다면 막힌 길이므로 원래 위치로 돌아갑니다.
4. 원래의 위치와 새로운 위치를 비교해 길이 막혀있는 것을 판단하고 막히지 않았다면 플레이어의 위치가 달라졌으므로 지도의 상태를 변경합니다.
5. 변경된 지도를 `renderMap()`함수로 출력합니다.
6. 길이 막혔다면 명령을 수행할 수 없으므로 에러 메세지를 출력하고, 막히지 않았다면 명령의 결과에 맞춰 메세지를 출력합니다.
### 실행결과
```
Stage2

  #######
###  O  ###
#    o    #
# Oo P oO #
###  o  ###
 #   O  #
 ########

SOKOBAN> ddzw
  #######
###  O  ###
#    o    #
# Oo  PoO #
###  o  ###
 #   O  #
 ########

d: 오른쪽(으)로 이동합니다.
  #######
###  O  ###
#    o    #
# Oo  PoO #
###  o  ###
 #   O  #
 ########

d: (경고!) 해당 명령을 수행할 수 없습니다!
  #######
###  O  ###
#    o    #
# Oo  PoO #
###  o  ###
 #   O  #
 ########

z: (경고!) 해당 명령을 수행할 수 없습니다!
  #######
###  O  ###
#    oP   #
# Oo   oO #
###  o  ###
 #   O  #
 ########

w: 위(으)로 이동합니다.
SOKOBAN> q
Bye~
```

## 3단계
### 기능 구현 목록
- map.txt파일 읽어오는 기능
- 처음 시작시 Stage 1이 출력되도록 초기화 기능
- r명령 입력시 스테이지를 초기화 하는 기능
- 플레이어가 공일 밀경우 상태 변경
  - 새로운 자리에 공을 넣고
  - 원래 자리에 공을 삭제
  - 공이 두 두 개 연속할 경우 상태 변경 불가
- 구멍에 다른 물체가 겹칠 경우 상태 변경
  - 플레이어가 구멍 위치에 같이 있는 경우
  - 플레이어가 떠날 경우 다시 분리
  - 공이 구멍 위치에 같이 있는 경우
  - 공이 떠날 경우 다시 분리
- 구멍에 다른 물체가 겹칠 경우 출력 모습 변경
  - 플레이어가 겹칠 경우 플레이어 출력
  - 공이 겹칠 경우 '0'출력
- 플레이어 이동수 카운트 기능
- 모든 볼을 구멍에 옮겼을 때 스테이지 클리어 하는 기능
- 게임 클리어시 축하메시지 출력 기능
### 코드설명 및 풀이 과정
<img width="996" alt="image" src="https://user-images.githubusercontent.com/75062526/145173355-094f54d3-1a52-40e1-be95-6b65c35a9bff.png">
<img width="922" alt="image" src="https://user-images.githubusercontent.com/75062526/145173214-b8280928-91f3-413c-9123-c858bd31457e.png">

- 사용자가 움직일 때마다 발생할 수 있는 경우들을 먼저 정리하고 코드를 작성하기 시작했습니다.
- `readFile()`함수에서 file System을 이용해 map.txt파일을 읽어옵니다.
- `r`커맨드가 입력되면 `resetStage()`함수를 실행해 스테이지를 초기화 합니다.
- `changePlayerLocation()`함수에서 플레이어가 움직일 경우 지도의 상태를 변경하고 변경된 상태를 출력합니다.
- 플레이어의 자리가 변경될 때 마다 이동수를 카운트 하고 `renderTurn()`함수로 출력합니다
- `countGoal()`함수에서 지도를 탐색하며 골의 개수와 스테이지 정보의 구멍의 개수가 같다면 `stageClear()`함수를 실행합니다.
- `stageClear()`함수를 실행할 때 마지막 스테이지였다면 `renderGameClearMessage()`함수를 실행해 게임 클리어 축하 메시지를 출력합니다.

### 실행결과
```
소코반의 세계에 오신 것을 환영합니다!
^오^

Stage1

#####
#OoP#
#####

SOKOBAN> a
#####
#0P #
#####

a: 왼쪽(으)로 이동합니다.
턴수: 1

빠밤! Stage1 클리어!

Stage2

  #######
###  O  ###
#    o    #
# Oo P oO #
###  o  ###
 #   O  #
 ########

(...게임 진행중 🏁)

Stage5

#####
#P  #
#   # ###
# oo# #O#
# o ###O#
###    O#
 ##     #
 #   #  #
 #   ####
 #####

(...게임 진행중 🏁)

#####
#   #
#   # ###
#   # #0#
#   ###0#
###   P0#
 ##     #
 #   #  #
 #   ####
 #####

d: 오른쪽(으)로 이동합니다.
턴수: 95

전체 게임을 클리어하셨습니다!
축하드립니다! 🎉

SOKOBAN> r
r: 게임을 초기화합니다.

Stage1

#####
#0P #
#####

SOKOBAN>
```
