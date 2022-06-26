---
date: '2022-05-26'
title: '2. Spring 프로젝트 생성하는법'
categories: ['Spring']
summary: '1일차 공부'
thumbnail: './image/Spring.png'
---

## _1일차 공부기록_

# 프로젝트 생성하는법!

#### intellij ultimate 버전을 쓰면 spring 프로젝트를 쉽게 생성할 수 있지만 다른 방법으로 https://start.spring.io/ Spring initializr 를 이용하여 프로젝트를 생성할 수 있다.

<img src="https://velog.velcdn.com/images/zabcd121/post/40793a9f-3751-41cf-b62f-5cd2d4e66f80/image.png" width="90%">

#### 1. Maven, Gradle 둘 중에 선택해야 하는데 이건 필요한 라이브러리를 땡겨 오고 내가 빌드하는 LifeCycle을 관리해주는 툴이다! 과거에는 Maven을 많이 사용했지만 요즘은 Gradle로 넘어오는 추세이니 Gradle을 선택하면 된다.

#### 2. Language는 java 선택

#### 3. spring boot 버전을 선택해야 하는데 SNAPSHOT, M1 버전은 아직 정식 release된 버전이 아니므로 현재 정식 release된 버전 중에 가장 최신인 2.7.0을 선택

#### 4. Project Metadata에서

- Group: 기업 도메인 같은 것을 넣는데 개인에게는 아무거나 넣어도 상관 없는 것 같음
- Artifact: Build 되고 나서의 결과물 이름
- Name: 프로젝트 이름
- Description: 프로젝트 설명
- Package Name: 패키지 명
- Packaging: Jar OR WAR 선택(나는 JAR 선택)
- JAVA: 현재 사용하는 JDK버전 선택(나는 11 선택)

#### 5. Dependencies

- ADD DEPENDENCIES를 누르고 <img src="https://velog.velcdn.com/images/zabcd121/post/4631e547-6ca9-4f05-91dd-de3013beaa6c/image.png" width="90%" height="10%">
  ##### (1) 나는 웹프로젝트를 만들것이기 때문에 Spring Web을 추가
  ##### (2) html을 만들어주는 Template Engine으로 Thymeleaf를 추가

#### 이렇게 설정을 마치고 GENEREATE를 누르면 ZIP파일이 다운되는데 압축 풀면 프로젝트 생성은 끝!

#### 그리고 이제 intellij에서 프로젝트를 open하면 되는데 이 때 build.gradle을 선택해서 open하면 됨. 이 때 외부 라이브러리를 다운받기 때문에 시간이 조금 걸린다..

<br><br>

# 프로젝트 구조

### - .idea폴더: intellij가 사용하는 설정 파일

### - gradle폴더: gradle을 쓰는 폴더

### - src폴더: main과 test 폴더가 구분되어 있고 src -> main -> java밑에 패키지와 실제 소스파일이 존재

### - resources폴더: src.main아래에 존재하고 실제 자바 코드 파일을 제외한 xml, properties, 설정파일들이 존재

### - build.gradle: 버전을 설정하고 라이브러리를 가져옴(자세한건 나중에 공부!)

<br>
<br>

# 첫 실행

![](https://velog.velcdn.com/images/zabcd121/post/9f8a6e82-0e38-48db-98ae-8d28e20dca28/image.png)

#### 이렇게 나오면 성공!

#### SpringBootApplication이 tomcat 웹서버를 내장하고 있어서 spring boot와 같이 실행됨!

![](https://velog.velcdn.com/images/zabcd121/post/d1b2914c-89a7-4b1f-b100-2d3f407d321c/image.png)

#### 여기서 "Build and run using" 과 "Run tests using" 두 부분을 Gradle에서 intellij IDEA로 변경. (build시에 gradle을 통하면 느릴 수 있음)
