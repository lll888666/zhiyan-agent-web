export type RevisionItem = {
  original: string;
  revised: string;
  edit_type: string;
  reason: string;
  learnable_rule: string;
};

export type RiskItem = {
  title: string;
  severity: string;
  evidence_text: string;
  explanation: string;
  suggestion: string;
};

export type ReportData = {
  paper_title: string;
  summary: string;
  polished_text: string;
  revision_items: RevisionItem[];
  risk_items: RiskItem[];
  priority_actions: string[];
};

const isString = (value: unknown): value is string => typeof value === 'string';
const CORE_FIELDS = ['paper_title', 'summary', 'polished_text', 'revision_items', 'risk_items', 'priority_actions'] as const;

type ParseReportDataResult = { ok: true; data: ReportData; warnings: string[] } | { ok: false; message: string };

function parseRevisionItems(value: unknown, warnings: string[]): RevisionItem[] {
  if (!Array.isArray(value)) return [];
  const validItems = value.filter(
    (item): item is RevisionItem =>
      Boolean(item) &&
      typeof item === 'object' &&
      isString((item as RevisionItem).original) &&
      isString((item as RevisionItem).revised) &&
      isString((item as RevisionItem).edit_type) &&
      isString((item as RevisionItem).reason) &&
      isString((item as RevisionItem).learnable_rule)
  );

  if (validItems.length !== value.length) {
    warnings.push('revision_items 中存在非法项，已自动忽略。');
  }
  return validItems;
}

function parseRiskItems(value: unknown, warnings: string[]): RiskItem[] {
  if (!Array.isArray(value)) return [];
  const validItems = value.filter(
    (item): item is RiskItem =>
      Boolean(item) &&
      typeof item === 'object' &&
      isString((item as RiskItem).title) &&
      isString((item as RiskItem).severity) &&
      isString((item as RiskItem).evidence_text) &&
      isString((item as RiskItem).explanation) &&
      isString((item as RiskItem).suggestion)
  );

  if (validItems.length !== value.length) {
    warnings.push('risk_items 中存在非法项，已自动忽略。');
  }
  return validItems;
}

function parsePriorityActions(value: unknown, warnings: string[]): string[] {
  if (!Array.isArray(value)) return [];
  const validItems = value.filter((item): item is string => isString(item));
  if (validItems.length !== value.length) {
    warnings.push('priority_actions 中存在非字符串项，已自动忽略。');
  }
  return validItems;
}

export function parseReportData(input: unknown): ParseReportDataResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'JSON 顶层结构应为对象。' };
  }

  const raw = input as Record<string, unknown>;
  const warnings: string[] = [];
  const missingCoreFields = CORE_FIELDS.filter((field) => !(field in raw));

  if (missingCoreFields.length > 0) {
    warnings.push(`JSON 字段不完整，将按可用字段展示（缺少：${missingCoreFields.join('、')}）。`);
  }

  const paperTitle = isString(raw.paper_title) ? raw.paper_title : '未命名报告';
  if (!isString(raw.paper_title) && 'paper_title' in raw) {
    warnings.push('paper_title 类型错误，已使用默认标题。');
  }

  const summary = isString(raw.summary) ? raw.summary : '';
  if (!isString(raw.summary) && 'summary' in raw) {
    warnings.push('summary 类型错误，已置空。');
  }

  const polishedText = isString(raw.polished_text) ? raw.polished_text : '';
  if (!isString(raw.polished_text) && 'polished_text' in raw) {
    warnings.push('polished_text 类型错误，已置空。');
  }

  if ('revision_items' in raw && !Array.isArray(raw.revision_items)) {
    warnings.push('revision_items 类型错误，已置为空数组。');
  }
  if ('risk_items' in raw && !Array.isArray(raw.risk_items)) {
    warnings.push('risk_items 类型错误，已置为空数组。');
  }
  if ('priority_actions' in raw && !Array.isArray(raw.priority_actions)) {
    warnings.push('priority_actions 类型错误，已置为空数组。');
  }

  return {
    ok: true,
    data: {
      paper_title: paperTitle,
      summary,
      polished_text: polishedText,
      revision_items: parseRevisionItems(raw.revision_items, warnings),
      risk_items: parseRiskItems(raw.risk_items, warnings),
      priority_actions: parsePriorityActions(raw.priority_actions, warnings),
    },
    warnings,
  };
}

export function validateReportData(input: unknown): { ok: true; data: ReportData } | { ok: false; message: string } {
  const parsed = parseReportData(input);
  if (!parsed.ok) return parsed;
  if (parsed.warnings.length > 0) {
    return { ok: false, message: parsed.warnings[0] };
  }
  return { ok: true, data: parsed.data };
}
