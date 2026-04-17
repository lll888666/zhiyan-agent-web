import { useMemo, useState } from 'react';
import { useReportData } from './context/ReportDataContext';
import UnifiedPageHeader from './components/UnifiedPageHeader';

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

function normalizeSeverity(value: string): 'high' | 'medium' | 'low' | 'unknown' {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high' || normalized === 'h' || value === '高') return 'high';
  if (normalized === 'medium' || normalized === 'm' || value === '中') return 'medium';
  if (normalized === 'low' || normalized === 'l' || value === '低') return 'low';
  return 'unknown';
}

function severityLabel(value: string): string {
  const normalized = normalizeSeverity(value);
  if (normalized === 'high') return '高风险';
  if (normalized === 'medium') return '中风险';
  if (normalized === 'low') return '低风险';
  return value || '未知';
}

function filterLabel(value: SeverityFilter): string {
  if (value === 'all') return '全部';
  if (value === 'high') return '高风险';
  if (value === 'medium') return '中风险';
  return '低风险';
}

function RiskRadarPage() {
  const { reportData: data } = useReportData();
  const [filter, setFilter] = useState<SeverityFilter>('all');

  if (!data) {
    return (
      <main className="container">
        <UnifiedPageHeader
          tag="Risk Radar Panel"
          title="科研风险雷达面板"
          subtitle="按风险等级快速定位问题证据与优先修改方向"
        />
        <section className="panel">
          <p className="empty-state">当前没有可展示的报告数据，请先返回首页导入报告 JSON。</p>
        </section>
      </main>
    );
  }

  const highCount = useMemo(
    () => data.risk_items.filter((item) => normalizeSeverity(item.severity) === 'high').length,
    [data.risk_items]
  );
  const mediumCount = useMemo(
    () => data.risk_items.filter((item) => normalizeSeverity(item.severity) === 'medium').length,
    [data.risk_items]
  );
  const lowCount = useMemo(
    () => data.risk_items.filter((item) => normalizeSeverity(item.severity) === 'low').length,
    [data.risk_items]
  );

  const filteredRisks = useMemo(() => {
    if (filter === 'all') return data.risk_items;
    return data.risk_items.filter((item) => normalizeSeverity(item.severity) === filter);
  }, [data.risk_items, filter]);

  return (
    <main className="container">
      <UnifiedPageHeader
        tag="Risk Radar Panel"
        title="科研风险雷达面板"
        subtitle={`论文标题：${data.paper_title}`}
        links={[
          { to: '/report', label: '返回智能优化报告' },
          { to: '/revision-viewer', label: '可解释润色查看器' },
          { to: '/training-lab', label: '科研规范训练场' },
        ]}
        actions={
          <div className="risk-filter-row">
            <label>风险筛选：</label>
            <div className="risk-filter-group" role="group" aria-label="风险等级筛选">
              {(['all', 'high', 'medium', 'low'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`import-btn ${filter === level ? 'is-active' : ''}`}
                  onClick={() => setFilter(level)}
                >
                  {filterLabel(level)}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <section className="panel">
        <div className="risk-stats-grid">
          <article className="risk-stat-item risk-stat-high">
            <h3>高风险数量</h3>
            <p>{highCount}</p>
          </article>
          <article className="risk-stat-item risk-stat-medium">
            <h3>中风险数量</h3>
            <p>{mediumCount}</p>
          </article>
          <article className="risk-stat-item risk-stat-low">
            <h3>低风险数量</h3>
            <p>{lowCount}</p>
          </article>
        </div>
      </section>

      <section className="panel">
        {filteredRisks.length === 0 ? (
          <p className="empty-state">
            {data.risk_items.length === 0 ? '当前报告中暂无风险项。' : '当前筛选条件下暂无风险项。'}
          </p>
        ) : (
          <div className="risk-radar-grid">
            {filteredRisks.map((risk, idx) => {
              const normalized = normalizeSeverity(risk.severity);
              return (
                <article key={`${risk.title}-${idx}`} className="risk-radar-card">
                  <div className="risk-radar-head">
                    <h3>{risk.title}</h3>
                    <span className={`severity-pill severity-pill-${normalized}`}>{severityLabel(risk.severity)}</span>
                  </div>
                  <p>
                    <strong>证据片段：</strong>
                    {risk.evidence_text}
                  </p>
                  <p>
                    <strong>问题说明：</strong>
                    {risk.explanation}
                  </p>
                  <p>
                    <strong>修改建议：</strong>
                    {risk.suggestion}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>优先修改建议</h2>
        {data.priority_actions.length === 0 ? (
          <p className="empty-state">暂无优先修改建议。</p>
        ) : (
          <ol>
            {data.priority_actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default RiskRadarPage;
