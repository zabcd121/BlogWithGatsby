import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import ProfileImage from 'components/Main/ProfileImage'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlug } from '@fortawesome/free-solid-svg-icons'

type IntroductionProps = {
  profileImage: IGatsbyImageData
}

const Background = styled.div`
  width: 100%;
  //   background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(97, 186, 255, 1) 0%,
    rgba(166, 239, 253, 1) 90.1%
  );
  color: #ffffff;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 768px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    padding: 0 20px;
  }
`

const SubTitle = styled.div`
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`

const Title = styled.div`
  margin-top: 5px;
  font-size: 35px;
  font-weight: 700;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 25px;
  }
`
const LinkflexWrapper = styled.div`
  display: flex;
  width: 100%;
`

const BlogLink = styled(Link)`
  display: flex;
  width: 70px;
  target: _blank;
  margin-right: 10px;
  margin-top: 10px;
  border: 0px solid #dbdbdb;
  border-radius: 7px;
  border-box: border-box;
  padding: 1px;
  color: #1363df;
`

const Introduction: FunctionComponent<IntroductionProps> = function ({
  profileImage,
}) {
  return (
    <Background>
      <Wrapper>
        <ProfileImage profileImage={profileImage} />

        <div>
          <SubTitle>Welcome,</SubTitle>
          <Title>I'm Backend Developer HyeonSeok.</Title>
          <Title>DEV GROWTH BLOG</Title>
        </div>
        <LinkflexWrapper>
          <BlogLink to="https://github.com/zabcd121" target="_blank">
            <FontAwesomeIcon icon={faPlug} style={{ padding: '3px 2px 0 0' }} />
            Github
          </BlogLink>
          <BlogLink
            to="https://www.notion.so/Programming-Wiki-159a128e1ebc47348b0291a69d180e0b"
            target="_blank"
          >
            <FontAwesomeIcon icon={faPlug} style={{ padding: '3px 2px 0 0' }} />
            Notion
          </BlogLink>
        </LinkflexWrapper>
      </Wrapper>
    </Background>
  )
}

export default Introduction
