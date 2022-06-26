---
date: '2022-05-29'
title: '5. Spring 간단한 회원🙍‍♂️ 관리 예제'
categories: ['Spring']
summary: '4일차, 5일차 공부'
thumbnail: './image/Spring.png'
---

## _4일차 공부(2022.05.29)_

학교 프로젝트 마감일이 얼마 남지 않아서 개인 공부할 시간이 점점 없어졌다... 그래도 1시간씩은 꼭 공부하고 정리하려고 한다!

#### Spring 생태계를 알아보기 위한게 목적이므로 정말 단순한 연습 예제임!

## 비지니스 요구사항 정리

데이터: 회원ID, 이름
기능: 회원 등록, 조회

가정: DB저장소가 아직 안정해짐
![](https://velog.velcdn.com/images/zabcd121/post/4b1a98eb-98a7-4886-954d-615d31cbeb69/image.png)

컨트롤러: MVC의 Controller 역할
서비스: 핵심 비지니스 로직 구현 ex)회원 중복 가입 처리
리포지토리: DB에 접근, 도메인 객체를 DB에 저장하고 관리
도메인: 비지니스 도메인 객체 ex)회원, 주문 등등 주로 DB에 저장하고 관리되는 비지니스 객체

- 클래스 의존관계
  <img src="https://velog.velcdn.com/images/zabcd121/post/674c62ae-bdc9-4d19-bbc6-ec28989c53f8/image.png" width=50%> - 아직 DB가 정해지지 않았다는 가정이므로 인터페이스로 구현 클래스를 변경할 수 있도록 설계함

## 코드

```java
public class Member {

    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
public interface MemberRepository {
 Member save(Member member);
 Optional<Member> findById(Long id);
 Optional<Member> findByName(String name);
 List<Member>
}
```

> Null이 반환될 가능성이 있을 때 Optional을 사용함!

```java
public class MemoryMemberRepository implements MemberRepository{

    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    @Override
    public Member save(Member member) {
         member.setId(++sequence);
         store.put(member.getId(), member);
         return member;
    }

    @Override
    public Optional<Member> findById(Long id) {

        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Member> findByName(String name) {
        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny();
    }

    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }
}
```

## 테스트 코드 작성

##### 지금까지 매번 테스트 할 때 main을 통해서 실행했었는데 JUnit 프레임워크를 사용하여 테스트를 실행하면 빠르고 반복 가능하게 테스트 가능하다고 한다!

test 폴더에 Test클래스 생성
관례상 테스트 하려는 클래스의 이름 마지막에 Test를 붙임

```java
class MemoryMemberRepositoryTest {

    MemberRepository repository = new MemoryMemberRepository();

    @Test
    public void save(){
        Member member = new Member();
        member.setName("spring");

        repository.save(member);

        Member result = repository.findById(member.getId()).get();
        Assertions.assertEquals(member, result); //member: 기댓값, result: 결과
    }
}
```

매번 System.out.print()로 찍어내기에는 한계가 있으니
jupiter or assertj 라이브러리에서 제공하는 Assertions를 이용함!
실행 결과에 따라 성공시에는 창에 따로 찍히는거 없이 빌드 성공으로 나온다!
![](https://velog.velcdn.com/images/zabcd121/post/d59cee62-0858-4407-a631-122db69e923e/image.png)

실패시에는 test Failed가 출력됨!
![](https://velog.velcdn.com/images/zabcd121/post/86824522-120e-4657-bdf6-e8fc1bd7e359/image.png)

요즘은 assertj 라이브러리에서 제공하는 Assertions를 많이 사용함

```java
Assertions.assertThat(member).isEqualTo(result);
```

assertThat메서드를 static import하면 앞에 Assertions를 붙이지 않고 사용가능함

> 꿀팁! 변수를 복사해와서 이름이 겹칠때는 shift+F6을 눌러서 변경하면 그 변수가 사용된 곳을 함께 고쳐줌

### 테스트는 메서드, 클래스, 패키지 단위로 테스트 가능함!

### 각 메서드마다 테스트가 끝나면 데이터를 clear를 해줘야 된다!

- 왜냐하면 클래스 단위로 테스트 한다고 하면 각 메서드의 테스트 실행 순서가 보장이 되지 않아서 충돌이 발생할 수도 있다.
- 그래서 각 메서드마다 데이터를 clear해줘야 한다.

### <span style="color: red">테스트는 실행 순서에 상관이 없어야 한다!</span>

```java
	@AfterEach
    public void afterEach(){
        repository.clearStore();
    }
```

위의 코드를 테스트 클래스 안에 추가한다.
AfterEach: 항상 다른 메서드의 실행이 끝나고 나면 자동 실행되도록 함.

그리고 repository에는 저장소를 clear하는 메서드를 구현하면 됨
<br>

### TDD(Test-Driven Development)

- 테스트 코드를 먼저 작성하고 구현 클래스를 만들어서 개발하는 것
  (나중에 더 공부해보고 싶음!!)

<br>
<br>

## _5일차 공부(2022.06.01)_

## 회원 서비스 개발

##### Repository의 Role은 단순히 저장소와의 트랜잭션이고

##### Service의 Role은 비지니스 로직을 처리하는 것

따라서!

##### Repository 클래스에서는 메서드 이름이 findById와 같이 단순히 저장소와의 트랜잭션을 나타내는 네이밍을 쓰고

##### Service 클래스에서는 join, findMembers 등 비지니스 로직에 가까운 네이밍을 사용

```java
public class MemberService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();

    /**
     * 회원가입
     */
    public Long join(Member member){
        //같은 이름이 있는 중복 회원X 라고 가정
        Optional<Member> result = memberRepository.findByName(member.getName());
        result.ifPresent(m -> {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        });

        memberRepository.save(member);
        return member.getId();
    }
}
```

> 값이 null일 경우가 있다면 Optional로 감싸는게 효율적임(Optional에서 제공하는 여러 함수를 사용할 수 있으므로)

```java
memberRepository.findByName(member.getName())
                .ifPresent(m -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });
```

> Optional타입의 변수를 따로 만들지 않고 메서드 체이닝을 이용하여 할 수도 있음

```java
/**
     * 회원가입
     */
    public Long join(Member member){
        //같은 이름이 있는 중복 회원X 라고 가정
        validateDuplicateMember(member); //중복 회원 검증

        memberRepository.save(member);
        return member.getId();
    }

    private void validateDuplicateMember(Member member) {
        memberRepository.findByName(member.getName())
                .ifPresent(m -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });
    }
```

이런식으로 메서드를 검증 로직을 분리하는게 깔끔함

## 회원 서비스 테스트

### 테스트 코드의 메서드 명은 한글로 쓰면 직관적이어서 많이 사용한다!

#### given: 어떠한 상황이 주어져서

#### when: 이거를 실행했을 때

#### then: 결과가 이게 나와야 한다

이 패턴을 사용하면서 나중에 자신의 것으로 변형하는게 좋음

```java
@Test
    void 회원가입() {
        //given
        Member member = new Member();
        member.setName("hello");

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
        member1.setName("spring");
        //when
        memberService.join(member1);
        try{
            memberService.join(member2);
            fail(); //여기로 와버린다는건 예외가 발생해야 하는데 발생하지 않았다는 것이므로

        }catch(IllegalStateException e){
            assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
        }

        //then
    }
```

> try-catch문을 사용하는게 애매한 부분이 많아서 대신에 Assertions.assertThrows()사용

```java
IllegalStateException e = assertThrows(IllegalStateException.class, () -> memberService.join(member2));

assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
```

assertThrows의 첫번째 파라미터로 발생할 예외 클래스 타입을 넣고, 두번째 파라미터로 예외가 발생해야 할 작업을 람다식으로 작성.

> import static org.assertj.core.api.Assertions._;
> import static org.junit.jupiter.api.Assertions._;

static으로 import하면 메서드를 사용할 때 앞에 Assertions를 붙이지 않아도 됨

MemberRepository가 여러개 생성되는 것을 방지하기 위해서 MemberService클래스에서 MemberRepository를 주입받는 방식으로 변경

```java
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
```

MemberServiceTest클래스에서도 MemberService와 똑같은 db를 가진 MemoryMemberRepository를 사용하기 위해 @BeforeEach 어노테이션을 이용하여 각 메서드의 실행 전에 MemberSerivce에 memberRepository의 구현체인 MemoryMemberRepository를 주입시켜준다. => **DI(Dependency Injection)**

```java
class MemberServiceTest {

  MemberService memberService;
  MemoryMemberRepository memberRepository;

  @BeforeEach
  public void beforeEach(){
      memberRepository = new MemoryMemberRepository();
      memberService = new MemberService(memberRepository);
  }

  @AfterEach //다른 메서드의 동작이 끝나고 실행됨
  public void afterEach(){
      memberRepository.clearStore();
  }
  .....
}
```

<br>
<br>
