---
date: '2022-05-28'
title: '4. Spring Web 개발 기초 개념'
categories: ['Spring']
summary: '3일차 공부'
thumbnail: './image/Spring.png'
---

## _3일차 공부_

# Spring web 개발 방법 종류

- 1. 정적 컨텐츠

- 2. MVC와 템플릿 엔진

- 3. API

## 참고) 정적 페이지와 동적 페이지의 차이

#### - 정적 페이지: 웹 서버에 이미 저장된 html문서를 client에게 전송하는 웹 페이지

- 장점: (1)요청에 대한 파일만 전송하면 되므로 속도가 빠르다., (2)다른거 없이 웹서버만 구축하면 되므로 비용이 적게 든다.
- 단점: (1)저장된 정보만 보여주므로 서비스가 한정적이다., (2)생성, 수정, 삭제의 작업이 모두 수동이므로 관리가 힘들다.

#### - 동적 페이지: 요청 정보를 가공처리한 후에 html 문서를 생성하여 client에게 전송하는 웹 페이지

- 장점: (1)다양한 정보를 이용하여 동적 생성하여 제공하므로 서비스가 다양해진다., (2)웹 사이트 구조에 따라 생성, 수정, 삭제 등의 작업이 용이하다.
- 단점: 가공처리 과정 때문에 상대적으로 느리다., 웹 서버 이외에 추가적으로 처리를 위한 WAS(Web Application Server)가 필요하다.

## 1. 정적 페이지

- https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/html/spring-boot-features.html#boot-features-spring-mvc-static-content
- 앞 게시물에서 했던 것과 같이 resources/static 폴더에 hello.html 정적 페이지를 생성하면 자동으로 매핑되어 http://localhost:8080/hello.html로 이동하면 확인 할 수 있음.
- 간략한 동작과정: http://localhost:8080/hello.html 요청이 오면 내장 톰캣 서버가 spring에게 넘기는데 spring은 우선 컨트롤러에서 hello관련 컨트롤러를 탐색하고 존재하지 않으면 resources: static/hello.html 을 탐색하여 반환해준다.
  (중간에 더 많은 과정이 있지만 간략하게 설명한 것임.)

## 2. MVC와 템플릿 엔진

- 과거에 많이 쓰던 JSP와 PHP 같은게 동적 페이지를 생성하기 위한 템플릿 엔진이다.
- 동적 페이지 개발을 위해서 Model, View, Controller가 필요
- 템플릿 엔진을 이용하여 View를 Controller로 조작하여 동적 페이지로 동작하도록 해줌.
  <br>

#### 과거 jsp에서는 view와 controller가 분리되지 않고 view에서 모든 것을 한 곳에서 프로그래밍하는 Model1 방식을 많이 사용했었는데 현재는 MVC패턴을 많이 사용한다!

- View는 그저 화면을 그리는데 모든 영향을 집중해야 함.
- Controller Business Logic과 관련되거나 어떤 내부적인 로직을 처리하는데 집중해야 함
- Model은 화면에서 필요한 관련된 것들을 담아서 전달하는데 사용

#### 따라서 분리해야 함!

<br>
<br>

```java
HelloController.java

@GetMapping("hello-mvc")
    public String helloMvc(@RequestParam("name") String name, Model model){
        model.addAttribute("name", name);
        return "hello-template";
    }


resources/templates/hello-template.html

<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<p th:text="'hello ' + ${name}">hello! empty</p>
	</body>
</html>
```

##### p태그 안의 <th:text="'hello ' + ${name}">hello! empty 는 {name}값이 서버에서 넘어오면 hello! empty라는 default값이 새로운 값으로 대체됨

http://localhost:8080/hello-mvc?name=spring와 같이 뒤에 param을 같이 넘겨주면 controller에서 Model에 속성을 추가하여 화면에서 View에서 사용할 수 있음.

> 강의 중 꿀팁: intellij에서 ctrl + p 누르면 parameter 정보 얻을 수 있음.

## 3. API(Application Programming Interface)

- React, Vue 같은 frontend framework 쓸 때도 api로 데이터만 내려주면 화면은 client가 알아서 그릴 때 사용
- 서버끼리 데이터 통신할 때 사용

```java
//Controller클래스 내부

	@GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name){
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }
```

- @ResponseBody
  - HTTP 통신 내에서 Header와 Body중에서 Body에 return 하는 데이터를 직접 넣어주겠다!
    - viewResolver 대신에 HttpMessageConverter가 동작
    - 기본 문자처리는 StringHttpMessageConverter
    - 기본 객체처리는 MappingJackson2HttpMessageConverter
      > 객체를 json으로 변환해주는 라이브러리 중 하나가 Jackson!(Spring의 Default)

서버를 실행하고 확인해보면
![](https://velog.velcdn.com/images/zabcd121/post/dbe12c22-c156-4214-9ff8-6d70629412c1/image.png)

와 같이 Spring의 default 형식으로 json 형식으로 나오게 됨.

XML은 열고 닫는 태그를 써야해서 불편한데 JSON은 key value형식으로 간단해서 편한 것 같다!

#### 동작원리

http api요청이 들어오면
내장 톰캣 서버가 스프링에게 알려주고 해당 api 관련 메서드가 있는지 확인하는데 그 메서드에 @ResponseBody가 붙어있다면 HTTP 응답으로 전해주는데 이 과정에서 HttpMessageConverter가 동작하여 메서드가 단순히 문자열을 반환한다면 StringConverter가 동작하여 문자열로, 객체가 반환된다면 JsonConverter가 동작하여 json 형태로 객체를 요청한 서버나 클라이언트로 응답한다.
