import { useEffect, useRef, useState } from 'react';
import { useModal, useModalState } from '../../../../stores/ModalStore/ModalStore';
import { FaCamera } from 'react-icons/fa';
import { RiCloseLargeFill } from 'react-icons/ri';
import {
  ProfileImg,
  ProfileModalBodyBox,
  ProfileModalBox,
  ProfileModalContainer,
  ProfileModalHeaderBox,
  ProfileLogOutButton,
  ProfileModalMainBox,
  ProfileNameText,
  ProfileCompleteButton,
  ProfileModalImgBox,
  ProfileImgChangeCameraIcon,
} from './ProfileModal.styled';
import { handleModalCloseClick } from '../../../../utils/HandleModalCloseClick';
import { handleFileSelectorClick } from '../../../../utils/HandleFileSelectorClick';
import { useNavigate } from 'react-router-dom';
import {
  useProfileImgStore,
  useSaveState,
} from '../../../../stores/ProfileImgStore/ProfileImgStore';

export default function ProfileModal() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, setIsOpen } = useModal();
  const { setModalState } = useModalState();
  const navigate = useNavigate();
  const { imageUrl, setImageUrl } = useProfileImgStore();
  const { saveState, setSaveState } = useSaveState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempImgUrl, setTempImgUrl] = useState<string | null>(localStorage.getItem('profileImage'));
  const localImg = localStorage.getItem('profileImg');

  useEffect(() => {}, []);

  // 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file!);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setTempImgUrl(base64Image);
        localStorage.setItem('profileImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = () => {
    if (!tempImgUrl && selectedFile === null) {
      alert('파일을 선택해 주세요');
      return;
    }
    if (saveState) {
      setImageUrl(tempImgUrl!);
      localStorage.setItem('profileImage', tempImgUrl!);
      setSaveState(false);
    }
  };

  return isOpen ? (
    <>
      <ProfileModalContainer
        onClick={() => {
          setIsOpen(false);
          setSaveState(!saveState);
          setTempImgUrl(localImg);
        }}>
        <RiCloseLargeFill className="closeIcon" />
        <ProfileModalBox
          onClick={(e) => {
            handleModalCloseClick(e);
          }}>
          <ProfileModalHeaderBox>
            <p>프로필</p>
            <ProfileCompleteButton
              onClick={() => {
                setIsOpen(false);
                setModalState('');
                setSaveState(true);
                handleImageSave();
                const savedImageUrl = localStorage.getItem('profileImage');
                setImageUrl(savedImageUrl!);
              }}>
              완료
            </ProfileCompleteButton>
          </ProfileModalHeaderBox>
          <ProfileModalBodyBox>
            <ProfileModalImgBox>
              <ProfileImg
                id={'profile_img'}
                src={tempImgUrl === null ? (localImg === null ? imageUrl : null)! : tempImgUrl}
                onClick={() => {
                  handleFileSelectorClick(fileInputRef);
                  setSaveState(!saveState);
                  setTempImgUrl(localImg);
                }}
                alt={'프로필 사진'}
              />
              <ProfileImgChangeCameraIcon className="icons" />
            </ProfileModalImgBox>
            <FaCamera className="camera" />
            <input
              type={'file'}
              accept={'image/jpeg, image/png'}
              ref={fileInputRef}
              hidden={true}
              onChange={(e) => handleImageChange(e)}
            />
            <ProfileModalMainBox>
              <ProfileNameText>이름</ProfileNameText>
              <ProfileLogOutButton
                onClick={() => {
                  setIsOpen(false);
                  setModalState('');
                  navigate('/');
                }}>
                로그아웃
              </ProfileLogOutButton>
            </ProfileModalMainBox>
          </ProfileModalBodyBox>
        </ProfileModalBox>
      </ProfileModalContainer>
    </>
  ) : null;
}
