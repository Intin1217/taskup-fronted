import { useEffect, useState } from 'react';
import {
  MainPageContainer,
  ProjectListContainer,
  ProjectListArea,
  ProjectListTitle,
  TitleText,
  ProjectListTitleName,
  ProjectList,
  ProjectListItem,
  ListTableBox,
  ListTextValue,
  ListTextNameAreaBox,
  StyledFaCircleCheck,
  StyledFaRegCheckCircle,
} from './TaskList.styled';
import Pagination from '@components/Pagination/Pagination';
import axios from 'axios';
import { useUserStore } from '@stores/UserStore/userStore';

interface Task {
  id: number;
  title: string;
  sub_title: string;
  content: string;
  status: number;
  members: string[];
  startDate: string;
  endDate: string;
  user: {
    name: string;
  };
}

export default function TaskList() {
  const { user } = useUserStore();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  //데이터 요청 값 저장
  const [callTaskListData, setCallTaskListData] = useState<Task[]>([]);

  //데이터 요청
  useEffect(() => {
    const callTaskListData = async () => {
      try {
        //나중에 주소 변경
        const response = await axios.get('http://localhost:4000/tasks');
        if (response && response.data) {
          setCallTaskListData(response.data.data.data);
        }
      } catch (error) {
        console.log('ERROR', error);
      }
    };

    callTaskListData().catch(console.error);
  }, []);

  //유저가 멤버로 들어가 있는 목록 필터링해서 넣어주기~
  if (!user) {
    return null;
  }

  const userTaskList = callTaskListData.filter((item) => item.members.includes(user.name));
  const currentTasks = userTaskList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  //체크박스
  const handleCompleteClick = (id: number) => {
    setCallTaskListData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: item.status == 1 ? 2 : 1 } : item,
      ),
    );
  };

  if (!user) {
    return null;
  }

  return userTaskList.length == 0 ? (
    <>
      <MainPageContainer>
        <ProjectListContainer>
          <ProjectListArea>
            <ProjectListTitle>
              <TitleText>Num</TitleText>
            </ProjectListTitle>
            <ProjectListTitleName>
              <TitleText>Name</TitleText>
            </ProjectListTitleName>
            <ProjectListTitle>
              <TitleText>CheckBox</TitleText>
            </ProjectListTitle>
          </ProjectListArea>
          <ProjectList>
            <p>프로젝트가 없습니다</p>
          </ProjectList>
        </ProjectListContainer>
      </MainPageContainer>
    </>
  ) : (
    <>
      <MainPageContainer>
        <ProjectListContainer>
          <ProjectListArea>
            <ProjectListTitle>
              <TitleText>Num</TitleText>
            </ProjectListTitle>
            <ProjectListTitleName>
              <TitleText>Name</TitleText>
            </ProjectListTitleName>
            <ProjectListTitle>
              <TitleText>CheckBox</TitleText>
            </ProjectListTitle>
          </ProjectListArea>
          <ProjectList>
            {currentTasks
              .filter((item) => item.members.includes(user.name))
              .map((item) => (
                <ProjectListItem
                  backgroundColor={item.id % 2 === 0 ? '#e0e0e0' : 'white'}
                  key={item.id}>
                  <ListTableBox>
                    <ListTextValue>{item.id}</ListTextValue>
                  </ListTableBox>
                  <ListTextNameAreaBox>
                    <ListTextValue>{item.title}</ListTextValue>
                    <ListTextValue className="content">{`${item.content.slice(0, 10)}...`}</ListTextValue>
                  </ListTextNameAreaBox>
                  <ListTableBox>
                    <ListTextValue
                      onClick={() => {
                        handleCompleteClick(item.id);
                      }}>
                      {item.status === 1 ? <StyledFaCircleCheck /> : <StyledFaRegCheckCircle />}
                    </ListTextValue>
                  </ListTableBox>
                </ProjectListItem>
              ))}
          </ProjectList>
        </ProjectListContainer>
        <Pagination
          pageLength={userTaskList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </MainPageContainer>
    </>
  );
}
