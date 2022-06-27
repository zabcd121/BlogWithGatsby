---
date: '2022-06-04'
title: '7. Spring DB 접근 기술 - JDBC'
categories: ['Spring']
summary: '8일차 공부'
thumbnail: './image/Spring.png'
---
## 8일차 공부(2022.06.04)

# Spring에서 JDBC로 DB 접근 하는 방법

## 1. 초기 설정

### 1. build.gradle에 jdbc, h2 관련 라이브러리 추가

```java
implementation 'org.springframework.boot:spring-boot-starter-jdbc'
runtimeOnly 'com.h2database:h2'
```

### 2. resources/application.properties에 스프링 부트 db 연결 설정 추가

```java
spring.datasource.url=jdbc:h2:tcp://localhost/~/test
spring.datasource.driver-class-name=org.h2.Driver
```

## 2. JdbcMemeberRepository Example

- 참고) DataSource를 스프링으로부터 주입받아야 하는데, 스프링 부트가 application.properties 파일을 보고 내가 설정한 정보를 이용하여 DataSource 객체를 만들어놓는다.

```java
public class JdbcMemberRepository implements MemberRepository{

    private final DataSource dataSource;

    public JdbcMemberRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Member save(Member member) {
        String sql = "insert into member(name) values(?)";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(sql,
                    Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, member.getName());
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                member.setId(rs.getLong(1));
            } else {
                throw new SQLException("id 조회 실패");
            }
            return member;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {
            close(conn, pstmt, rs);
        }
    }
```

#### Connection 연결을 하고 PreparedStatement에 실행하고자 하는 쿼리 문을 넘겨준다. 그리고 ResultSet을 통해서 결과를 받아온다.

#### 그리고 나서 원래 이전에 Bean으로 등록한 MemoryMemberRepository를 JdbcMemberRepository로 변경한다.

```java
@Configuration
public class SpringConfig {

    private DataSource dataSource;

    @Autowired
    public SpringConfig(DataSource dataSource){
        this.dataSource = dataSource;
    }

    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository(){
        return new JdbcMemberRepository(dataSource);
    }
}
```

#### 다른 코드는 전혀 건들 것 없이 끼워넣는 부분만 수정하면 된다.

#### 객체지향 원리에서 ***다형성***과 ***Spring DI***를 잘 이용하면 ***개방폐쇄 원칙***(OCP)를 잘 지킬 수 있다. (확장에는 열려있고, 수정에는 닫혀 있다.)

<br/>

## 3. Spring 통합 테스트

```java
package hello.hellospring.service;

import hello.hellospring.domain.Member;
import hello.hellospring.repository.MemberRepository;
import hello.hellospring.repository.MemoryMemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
//@Transactional
public class MemberServiceIntegrationTest {
    @Autowired  MemberService memberService;
    @Autowired MemberRepository memberRepository;

    @Test
    void 회원가입() {
        //given
        Member member = new Member();
        member.setName("spring");

        //when
        Long savedId = memberService.join(member);

        //then
        Member findMember = memberService.findOne(savedId).get();
        assertThat(member.getName()).isEqualTo(findMember.getName());
    }

    @Test
    public void 중복_회원_예외(){
        //given
        Member member1 = new Member();
        member1.setName("spring");

        Member member2 = new Member();
        member2.setName("spring");
        //when
        memberService.join(member1);
        IllegalStateException e = assertThrows(IllegalStateException.class, () -> memberService.join(member2));

        assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");

    }


}
```
- #### 1. @SpringBootTest: 스프링으로부터 Bean을 주입받는 등 기능을 이용하려면 붙여줘야 함.
- #### 2. @Transactional:  테스트 시작전에 트랜잭션을 시작하고, 테스트 완료 후에 항상 Rollback한다. 따라서 다음 테스트에 영향을 주지 않는다. 기본적으로는 auto commit이 설정되지 않으면 쿼리를 요청했어도 롤백하면 DB에 반영되지 않는데. 테스트를 할 때 DB에 반영하지 않기를 원할 때 붙여줘야 함.
<br/>

## 4. Pure Java 테스트에 대한 생각
### Pure java로 테스트를 진행하는 것보다 SpringBootTest를 진행하는게 훨씬 느리다.
### 실제로 돌려보니 각각 회원가입 테스트를 진행할 경우 Pure java는 62ms, SpringBootTest는 482ms가 걸렸다😓

### Pure java로 테스트를 진행하는게 항상 좋은것은 아니지만 좋은 테스트일 확률이 높으므로 순수 자바로도 테스트를 할 수 있는 능력이 있어야 한다!