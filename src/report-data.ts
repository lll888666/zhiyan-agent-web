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

export function validateReportData(input: unknown): { ok: true; data: ReportData } | { ok: false; message: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'JSON 顶层结构应为对象。' };
  }

  const data = input as Partial<ReportData>;
  if (!isString(data.paper_title)) return { ok: false, message: '缺少或错误字段：paper_title。' };
  if (!isString(data.summary)) return { ok: false, message: '缺少或错误字段：summary。' };
  if (!isString(data.polished_text)) return { ok: false, message: '缺少或错误字段：polished_text。' };
  if (!Array.isArray(data.revision_items)) return { ok: false, message: '缺少或错误字段：revision_items。' };
  if (!Array.isArray(data.risk_items)) return { ok: false, message: '缺少或错误字段：risk_items。' };
  if (!Array.isArray(data.priority_actions)) return { ok: false, message: '缺少或错误字段：priority_actions。' };

  const revisionValid = data.revision_items.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      isString((item as RevisionItem).original) &&
      isString((item as RevisionItem).revised) &&
      isString((item as RevisionItem).edit_type) &&
      isString((item as RevisionItem).reason) &&
      isString((item as RevisionItem).learnable_rule)
  );
  if (!revisionValid) {
    return { ok: false, message: 'revision_items 中存在非法项，请检查字段类型。' };
  }

  const riskValid = data.risk_items.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      isString((item as RiskItem).title) &&
      isString((item as RiskItem).severity) &&
      isString((item as RiskItem).evidence_text) &&
      isString((item as RiskItem).explanation) &&
      isString((item as RiskItem).suggestion)
  );
  if (!riskValid) {
    return { ok: false, message: 'risk_items 中存在非法项，请检查字段类型。' };
  }

  const priorityValid = data.priority_actions.every((item) => isString(item));
  if (!priorityValid) {
    return { ok: false, message: 'priority_actions 必须是字符串数组。' };
  }

  return { ok: true, data: data as ReportData };
}
