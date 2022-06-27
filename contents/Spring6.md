---
date: '2022-06-01'
title: '6. Spring Bean 등록'
categories: ['Spring']
summary: '6일차 공부'
thumbnail: './image/Spring.png'
---

## 6일차 공부(2022.06.01)

# Spring Bean을 등록하는 법

1. 컴포넌트 스캔과 자동 의존관계 설정
2. 자바 코드로 직접 스프링 빈 등록

## 1. 컴포넌트 스캔방식

MemberController가 MemberService를 통해서 회원가입하고 데이터 조회를 할 수 있어야 함. MemberController가 MemberService를 의존한다.

#### @Controller 어노테이션을 붙이면 Spring이 동작할 때 Spring Container가 이 어노테이션이 붙어있는 Controller 클래스 객체를 생성해서 가지고 있고 관리함.

#### => Spring Container에서 Spring Bean이 관리된다고 표현함!

#### MemberController가 MemberService 객체를 가지고 있는데 이거를 new로 내부에서 생성하기 보다는 주입 받아서 사용하는게 좋음

> 여기서 MemberService를 자동으로 연결하려면 MemberSerivce도 Bean으로 등록해야 하므로 _@Service_ 어노테이션을 붙여줘야 함.
> AND
> MemberRepository interface의 구현체인 MemoryMemberRepository클래스에는 _@Repository_ 어노테이션을 붙여줘야 함.

이런식으로 Spring은 정형화된 패턴으로 구성되어 있다!

#### 이렇게되면 Spring Container에 Controller, Servicem, Repository에 해당하는 3개의 클래스가 Spring Bean으로 등록된 것

### Spring Bean 등록 과정

#### 이제 여기서 이 3개의 클래스들을 자동으로 연결 해주려면

#### 1. Controller, Service, Repository(구현체에) 클래스에 각각 @Controller, @Service, @Repository를 붙이고 Bean으로 등록한다.

#### 2. Controller클래스에서 Service를 주입 받도록 DI개념을 이용하여 생성자를 구성하고 @Autowired를 붙인다. @Autowired를 붙이면 그 생성자를 호출할 때 자동으로 Spring Container에 있는 해당 Service 객체를 가져다가 연결해준다.

```java
@Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }
```

#### 3. Service클래에서도 Repository를 주입받도록 생성자를 구성하고 @Autowired를 붙인다. 자동으로 생성자를 호출할 때 Spring Container에 있는 해당 Repository 객체를 가져다가 연결해준다.

```java
@Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
```

#### 이렇게되면 Controller -> Service -> Repository가 연결됨

### 컴포넌트 방식이고 @Component라는 키워드로 Component로 등록도 가능하다.

@Controller, @Service, @Repository는 @Compoent가 붙어있는 interface이다.
![](https://velog.velcdn.com/images/zabcd121/post/7fc4b093-8ff6-4ff3-a444-2be1596cf340/image.png)

#### Spring은 Spring Container에 Bean을 등록할 때 기본적으로 싱글톤 패턴으로 등록하여 유일하게 하나만 등록해서 공유하도록 한다.

#### 따라서 같은 Bean이면 모두 같은 Instance이다.

#### 추가 설정으로 싱글톤을 사용하지 않도록 할 수 있지만, 특수한 경우를 제외하고는 **싱글톤**으로 사용함

<img src="https://velog.velcdn.com/images/zabcd121/post/69173bd8-53e8-4362-aa66-dfb0f65afb53/image.png" width=700px>
위의 예제에서는 HelloSpringApplication클래스에서 main을 통해 Spring이 실행되는데 package는 hello.hellospring이다.
기본 설정으로는 이 패키지와 동일하거나 하위 패키지의 클래스들은 Spring이 자동으로 뒤져서 @을 확인하고 Bean으로 등록하는 컴포넌트 스캔 과정을 거치지만
그 외부의 패키지라면 컴포넌트 스캔 과정을 거치지 않는다.
<img src="https://velog.velcdn.com/images/zabcd121/post/95037679-6b78-4541-8f41-9c1312a668d7/image.png" width=700px>
@SpringBootApplication 내부를 확인해보면 @ComponentScan이 존재

## 2. 자바 코드로 직접 스프링 빈 등록

Spring이 실행될 때 @Configuration을 읽고

```java
@Configuration
public class SpringConfig {

    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository(){
        return new MemoryMemberRepository();
    }
}

```

@Bean을 붙인 메서드들을 호출하여 위처럼 생성 로직을 실행하여 생성된 객체를 Spring Bean으로 등록함.

#### Controller는 어차피 Spring이 관리하는거기 때문에 @Controller를 놔두고 이게 컴포넌트 스캔을 통해서 Bean으로 등록하고 @Autowired를 붙인 생성자 통해서 내가 Spring Bean으로 등록한 Service를 넣어줌

### 이렇게 직접 자바 코드로 관리할 수도 있다.

> **DI의 방법에는 필드 주입, 생성자 주입, setter 주입 3가지 방법이 있음.**
> 실행중에 동적으로 의존관계가 변하는 경우는 거의 없으므로 생성자 주입을 권장

### 1. 필드 주입

```java
@Controller
public class MemberController {

    @Autowired final MemberService memberService;

}
```

수정하기가 힘들어서 잘 사용하지 않음

### 2. 생성자 주입

```java
@Controller
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }
}
```

### 3. setter 주입

```java
@Controller
public class MemberController {

    private MemberService memberService;

    @Autowired
    public void setMemberService(MemberService memberService){
        this.memberService = memberService;
    }
```

단점: Controller를 호출할 때 setter가 public으로 열려 있어야 하므로 문제가 발생할 수도 있음.

생성하는 시점에만 주입하고 그 뒤에는 변경을 못하도록 구성해야 됨!
의존관계가 실행중에 동적으로 변하는 경우는 거의 없으므로

## 결론

### 1.생성자 주입을 사용하자!

### 2. Spring Bean을 등록하는 방식으로 실무에서는 주로 정형화된 컨트롤러, 서비스, 리포지토리에는 컴포넌트 스캔 방식을 사용한다.

### 3. 정형화되지 않거나, 상황에 따라 구현 클래스를 변경해야 하면 자바 코드로 직접 설정하여 Spring Bean으로 등록한다.

```java
@Configuration
public class SpringConfig {

    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository(){
        return new DBMemberRepository();
    }
}
```

위의 memberRepository() 메서드와 같이 리턴 값을 다른 구현 class로 변경하면 다른 코드를 하나도 수정할 것 없이 리포지토리 구현체를 변경할 수 있다.

## 주의

**@Autowired를 통한 DI는 스프링이 관리하는 객체에서만 동작한다.**
