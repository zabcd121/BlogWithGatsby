---
date: '2022-05-27'
title: '3. Spring Library📗와 프로젝트 설정'
categories: ['Spring']
summary: '2일차 공부'
thumbnail: './image/Spring.png'
---

## _**2일차 공부 기록!**_

# 1. Spring Library📗

```
build.gradle

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

#### 실제로 내가 추가했던 spring-boot-starter-web, thymeleaf 라이브러리와 자동 생성되는 spring-boot-starter-test 라이브러리가 의존성에 추가되어 있다.

#### 하지만! External Libraries에 들어가보면 엄청나게 많은 라이브러리들이 연결되어 있다.

#### maven, build과 같은 빌드 툴들은 의존관계를 관리해주는데

#### 예를 들어 내가 spring-boot-starter-web 라이브러리를 추가하면 그거에 또 의존 관계가 연결되어 있는 tomcat, mvc와 같은 라이브러리들이 함께 자동 다운로드된다.

#### 이런식으로 spring core까지 연결된다고 생각하면 됨

<img src="https://velog.velcdn.com/images/zabcd121/post/db6b6063-cd04-44a5-9876-1c1f54764c57/image.png" width=400>

#### 트리구조라고 생각!

## Embedded Server

#### tomcat이 같이 설치되면서 자체적으로 내장 서버를 가지고 있으니 run을 돌리면 웹 서버가 자동 실행되는 것임. 따라서 따로 tomcat 서버를 설치하고 설정하는 귀찮은 작업을 안해도 됨.

## Logging

#### 서버 개발자라면 System.out.print()를 지양하고 Log를 사용함. 위험한 에러 같은 것을 기록하기 위해 사용한다고 함.

![](https://velog.velcdn.com/images/zabcd121/post/0deeb7d5-c538-48e1-88e5-9e9a57b397e7/image.png)

#### thymeleaf를 라이브러리를 추가하면 spring-boot-starter가 설치되고 그 안에는 logging과 관련된 라이브러리가 또 의존관계에 의해 설치된다. logback, log4j, slf4j가 있는데 요즘에는 slf4j와 logback의 조합을 많이 사용함.

#### slf4j는 쉽게 말해서 interface이고 logback은 출력 구현체라고 생각하면 됨!(추가로 찾아보기)

## Test

#### testCompileClassPath에 가보면 여러가지 테스트 관련 라이브러리들이 있는데 자바진영에서는 테스트할 때 junit이란 라이브러리를 많이 사용함

<img src="https://velog.velcdn.com/images/zabcd121/post/5313cb14-9f84-4d8f-a8b3-02aa23897c9a/image.png" width=50%>

<br>
<br>

## 정리

### 스프링 부트 라이브러리

#### spring-boot-starter-web

- spring-boot-starter-tomcat: 톰캣 (웹서버)
- spring-webmvc: 스프링 웹 MVC

#### spring-boot-starter-thymeleaf: 타임리프 템플릿 엔진(View)

#### spring-boot-starter(공통): 스프링 부트 + 스프링 코어 + 로깅

- spring-boot
  - spring-core
- spring-boot-starter-logging
  - logback, slf4j

### 테스트 라이브러리

#### spring-boot-starter-test

- junit: 테스트 프레임워크
- mockito: 목 라이브러리
- assertj: 테스트 코드를 좀 더 편하게 작성하게 도와주는 라이브러리
- spring-test: 스프링 통합 테스트 지원

# 2. View 환경설정

#### 처음 http://localhost:8080/ url로 이동해봤을 때

![](https://velog.velcdn.com/images/zabcd121/post/2023e2a1-43fe-44c9-aa03-9027c25d3c6a/image.png)

#### 와 같은 에러 페이지가 나오는데 이건 내가 아무것도 설정하지 않아서 그런 것!

#### resources/static 하위에 index.html 파일을 넣어주면 자동으로 Spring Boot가 지원하는 Welcome Page 기능 사용 가능

https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.spring-mvc.welcome-page

> 자료가 너무 방대하니 다 외울수는 없다! 공식 사이트 spring.io에 가서 문서를 찾아볼 수 있도록 하자.

#### 위의 과정을 진행하면 정적 페이지를 생성하는 것임

## 템플릿 엔진

#### 템플릿 엔진을 사용하면 동적 페이지로 동작하도록 할 수 있음!

#### 내가 사용할 템플릿 엔진은 앞서 설치했던 thymeleaf

- thymeleaf 공식 사이트: https://www.thymeleaf.org/
- Spring 공식 tutorial: https://spring.io/guides/gs/serving-web-content/
- Spring Boot 매뉴얼: https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/html/spring-boot-features.html#boot-features-spring-mvc-template-engines

### 연습 예제!

1. index.html 생성 (resources/static/index.html)

```
<!DOCTYPE HTML>
<html>
<head>
    <title>Hello</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
Hello
<a href="/hello">hello</a>
</body>
</html>
```

2. controller 생성

```
package hello.hellospring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloController {

    @GetMapping("hello")
    public String hello(Model model){
        model.addAttribute("data", "hello!");
        return "hello";
    }
}

```

3. thymeleaf를 이용한 동적 페이지 생성(resources/templates/hello.html)

```
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Hello</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<p th:text="'안녕하세요. ' + ${data}" >안녕하세요. 손님</p>
</body>
</html>
```

### 동작 원리

<img src="https://velog.velcdn.com/images/zabcd121/post/a57de011-a9ba-438f-b306-39f62ce2b840/image.png" width=50%>
출처: 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술(김영한)

#### 내가 controller에서 get메서드에서 반환했던 hello라는 String 값을 viewResolver가 기본적으로 resources:templates/ + {ViewName} + .html로 매핑해서 이 html을 렌더링하도록 함.

```
<p th:text="'안녕하세요. ' + ${data}" >안녕하세요. 손님</p>
```

#### 여기서 th는 thymeleaf를 의미 그리고 ${data}는 내가 controller에서 model에 추가해준 속성 "data"를 의미하는 것이므로 "hello!"가 들어가게 됨

> 참고) spring-boot-devtools 라이브러리 추가 시, html 파일을 컴파일만 해주면 서버 재시작 없이 View 파일 변경이 가능해짐. intellij에서 컴파일 방법: build -> Recompile

<br>
<br>
2022-05-18 추가

# 3. 빌드하고 실행하기

### 1. ./gradlew.bat build(MAC: ./gralew build)

현재 프로젝트 디렉터리에서 진행해야 함
그러면 build폴더가 생기게 되고 아래와 같은 폴더 및 파일들이 생김
<img src="https://velog.velcdn.com/images/zabcd121/post/7ef4ad96-9402-422f-aad7-75ef8a471a6e/image.png" width=60%>

### 2. cd libs

<img src="https://velog.velcdn.com/images/zabcd121/post/3e3957ba-47be-42b8-84da-3994bfa39de1/image.png" width="60%">

libs 폴더 내에 hello-spring-0.0.1-SNAPSHOT.jar, hello-spring-0.0.1-SNAPSHOT-plain.jar가 존재

#### 3. java -jar {project name}-0.0.1-SNAPSHOT.jar

![](https://velog.velcdn.com/images/zabcd121/post/edc6786d-ac30-4f8d-8558-11abdbe03b5f/image.png)
정상 동작하고 localhost:8080도 잘 돌아감!

### 따라서 서버 배포할 때는 이 jar파일만 서버에 넣어주고 3번 명령문을 실행 하면 됨. 이러면 서버에서도 spring이 동작하게 됨!

### 과거에는 서버에 tomcat 설치하고 이런저런 복잡한 과정이 있었는데 이제는 jar파일만 넣고 실행시키면 된다고 하니 참 편해진 것 같다.

> 참고: ./gradlew.bat clean (MAC: ./gradlew clean)을 진행하면 build폴더 삭제

### 참고

#### 궁금한점: gradlew가 뭘까?

#### - gradle wrapper의 줄인말!

#### - 새로운 환경에서 프로젝트를 설정할 때 java나 gradle을 설치하지 않고 바로 빌드하게 해주는 역할

#### - gradlew는 shell script(쉘에서 사용할 수 있는 명령어들의 조합을 모아서 만든 Batch파일)

> 쉘: OS상에서 사용자가 입력하는 명령을 읽고 해석하여 대신 실행해주는 프로그램.
> (OS의 Kernel과 사용자 사이를 이어주는 역할)
> 뜬금없지만 예전에 운영체제 과목에서 공부한 개념 복습..

#### - gradlew.bat는 window batch script

<p align="center">
<img src="https://velog.velcdn.com/images/zabcd121/post/e2b4ae6e-fc68-486b-b5ff-18d4e7ace3d4/image.png"  width=40%>
  </p>

참고: https://docs.gradle.org/current/userguide/gradle_wrapper.html

#### gradle을 어떻게 따라서는 여러번 써봤는데 어떤 원리인지 어떤건지는 모르고 썼던 것 같다. 아직 모르지만 시간 나면 먼저 공부해보고 싶다!
