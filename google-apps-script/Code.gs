/**
 * MindLog 마음 일기 - Google Apps Script (GAS) CRUD API
 * 
 * 시트 헤더 컬럼 구조:
 * A열: timestamp (생성/수정 고유 타임스탬프 또는 ID)
 * B열: datetime  (일기 작성 날짜 및 시간 표기)
 * C열: content   (일기 본문 내용)
 */

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "datetime", "content"]);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 공통 처리 함수 (doGet 및 doPost 모두 지원하여 리디렉션 이슈 해결)
function handleRequest(params) {
  const sheet = getSheet();
  const action = params.action || "read";

  // 1. READ (조회)
  if (action === "read") {
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ success: true, count: 0, items: [] });
    }

    const rows = data.slice(1);
    const items = rows.map(function(row, index) {
      return {
        rowIndex: index + 2,
        timestamp: String(row[0]),
        datetime: String(row[1]),
        content: String(row[2])
      };
    });

    if (params.timestamp) {
      const found = items.find(function(item) {
        return item.timestamp === String(params.timestamp);
      });
      if (found) {
        return createJsonResponse({ success: true, item: found });
      } else {
        return createJsonResponse({ success: false, message: "해당 timestamp의 일기를 찾을 수 없습니다." });
      }
    }

    return createJsonResponse({ success: true, count: items.length, items: items });
  }

  // 2. CREATE (생성)
  if (action === "create") {
    const timestamp = params.timestamp || new Date().getTime().toString();
    const datetime = params.datetime || new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const content = params.content || "";

    sheet.appendRow([timestamp, datetime, content]);

    return createJsonResponse({
      success: true,
      message: "일기가 성공적으로 저장되었습니다.",
      data: { timestamp: timestamp, datetime: datetime, content: content }
    });
  }

  // 3. UPDATE (수정)
  if (action === "update") {
    const targetTimestamp = String(params.timestamp || "");
    if (!targetTimestamp) {
      return createJsonResponse({ success: false, message: "수정할 timestamp가 필요합니다." });
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === targetTimestamp) {
        const rowNum = i + 1;
        if (params.datetime !== undefined) {
          sheet.getRange(rowNum, 2).setValue(params.datetime);
        }
        if (params.content !== undefined) {
          sheet.getRange(rowNum, 3).setValue(params.content);
        }

        return createJsonResponse({
          success: true,
          message: "일기가 성공적으로 수정되었습니다.",
          data: {
            timestamp: targetTimestamp,
            datetime: params.datetime !== undefined ? params.datetime : data[i][1],
            content: params.content !== undefined ? params.content : data[i][2]
          }
        });
      }
    }
    return createJsonResponse({ success: false, message: "수정 대상 timestamp를 찾을 수 없습니다." });
  }

  // 4. DELETE (삭제)
  if (action === "delete") {
    const targetTimestamp = String(params.timestamp || "");
    if (!targetTimestamp) {
      return createJsonResponse({ success: false, message: "삭제할 timestamp가 필요합니다." });
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === targetTimestamp) {
        sheet.deleteRow(i + 1);
        return createJsonResponse({
          success: true,
          message: "일기가 성공적으로 삭제되었습니다.",
          timestamp: targetTimestamp
        });
      }
    }
    return createJsonResponse({ success: false, message: "삭제 대상 timestamp를 찾을 수 없습니다." });
  }

  return createJsonResponse({ success: false, message: "지원하지 않는 액션입니다: " + action });
}

function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    return handleRequest(params);
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

function doPost(e) {
  try {
    let params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }
    return handleRequest(params);
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}
