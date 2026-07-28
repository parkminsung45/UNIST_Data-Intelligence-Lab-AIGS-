# DIL-Lab_undergraduate_RA(TIL)

First Activity
7/28 2026 하계 DI × HCI 워크숍 at UNIST
https://gonngit.github.io/minds-workshop/

## TIL 자동 동기화 (Notion → GitHub)

`til/` 폴더의 내용은 Notion 데이터베이스에서 매일 자동으로 동기화됩니다 ([.github/workflows/notion-sync.yml](.github/workflows/notion-sync.yml)).

### 최초 설정 (1회)

1. https://www.notion.so/my-integrations 에서 New integration 생성 (Internal, Read content 권한만 필요)
2. 발급된 Internal Integration Secret 복사
3. Notion의 DIL Lab 페이지 우측 상단 `...` → `Connect to` → 방금 만든 integration 연결
4. 저장소에 시크릿 등록:
   ```
   gh secret set NOTION_TOKEN --repo parkminsung45/Data-Intelligence-Lab_RA_TIL
   ```
5. Actions 탭에서 "Sync Notion TIL" 워크플로를 수동 실행(`Run workflow`)해 정상 동작 확인

동기화 주기는 매일 09:00(KST)이며, Actions 탭에서 언제든 수동 실행도 가능합니다.
