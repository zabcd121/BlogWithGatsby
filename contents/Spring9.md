---
date: '2022-06-24'
title: '7. Spring DB 접근 기술 - Spring JdbcTemplate'
categories: ['Spring']
summary: '9일차 공부'
thumbnail: './image/Spring.png'
---

## 9일차 공부(2022.06.24)

### 팀 프로젝트 3개.. + 기말고사로 인해 20일만에 다시 시작하게 되었다.. 오랜만에 보는 것이니 만큼 앞에 정리한 내용들을 읽어보고 다시 시작한다!
___ 
# Spring JdbcTemplate
## 1. 특징
- Pure Jdbc와 동일한 환경에서 진행
- Mybatis와 Spring JdbcTemplate은 JDBC API에서 이전에 봤던 Connection연결하고 등등의 과정에서 반복된 코드를 제거해줌.
- SQL은 그대로 직접 작성해야 함.

## 2. Example
```java
public class JdbcTemplateMemberRepository 
                implements MemberRepository{

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcTemplateMemberRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public Member save(Member member) {
        SimpleJdbcInsert jdbcInsert = new SimpleJdbcInsert(jdbcTemplate);
        jdbcInsert.withTableName("member").usingGeneratedKeyColumns("id");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("name", member.getName());

        Number key = jdbcInsert.executeAndReturnKey(new MapSqlParameterSource(parameters));
        member.setId(key.longValue());

        return member;
    }

    @Override
    public Optional<Member> findById(Long id) {
        List<Member> result = jdbcTemplate.query("select * from member where id = ?", memberRowMapper());

        return result.stream().findAny();
    }

    private RowMapper<Member> memberRowMapper(){
        return new RowMapper<Member>() {
            @Override
            public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
                Member member = new Member();
                member.setId(rs.getLong("id"));
                member.setName(rs.getString("name"));
                return member;
            }
        }
    }
}
```
#### 기존에 pure jdbc 코드에서 반복되던 Connection을 내부에서 처리해주고, Resultset과 관련된 행동을 분리하여 간단하게 코딩할 수 있다.
<br/>

#### save로직을 보면 SimpleJdbcInsert 클래스를 통해 테이블명과 키의 네임을 설정해주고 변경할 파라미터의 key-value를 설정하면 간단하게 실행할 수 있다. Pure jdbc에 비해 코드가 훨씬 줄어들었다!




