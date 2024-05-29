## About Git

개인 토큰 발급하기
   참고 블로그 : https://blog.naver.com/yxngbbxng/223166405387

### 토큰 발급
- 기본 협업: GitHub에서 기본적인 협업(리포지토리 접근, 포크, 풀 리퀘스트 생성, 이슈 작성 등)은 토큰 없이도 가능합니다.
- HTTPS로 리포지토리에 접근: HTTPS를 사용하여 리포지토리에 접근할 때는 사용자명과 비밀번호를 입력하면 됩니다. 최근 GitHub는 보안을 강화하기 위해 비밀번호 대신 개인 액세스 토큰(PAT)을 사용하도록 권장하고 있습니다.
- API 사용: GitHub API를 사용하여 자동화된 작업을 수행하거나 외부 애플리케이션이 GitHub와 상호작용하도록 하려면 개인 액세스 토큰이 필요합니다.
- 작업 시 토큰이 필요하다면 그때 토큰 발급하면 될 것 같습니다! 혹시 몰라서 일단 적어놓을게요 

코딩알려주는누나 Git 명령어 모음
https://hackmd.io/@oW_dDxdsRoSpl0M64Tfg2g/ByfwpNJ-K

<br>
  
## Git Clone (Terminal or Cmd)
팀 협업 깃인 경우 원격 저장소 레퍼의 내용을 각자의 로컬 환경 저장소로 복제하여 *동일한* 환경을 만든다.

🥨 1.개인 로컬에서 프로젝트 폴더를 생성한다.
터미널에서 cd로 프로젝트 폴더 경로에 진입한다
~~~
cd [프로젝트 폴더 경로]
git clone [복제할 원격 레포지토리 주소] //현재 이 Git 주소 
~~~

🥨 2. Git에서 내 브랜치 생성하기
~~~
git checkout -b //생성할 브랜치 이름
git branch //현재 내 브랜치상태를 확인하고 main으로 되어있다면 
git switch 생성한 브랜치 이름 //switch로 내 브랜치로 이동해준다. 
~~~
🥨 3. main 브랜치로 merge 병합

🥕 branch 이름은 본인 이름 추천드립니다. 
~~~
git add . 
git commit -m 'message' //코드 상태 간략히 설명해주면 좋다. 깃과 버전이 다른 경우를 대비해 내 코드를 클라우드에 올리고 아직 (push)는 하면 안된다.
git pull origin main (:wq)  //깃의 최신버전 받아와 동기화를 해주기 _프로젝트가 없다면 생략가능 그 이후부터는 필수!!!!!🌟🌟🌟🌟
git push origin mybranch // 내 버전 + 깃 동기화된 코드를 푸쉬하여 최신 상태로 만들어주기
~~~
🌟🌟🌟 main으로 바로 푸쉬되지 않게 꼭 브랜치 확인 🌟🌟🌟


제가 실수했던 점 
pull받으며 메인의 모든 폴더가 내려오는데 이를 삭제하면 깃에서도 삭제되더라고요 ..ㅎㅎ 깃 = 폴더 상태는 무조건 동일하게!! <br>
만약 깃 꼬이거나 메인 깃 잘못건드릴 것 같으면 그냥 새 폴더 만들어서 다시 클론 & 풀 동기화하는 것도 깔끔하더라고요 

<br>

## Git HUb
🥨 4. push까지 했으면 git저장소로 이동한다.

깃에서 내 브랜치로 이동하여 *Compare & pull request* 를 클릭 후 **base 'main' <- compare 'mybranch'** 를 확인한다.
<img width="866" alt="image" src="https://github.com/lhr0055/Anything/assets/129835424/b36b2a9c-3a8d-4d94-a5db-83ce5d3eade7">

풀리퀘 요청 제목 및 설명을 작성 후 Create Pull request를 클릭한다.
정상적으로 풀리퀘가 되었으면 Merge 제목 및 설명을 작성한다.
최종적으로 Merge pull request를 누른다.
